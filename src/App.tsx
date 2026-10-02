import React, { useState, useEffect } from 'react';
import { 
  getSavedGardens, 
  saveGarden, 
  deleteGarden, 
  getActiveGardenId, 
  setActiveGardenId 
} from './utils/storage';
import { GardenPlan, GardenPlant } from './types/garden';
import { Header } from './components/Header';
import { BlueprintCanvas } from './components/BlueprintCanvas';
import { VisualStudio } from './components/VisualStudio';
import { SoundtrackStudio } from './components/SoundtrackStudio';
import { PlantCatalog } from './components/PlantCatalog';
import { BloomTimeline } from './components/BloomTimeline';
import { ShoppingChecklist } from './components/ShoppingChecklist';
import { GardenWizardModal } from './components/GardenWizardModal';
import { 
  auth, 
  signInWithGoogle, 
  signOutUser 
} from './firebase';
import { 
  saveGardenToFirestore, 
  deleteGardenFromFirestore, 
  subscribeUserGardens 
} from './services/gardenFirestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  Sparkles, 
  Compass, 
  Sun, 
  Droplets, 
  Layers, 
  Image as ImageIcon,
  Music,
  Cloud,
  Wand2
} from 'lucide-react';

export default function App() {
  const [gardens, setGardens] = useState<GardenPlan[]>(() => getSavedGardens());
  const [activeGardenId, setActiveId] = useState<string>(() => getActiveGardenId());
  const [activeTab, setActiveTab] = useState<'blueprint' | 'visuals' | 'soundtrack' | 'plants' | 'bloom' | 'shopping'>('blueprint');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [prefilledStudioPrompt, setPrefilledStudioPrompt] = useState<string | undefined>(undefined);
  const [selectedPlant, setSelectedPlant] = useState<GardenPlant | null>(null);

  // Firebase Auth State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const activeGarden = gardens.find((g) => g.id === activeGardenId) || gardens[0];

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Firestore Data Synchronization
  useEffect(() => {
    if (!user) return;

    // Listen to user's gardens in Firestore
    const unsubscribe = subscribeUserGardens(
      user.uid,
      (firestoreGardens) => {
        if (firestoreGardens.length > 0) {
          setGardens((prev) => {
            const map = new Map<string, GardenPlan>();
            // Add firestore records first
            firestoreGardens.forEach((g) => map.set(g.id, g));
            // Add local presets if not existing
            prev.forEach((g) => {
              if (!map.has(g.id)) map.set(g.id, g);
            });
            return Array.from(map.values());
          });
        } else {
          // If Firestore is empty for this user, upload the current active garden
          saveGardenToFirestore(activeGarden, user.uid).catch(console.error);
        }
      },
      (err) => {
        console.warn('Firestore subscription notice:', err);
      }
    );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    setActiveGardenId(activeGarden.id);
  }, [activeGarden.id]);

  const handleSelectGarden = (garden: GardenPlan) => {
    setActiveId(garden.id);
    setActiveGardenId(garden.id);
  };

  const handleGardenCreated = (newPlan: GardenPlan) => {
    const planWithUser: GardenPlan = {
      ...newPlan,
      userId: user?.uid,
    };
    saveGarden(planWithUser);
    if (user) {
      saveGardenToFirestore(planWithUser, user.uid).catch(console.error);
    }
    setGardens((prev) => [planWithUser, ...prev]);
    setActiveId(planWithUser.id);
    setActiveGardenId(planWithUser.id);
    setActiveTab('blueprint');
  };

  const handleDeleteGarden = (id: string) => {
    const remaining = deleteGarden(id);
    if (user) {
      deleteGardenFromFirestore(id, user.uid).catch(console.error);
    }
    setGardens(remaining);
    if (activeGardenId === id) {
      setActiveId(remaining[0].id);
      setActiveGardenId(remaining[0].id);
    }
  };

  const handleUpdateGarden = (updated: GardenPlan) => {
    const updatedPlan: GardenPlan = {
      ...updated,
      userId: user?.uid || updated.userId,
    };
    saveGarden(updatedPlan);
    if (user) {
      saveGardenToFirestore(updatedPlan, user.uid).catch(console.error);
    }
    setGardens((prev) => prev.map((g) => (g.id === updatedPlan.id ? updatedPlan : g)));
  };

  const handleOpenStudioWithPrompt = (prompt: string) => {
    setPrefilledStudioPrompt(prompt);
    setActiveTab('visuals');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Sign-in failed:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error('Sign-out failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#091b13] text-[#e8f5ed] flex flex-col font-sans selection:bg-emerald-500 selection:text-[#091b13]">
      {/* Top App Header with Auth & Tabs */}
      <Header
        gardens={gardens}
        activeGarden={activeGarden}
        onSelectGarden={handleSelectGarden}
        onOpenWizard={() => setWizardOpen(true)}
        onDeleteGarden={handleDeleteGarden}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Garden Hero Overview Card */}
        <section className="bg-gradient-to-br from-[#123023] via-[#0f291e] to-[#0d2319] border border-emerald-800/80 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-500 text-[#091b13] shadow-sm">
                  {activeGarden.style} Style
                </span>
                <span className="text-xs text-emerald-400 font-mono flex items-center space-x-1">
                  <Compass className="w-3.5 h-3.5" />
                  <span>{activeGarden.dimensions.lengthFt} × {activeGarden.dimensions.widthFt} ft ({activeGarden.dimensions.totalSqFt} sq ft)</span>
                </span>
                <span className="text-emerald-500">•</span>
                <span className="text-xs text-emerald-300">
                  {activeGarden.plants.length} Plant Varieties
                </span>
                {user && (
                  <>
                    <span className="text-emerald-500">•</span>
                    <span className="text-[11px] text-emerald-400 flex items-center space-x-1 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
                      <Cloud className="w-3 h-3 text-emerald-400" />
                      <span>Synced to Firestore</span>
                    </span>
                  </>
                )}
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                {activeGarden.title}
              </h1>

              <p className="text-sm font-medium text-emerald-300/90 italic font-serif">
                "{activeGarden.tagline}"
              </p>

              <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed pt-1">
                {activeGarden.designNarrative}
              </p>
            </div>

            {/* Quick Actions & Visual Count */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 self-start lg:self-center">
              <button
                type="button"
                onClick={() => {
                  setPrefilledStudioPrompt(activeGarden.suggestedImagePrompts?.[0]?.prompt);
                  setActiveTab('visuals');
                }}
                className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-[#091b13] font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950/60 transition-all transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-[#091b13]" />
                <span>Create Visual with Gemini</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('soundtrack')}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#143628] hover:bg-[#1b4332] text-emerald-200 hover:text-white font-semibold text-xs sm:text-sm rounded-xl border border-emerald-700/50 transition-colors"
              >
                <Music className="w-4 h-4 text-emerald-400" />
                <span>Garden Soundscape</span>
              </button>

              <button
                type="button"
                onClick={() => setWizardOpen(true)}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#1b4332] hover:bg-[#255741] text-emerald-200 hover:text-white font-semibold text-xs sm:text-sm rounded-xl border border-emerald-700/50 transition-colors"
              >
                <Wand2 className="w-4 h-4 text-emerald-400" />
                <span>Design Another Garden</span>
              </button>
            </div>
          </div>
        </section>

        {/* Tab Content Display */}
        {activeTab === 'blueprint' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-white flex items-center space-x-2">
                <span>Interactive 2D Spatial Blueprint</span>
              </h2>
              <span className="text-xs text-emerald-400 hidden sm:inline">
                Click any botanical marker to inspect specifications & companions
              </span>
            </div>
            <BlueprintCanvas
              garden={activeGarden}
              onSelectPlant={(p) => setSelectedPlant(p)}
              onOpenImageStudioWithPrompt={handleOpenStudioWithPrompt}
            />
          </section>
        )}

        {activeTab === 'visuals' && (
          <section>
            <VisualStudio
              garden={activeGarden}
              onUpdateGarden={handleUpdateGarden}
              initialPrompt={prefilledStudioPrompt}
            />
          </section>
        )}

        {activeTab === 'soundtrack' && (
          <section>
            <SoundtrackStudio
              garden={activeGarden}
              onUpdateGarden={handleUpdateGarden}
            />
          </section>
        )}

        {activeTab === 'plants' && (
          <section>
            <PlantCatalog
              garden={activeGarden}
              onOpenImageStudioWithPrompt={handleOpenStudioWithPrompt}
              onSelectPlantForBlueprint={(p) => {
                setSelectedPlant(p);
                setActiveTab('blueprint');
              }}
            />
          </section>
        )}

        {activeTab === 'bloom' && (
          <section>
            <BloomTimeline garden={activeGarden} />
          </section>
        )}

        {activeTab === 'shopping' && (
          <section>
            <ShoppingChecklist garden={activeGarden} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#123023] bg-[#07150f] py-6 text-xs text-emerald-400/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-white text-sm">FloraScape</span>
            <span>• Horticultural Design & AI Visualization Studio</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Powered by Gemini 3.8 Flash, Gemini 3.1 Flash Image & Lyria Music AI</span>
            <span>• Firestore Cloud Persistence</span>
          </div>
        </div>
      </footer>

      {/* Garden Generator Modal */}
      <GardenWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onGardenCreated={handleGardenCreated}
      />
    </div>
  );
}
