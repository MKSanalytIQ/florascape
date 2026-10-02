import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Image as ImageIcon, 
  Download, 
  RefreshCw, 
  Layers, 
  ArrowRight, 
  Check, 
  Copy, 
  Sliders, 
  AlertCircle,
  Eye,
  Trash2,
  Maximize2
} from 'lucide-react';
import { GardenPlan, GardenVisualImage } from '../types/garden';

interface VisualStudioProps {
  garden: GardenPlan;
  onUpdateGarden: (updated: GardenPlan) => void;
  initialPrompt?: string;
}

export const VisualStudio: React.FC<VisualStudioProps> = ({
  garden,
  onUpdateGarden,
  initialPrompt,
}) => {
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  
  // Creation state
  const [createPrompt, setCreatePrompt] = useState(
    initialPrompt ||
    garden.suggestedImagePrompts?.[0]?.prompt ||
    `A breathtaking ${garden.style} dream garden with winding stone pathway, lush flowering borders, sunny afternoon light, architectural landscape photography`
  );
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3' | '1:1' | '3:4'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Edit state
  const [selectedImageForEdit, setSelectedImageForEdit] = useState<GardenVisualImage | null>(
    garden.visuals && garden.visuals.length > 0 ? garden.visuals[0] : null
  );
  const [editPrompt, setEditPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [comparisonActive, setComparisonActive] = useState(false);
  const [latestEditedPair, setLatestEditedPair] = useState<{ before: string; after: string } | null>(null);

  // Selected image for modal preview
  const [lightboxImage, setLightboxImage] = useState<GardenVisualImage | null>(null);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  // Prompt enhancement helper: embeds active plants and style
  const handleEnhancePrompt = () => {
    const topPlants = garden.plants.slice(0, 4).map((p) => p.commonName).join(', ');
    const topZone = garden.zones[0]?.name || 'terrace';
    const enhanced = `Architectural landscape photograph of a luxury ${garden.style} garden featuring ${topPlants}. Centered around ${topZone} with curved flagstone paths, lush botanical layers, volumetric golden hour morning sunlight filtering through tree canopies, 8k resolution, crisp photorealistic details.`;
    setCreatePrompt(enhanced);
  };

  // Generate new image via POST /api/generate-image (gemini-3.1-flash-image-preview)
  const handleGenerateImage = async () => {
    if (!createPrompt.trim()) return;

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: createPrompt,
          aspectRatio,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.imageUrl) {
        throw new Error(data.error || 'Failed to generate visual from Gemini Image model.');
      }

      const newVisual: GardenVisualImage = {
        id: 'vis-' + Date.now(),
        url: data.imageUrl,
        prompt: createPrompt,
        aspectRatio,
        createdAt: new Date().toISOString(),
        perspectiveLabel: 'AI Generated Landscape',
      };

      const updatedGarden = {
        ...garden,
        visuals: [newVisual, ...(garden.visuals || [])],
      };

      onUpdateGarden(updatedGarden);
      setSelectedImageForEdit(newVisual);
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || 'Error creating image with Gemini Image model.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Edit existing image via POST /api/edit-image (gemini-3.1-flash-image-preview)
  const handleEditImage = async () => {
    if (!selectedImageForEdit || !editPrompt.trim()) return;

    setIsEditing(true);
    setEditError(null);

    try {
      const res = await fetch('/api/edit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImageForEdit.url,
          editPrompt,
          aspectRatio: selectedImageForEdit.aspectRatio || '16:9',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.imageUrl) {
        throw new Error(data.error || 'Failed to edit visual with Gemini Image model.');
      }

      const editedVisual: GardenVisualImage = {
        id: 'vis-edit-' + Date.now(),
        url: data.imageUrl,
        prompt: `Edited: ${editPrompt} (from: "${selectedImageForEdit.prompt.slice(0, 50)}...")`,
        aspectRatio: selectedImageForEdit.aspectRatio,
        createdAt: new Date().toISOString(),
        parentImageId: selectedImageForEdit.id,
        editInstruction: editPrompt,
        perspectiveLabel: `Edited: ${editPrompt.slice(0, 30)}...`,
      };

      setLatestEditedPair({
        before: selectedImageForEdit.url,
        after: data.imageUrl,
      });
      setComparisonActive(true);

      const updatedGarden = {
        ...garden,
        visuals: [editedVisual, ...(garden.visuals || [])],
      };

      onUpdateGarden(updatedGarden);
      setSelectedImageForEdit(editedVisual);
      setEditPrompt('');
    } catch (err: any) {
      console.error(err);
      setEditError(err.message || 'Error editing image with Gemini Image model.');
    } finally {
      setIsEditing(false);
    }
  };

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const handleDeleteVisual = (id: string) => {
    const updated = {
      ...garden,
      visuals: (garden.visuals || []).filter((v) => v.id !== id),
    };
    onUpdateGarden(updated);
    if (selectedImageForEdit?.id === id) {
      setSelectedImageForEdit(updated.visuals[0] || null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-r from-[#143628] via-[#1b4332] to-[#143628] border border-emerald-700/60 rounded-2xl p-5 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-[#0f291e] shadow-lg shadow-emerald-950/40 shrink-0">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif text-2xl font-bold">AI Garden Visual Studio</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-400 text-amber-950">
                  gemini-3.1-flash-image-preview
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Generate high-definition photographic garden concepts or modify existing views with natural language text prompts
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-[#0c2219] p-1 border border-emerald-700/50 self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setMode('create')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                mode === 'create'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Create New Image</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('edit')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                mode === 'edit'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Edit / Transform Image</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Box */}
      {mode === 'create' ? (
        /* CREATE MODE */
        <div className="bg-[#0f291e] border border-emerald-800/70 rounded-2xl p-5 shadow-xl text-white space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center space-x-2">
              <Wand2 className="w-4 h-4 text-emerald-400" />
              <span>Text Prompt to Create Garden Visual</span>
            </span>
            <button
              type="button"
              onClick={handleEnhancePrompt}
              className="flex items-center space-x-1.5 text-xs text-emerald-300 hover:text-white px-2.5 py-1 rounded-lg bg-[#163a2b] hover:bg-[#1f4e3b] border border-emerald-700/40 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Enhance with Garden Elements</span>
            </button>
          </div>

          {/* Prompt Input */}
          <div className="relative">
            <textarea
              rows={3}
              value={createPrompt}
              onChange={(e) => setCreatePrompt(e.target.value)}
              placeholder="Describe your desired garden visual (e.g. A lush English cottage garden with curved stone walking paths, overflowing purple foxgloves and pink climbing roses on a cedar arbour...)"
              className="w-full bg-[#143628] border border-emerald-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder-emerald-500/60 focus:outline-none focus:border-emerald-400 leading-relaxed"
            />
          </div>

          {/* Quick Preset Prompts */}
          <div>
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-2">
              Quick Inspiration Prompts:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                'Golden hour morning mist with dewy lavender and roses along stone path',
                'Twilight garden party with glowing warm fairy lights on cedar pergola',
                'Architectural drone overhead layout render showing all zones and paths',
                'Cozy outdoor dining patio with carved stone fountain and terracotta pots',
                'Macro botanical close-up of blooming pollinator perennials with bumblebee'
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCreatePrompt(preset)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-[#143628] hover:bg-[#1b4332] text-emerald-300 hover:text-white border border-emerald-800/60 transition-colors text-left"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Settings Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-emerald-800/60">
            {/* Aspect Ratio */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-emerald-300 font-medium">Aspect Ratio:</span>
              <div className="flex rounded-lg bg-[#143628] p-1 border border-emerald-800/60">
                {(['16:9', '4:3', '1:1', '3:4'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
                      aspectRatio === ratio
                        ? 'bg-emerald-600 text-white'
                        : 'text-emerald-300 hover:text-white'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Action CTA */}
            <button
              type="button"
              onClick={handleGenerateImage}
              disabled={isGenerating || !createPrompt.trim()}
              className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-[#0f291e] font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/50 transition-all transform active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Image with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Garden Visual</span>
                </>
              )}
            </button>
          </div>

          {generationError && (
            <div className="p-3 bg-amber-950/80 border border-amber-700/60 rounded-xl text-amber-200 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{generationError}</span>
            </div>
          )}
        </div>
      ) : (
        /* EDIT MODE */
        <div className="bg-[#0f291e] border border-emerald-800/70 rounded-2xl p-5 shadow-xl text-white space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Edit Image with Text Prompts (gemini-3.1-flash-image-preview)</span>
            </span>
            <span className="text-xs text-emerald-400">
              Select an image below, then type what to add, remove, or transform
            </span>
          </div>

          {/* Selected Image Preview & Editor Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {/* Left: Image to Edit */}
            <div className="space-y-2">
              <span className="text-xs text-emerald-300 font-semibold block">
                Target Image to Edit:
              </span>
              {selectedImageForEdit ? (
                <div className="relative rounded-xl overflow-hidden border border-emerald-700/50 bg-[#143628] aspect-video">
                  <img
                    src={selectedImageForEdit.url}
                    alt="Target garden view"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-[11px] text-emerald-200 truncate">
                    {selectedImageForEdit.perspectiveLabel || selectedImageForEdit.prompt}
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-[#143628] rounded-xl border border-dashed border-emerald-700/60 flex flex-col items-center justify-center p-4 text-center text-emerald-400 text-xs">
                  <ImageIcon className="w-8 h-8 text-emerald-500 mb-2 opacity-60" />
                  <span>No image selected. Pick one from the gallery below or generate a new one first.</span>
                </div>
              )}

              {/* Gallery Thumbnails to Pick From */}
              {garden.visuals && garden.visuals.length > 0 && (
                <div>
                  <span className="text-[11px] text-emerald-400 block mb-1">
                    Choose from your garden gallery:
                  </span>
                  <div className="flex space-x-2 overflow-x-auto py-1">
                    {garden.visuals.map((vis) => {
                      const isSelected = selectedImageForEdit?.id === vis.id;
                      return (
                        <div
                          key={vis.id}
                          onClick={() => setSelectedImageForEdit(vis)}
                          className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 cursor-pointer transition-all ${
                            isSelected ? 'border-emerald-400 ring-2 ring-emerald-400/40' : 'border-emerald-800 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={vis.url}
                            alt="thumbnail"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Prompt Editor & Quick Modifiers */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1.5">
                  Natural Language Edit Instruction
                </label>
                <textarea
                  rows={3}
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="e.g., Add a bubbling stone water fountain in the center of the lawn, surrounded by purple irises."
                  className="w-full bg-[#143628] border border-emerald-700/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-emerald-500/60 focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Quick Modifier Chips */}
              <div>
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1.5">
                  Quick Edit Starters:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Add a stone fountain with water lilies',
                    'Add a wooden pergola with purple wisteria',
                    'Change time to twilight with cozy string lights',
                    'Add flowering lavender along the walkway',
                    'Make it an autumn scene with amber foliage',
                    'Add a rustic stone fire pit with wooden chairs'
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditPrompt(chip)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-[#143628] hover:bg-[#1b4332] text-emerald-300 hover:text-white border border-emerald-800/60 transition-colors"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Edit CTA */}
              <button
                type="button"
                onClick={handleEditImage}
                disabled={isEditing || !selectedImageForEdit || !editPrompt.trim()}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-[#0f291e] font-bold text-sm rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-50"
              >
                {isEditing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Applying Image Transformations with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Apply Image Edit</span>
                  </>
                )}
              </button>

              {editError && (
                <div className="p-3 bg-amber-950/80 border border-amber-700/60 rounded-xl text-amber-200 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>{editError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Before & After Comparison Drawer if an edit was just made */}
          {comparisonActive && latestEditedPair && (
            <div className="p-4 bg-[#143628] rounded-xl border border-emerald-600/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Image Transformation Complete (Before vs After)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setComparisonActive(false)}
                  className="text-xs text-emerald-400 hover:text-white"
                >
                  Dismiss Comparison
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-emerald-400 block">Original</span>
                  <div className="rounded-lg overflow-hidden border border-emerald-800 aspect-video">
                    <img
                      src={latestEditedPair.before}
                      alt="Before edit"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-emerald-300 block">
                    Transformed by Gemini
                  </span>
                  <div className="rounded-lg overflow-hidden border border-emerald-400 aspect-video">
                    <img
                      src={latestEditedPair.after}
                      alt="After edit"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Garden Visuals Gallery */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-serif text-lg font-bold text-white">
              Garden Visual Gallery
            </h3>
            <span className="text-xs text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
              {garden.visuals?.length || 0} renders
            </span>
          </div>
          <p className="text-xs text-emerald-300/80 hidden sm:block">
            Click any render to enlarge, download, or edit
          </p>
        </div>

        {garden.visuals && garden.visuals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {garden.visuals.map((vis) => (
              <div
                key={vis.id}
                className="group bg-[#0f291e] border border-emerald-800/70 hover:border-emerald-500 rounded-xl overflow-hidden shadow-lg transition-all flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-video bg-[#143628] overflow-hidden">
                  <img
                    src={vis.url}
                    alt={vis.prompt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex items-center space-x-1.5">
                    {vis.editInstruction ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950 shadow-md">
                        Transformed
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-md">
                        Render
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/60 text-emerald-200">
                      {vis.aspectRatio}
                    </span>
                  </div>

                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <button
                      type="button"
                      title="Enlarge preview"
                      onClick={() => setLightboxImage(vis)}
                      className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Edit this image"
                      onClick={() => {
                        setSelectedImageForEdit(vis);
                        setMode('edit');
                      }}
                      className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors"
                    >
                      <Sliders className="w-4 h-4" />
                    </button>
                    <a
                      href={vis.url}
                      download={`florascape-garden-${vis.id}.png`}
                      title="Download image"
                      className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Info & Prompt Bar */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <p className="text-xs text-emerald-200 line-clamp-2 leading-relaxed">
                    {vis.editInstruction ? `Edit: ${vis.editInstruction}` : vis.prompt}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-emerald-900/60 text-[11px] text-emerald-400/80">
                    <span>{new Date(vis.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleCopyPrompt(vis.id, vis.prompt)}
                        className="hover:text-white transition-colors"
                        title="Copy prompt"
                      >
                        {copiedPromptId === vis.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteVisual(vis.id)}
                        className="hover:text-red-400 transition-colors"
                        title="Delete render"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-[#0f291e] border border-dashed border-emerald-800 rounded-2xl text-center text-emerald-300 space-y-2">
            <ImageIcon className="w-10 h-10 text-emerald-600 mx-auto opacity-70" />
            <p className="text-sm font-semibold text-white">No visuals rendered yet</p>
            <p className="text-xs text-emerald-400/80 max-w-md mx-auto">
              Use the prompt box above to generate your first photorealistic garden visualization with Gemini!
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div 
            className="max-w-4xl w-full bg-[#0f291e] border border-emerald-700 rounded-2xl overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video max-h-[75vh] bg-black">
              <img
                src={lightboxImage.url}
                alt="Enlarged garden render"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-4 bg-[#143628] flex items-center justify-between text-white">
              <p className="text-xs text-emerald-200 line-clamp-2 max-w-xl">
                {lightboxImage.prompt}
              </p>
              <div className="flex items-center space-x-2 shrink-0">
                <a
                  href={lightboxImage.url}
                  download={`florascape-${lightboxImage.id}.png`}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  type="button"
                  onClick={() => setLightboxImage(null)}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-200 rounded-lg text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
