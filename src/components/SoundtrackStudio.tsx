import React, { useState, useRef } from 'react';
import { 
  Music, 
  Sparkles, 
  Play, 
  Pause, 
  Download, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Check, 
  AlertCircle, 
  Disc,
  Image as ImageIcon
} from 'lucide-react';
import { GardenPlan, GardenSoundtrack } from '../types/garden';

interface SoundtrackStudioProps {
  garden: GardenPlan;
  onUpdateGarden: (updated: GardenPlan) => void;
}

export const SoundtrackStudio: React.FC<SoundtrackStudioProps> = ({
  garden,
  onUpdateGarden,
}) => {
  const [model, setModel] = useState<'lyria-3-clip-preview' | 'lyria-3-pro-preview'>('lyria-3-clip-preview');
  const [prompt, setPrompt] = useState(
    `Tranquil ${garden.style} ambient garden music with acoustic guitar, gentle wooden flute, distant songbirds, and soft breeze`
  );
  const [useGardenImage, setUseGardenImage] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeSoundtrack = garden.soundtrack;

  const presets = [
    {
      title: 'Zen Bamboo & Water Flute',
      prompt: 'Tranquil Japanese zen garden atmosphere with gentle bamboo shakuhachi flute, soft koto harp, and distant water droplet echoes, meditative peaceful acoustic',
    },
    {
      title: 'English Cottage Morning Strings',
      prompt: 'Warm acoustic fingerpicked guitar with gentle violin melody, soft harp, morning birdsong, romantic blooming cottage atmosphere',
    },
    {
      title: 'Mediterranean Sunlit Guitar',
      prompt: 'Sun-drenched Spanish nylon string guitar, warm acoustic chords, gentle Mediterranean evening breeze, and soothing cicada ambient texture',
    },
    {
      title: 'Twilight Garden Lanterns',
      prompt: 'Ethereal ambient dreamscape with soft piano, ambient pad strings, whimsical music box notes, twilight fireflies mood',
    },
    {
      title: 'Raindrops on Lush Foliage',
      prompt: 'Calming gentle summer rain falling on garden leaves, soft cello chords, ambient chimes, deep restorative tranquility',
    },
  ];

  const handleGenerateMusic = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setErrorMsg(null);

    let imageBase64: string | undefined = undefined;
    if (useGardenImage && garden.visuals && garden.visuals.length > 0) {
      imageBase64 = garden.visuals[selectedImageIdx]?.url;
    }

    try {
      const response = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model,
          imageBase64,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.audioUrl) {
        throw new Error(data.error || 'Failed to generate garden music track.');
      }

      const newSoundtrack: GardenSoundtrack = {
        id: 'track-' + Date.now(),
        audioUrl: data.audioUrl,
        prompt,
        model,
        durationLabel: data.durationLabel || (model === 'lyria-3-pro-preview' ? 'Full Track' : '30s Clip'),
        lyrics: data.lyrics,
        createdAt: new Date().toISOString(),
      };

      const updated = {
        ...garden,
        soundtrack: newSoundtrack,
      };

      onUpdateGarden(updated);
      setIsPlaying(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error creating music track with Lyria.');
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#143628] via-[#1b4332] to-[#143628] border border-emerald-700/60 rounded-2xl p-5 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-[#0f291e] shadow-lg shadow-emerald-950/40 shrink-0">
              <Music className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif text-2xl font-bold">Garden Soundscape Studio</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-400 text-amber-950">
                  Lyria Music AI
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Compose custom ambient musical soundtracks for {garden.title} using lyria-3-clip-preview or lyria-3-pro-preview
              </p>
            </div>
          </div>

          {/* Model Toggle */}
          <div className="flex rounded-xl bg-[#0c2219] p-1 border border-emerald-700/50 self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setModel('lyria-3-clip-preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                model === 'lyria-3-clip-preview'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              Short Clip (30s)
            </button>
            <button
              type="button"
              onClick={() => setModel('lyria-3-pro-preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                model === 'lyria-3-pro-preview'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              Full Track (Lyria Pro)
            </button>
          </div>
        </div>
      </div>

      {/* Generator Box */}
      <div className="bg-[#0f291e] border border-emerald-800/70 rounded-2xl p-5 shadow-xl text-white space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1.5">
            Soundtrack Vision & Instrumental Prompt
          </label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the mood, instruments, rhythm, and acoustic textures for your garden..."
            className="w-full bg-[#143628] border border-emerald-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder-emerald-500/60 focus:outline-none focus:border-emerald-400 leading-relaxed"
          />
        </div>

        {/* Preset Chips */}
        <div>
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-2">
            Curated Garden Soundscape Moods:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(p.prompt)}
                className="text-left p-2.5 rounded-xl bg-[#143628] hover:bg-[#1b4332] border border-emerald-800/60 text-xs transition-colors space-y-1"
              >
                <div className="font-semibold text-white flex items-center space-x-1.5">
                  <Disc className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{p.title}</span>
                </div>
                <p className="text-[11px] text-emerald-300/80 line-clamp-1">{p.prompt}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Optional Garden Visual Inspiration */}
        {garden.visuals && garden.visuals.length > 0 && (
          <div className="pt-3 border-t border-emerald-800/60 space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useImg"
                checked={useGardenImage}
                onChange={(e) => setUseGardenImage(e.target.checked)}
                className="rounded accent-emerald-500 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="useImg" className="text-xs text-emerald-200 font-medium cursor-pointer flex items-center space-x-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Compose music directly inspired by a garden visual</span>
              </label>
            </div>

            {useGardenImage && (
              <div className="flex space-x-2 overflow-x-auto py-1">
                {garden.visuals.map((vis, i) => (
                  <div
                    key={vis.id}
                    onClick={() => setSelectedImageIdx(i)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 cursor-pointer transition-all ${
                      selectedImageIdx === i ? 'border-emerald-400 ring-2 ring-emerald-400/40' : 'border-emerald-800 opacity-60'
                    }`}
                  >
                    <img src={vis.url} alt="inspiration" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2 border-t border-emerald-800/60">
          <span className="text-xs text-emerald-400 font-mono">
            Model: {model}
          </span>
          <button
            type="button"
            onClick={handleGenerateMusic}
            disabled={isGenerating || !prompt.trim()}
            className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-[#0f291e] font-bold text-sm rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Composing with Lyria AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Garden Soundtrack</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-amber-950/80 border border-amber-700/60 rounded-xl text-amber-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Active Soundtrack Player Card */}
      {activeSoundtrack && (
        <div className="bg-[#0f291e] border border-emerald-700/70 rounded-2xl p-6 shadow-2xl text-white space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Disc className={`w-6 h-6 ${isPlaying ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-300">
                  {activeSoundtrack.durationLabel} • {activeSoundtrack.model}
                </span>
                <h3 className="font-serif text-lg font-bold text-white mt-0.5">
                  Current Garden Soundtrack
                </h3>
              </div>
            </div>

            <a
              href={activeSoundtrack.audioUrl}
              download={`${garden.title.toLowerCase().replace(/\s+/g, '-')}-soundtrack.wav`}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#143628] hover:bg-[#1b4332] text-emerald-200 hover:text-white rounded-xl text-xs font-semibold border border-emerald-700/50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download WAV</span>
            </a>
          </div>

          <p className="text-xs text-emerald-300/90 leading-relaxed bg-[#143628] p-3 rounded-xl border border-emerald-800/40">
            "{activeSoundtrack.prompt}"
          </p>

          {/* HTML5 Audio Player */}
          <div className="flex items-center space-x-4 bg-[#143628] p-3 rounded-xl border border-emerald-800/60">
            <button
              type="button"
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#0f291e] flex items-center justify-center shadow-md transition-transform active:scale-95 shrink-0"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <audio
              ref={audioRef}
              src={activeSoundtrack.audioUrl}
              onEnded={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-8"
              controls
            />
          </div>
        </div>
      )}
    </div>
  );
};
