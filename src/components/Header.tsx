import React, { useState } from 'react';
import { 
  Sprout, 
  Sparkles, 
  Map, 
  Image as ImageIcon, 
  BookOpen, 
  Calendar, 
  ShoppingBag, 
  Plus, 
  ChevronDown, 
  Trash2,
  Share2,
  Check,
  Music,
  LogIn,
  LogOut,
  Cloud,
  User as UserIcon
} from 'lucide-react';
import { User } from 'firebase/auth';
import { GardenPlan } from '../types/garden';

interface HeaderProps {
  gardens: GardenPlan[];
  activeGarden: GardenPlan;
  onSelectGarden: (garden: GardenPlan) => void;
  onOpenWizard: () => void;
  onDeleteGarden: (id: string) => void;
  activeTab: 'blueprint' | 'visuals' | 'soundtrack' | 'plants' | 'bloom' | 'shopping';
  onTabChange: (tab: 'blueprint' | 'visuals' | 'soundtrack' | 'plants' | 'bloom' | 'shopping') => void;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  gardens,
  activeGarden,
  onSelectGarden,
  onOpenWizard,
  onDeleteGarden,
  activeTab,
  onTabChange,
  user,
  onSignIn,
  onSignOut,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  interface NavTab {
    id: 'blueprint' | 'visuals' | 'soundtrack' | 'plants' | 'bloom' | 'shopping';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    count?: number;
  }

  const tabs: NavTab[] = [
    { id: 'blueprint', label: '2D Layout Blueprint', icon: Map },
    { id: 'visuals', label: 'AI Visual Studio', icon: ImageIcon, badge: 'Create & Edit' },
    { id: 'soundtrack', label: 'Soundtrack Studio', icon: Music, badge: 'Lyria AI' },
    { id: 'plants', label: 'Botanical Catalog', icon: BookOpen, count: activeGarden.plants.length },
    { id: 'bloom', label: 'Bloom & Companions', icon: Calendar },
    { id: 'shopping', label: 'Procurement Guide', icon: ShoppingBag, count: activeGarden.shoppingList.length },
  ];

  return (
    <header className="bg-[#0f291e] text-white border-b border-[#1b4332] sticky top-0 z-40 shadow-lg">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-950/40">
              <Sprout className="w-6 h-6 text-[#0f291e]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                  FloraScape
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-emerald-900/80 text-emerald-300 border border-emerald-700/50">
                  Dream Garden AI
                </span>
              </div>
              <p className="text-xs text-emerald-300/70 hidden sm:block">
                Architectural layouts & botanical synthesis
              </p>
            </div>
          </div>

          {/* Garden Switcher, Auth & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Garden Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 bg-[#1b4332] hover:bg-[#255741] text-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-700/40 transition-colors text-sm font-medium focus:outline-none"
              >
                <span className="truncate max-w-[110px] sm:max-w-[170px] text-left">
                  {activeGarden.title}
                </span>
                <ChevronDown className="w-4 h-4 text-emerald-400 shrink-0" />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#143628] rounded-xl shadow-2xl border border-emerald-700/50 z-20 py-2 divide-y divide-emerald-800/40">
                    <div className="px-3 py-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Saved Garden Plans ({gardens.length})</span>
                      {user && (
                        <span className="text-[10px] text-emerald-300 flex items-center space-x-1">
                          <Cloud className="w-3 h-3 text-emerald-400" />
                          <span>Firestore Cloud</span>
                        </span>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto py-1">
                      {gardens.map((g) => {
                        const isSelected = g.id === activeGarden.id;
                        return (
                          <div
                            key={g.id}
                            className={`flex items-center justify-between px-3 py-2 hover:bg-[#1f4e3b] transition-colors cursor-pointer ${
                              isSelected ? 'bg-[#1b4332] text-white font-medium' : 'text-emerald-200'
                            }`}
                            onClick={() => {
                              onSelectGarden(g);
                              setDropdownOpen(false);
                            }}
                          >
                            <div className="min-w-0 pr-2">
                              <p className="text-sm truncate">{g.title}</p>
                              <p className="text-xs text-emerald-400/80">
                                {g.dimensions.lengthFt}×{g.dimensions.widthFt} ft • {g.style} style
                              </p>
                            </div>
                            {gardens.length > 1 && (
                              <button
                                type="button"
                                title="Delete garden plan"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteGarden(g.id);
                                }}
                                className="p-1 hover:text-red-400 text-emerald-500 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="p-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          onOpenWizard();
                        }}
                        className="w-full flex items-center justify-center space-x-1.5 py-1.5 text-xs font-semibold text-emerald-200 hover:text-white bg-emerald-800/60 hover:bg-emerald-700/80 rounded-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create New Dream Garden</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Firebase Auth Google Sign In Button */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-1.5 bg-[#1b4332] hover:bg-[#255741] text-emerald-100 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-emerald-700/40 transition-colors text-xs font-medium"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-5 h-5 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <UserIcon className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className="hidden md:inline truncate max-w-[90px]">
                    {user.displayName?.split(' ')[0] || 'User'}
                  </span>
                  <Cloud className="w-3.5 h-3.5 text-emerald-400 hidden sm:inline" />
                </button>

                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-[#143628] rounded-xl shadow-2xl border border-emerald-700/50 z-20 py-2 divide-y divide-emerald-800/40">
                      <div className="px-3 py-2 text-xs">
                        <p className="font-semibold text-white truncate">{user.displayName || 'Gardener'}</p>
                        <p className="text-[11px] text-emerald-400 truncate">{user.email}</p>
                        <div className="flex items-center space-x-1 mt-1 text-[10px] text-emerald-300">
                          <Cloud className="w-3 h-3 text-emerald-400" />
                          <span>Synced with Firestore</span>
                        </div>
                      </div>
                      <div className="p-1">
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onSignOut();
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-red-300 hover:text-red-200 hover:bg-red-950/40 rounded-lg transition-colors text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onSignIn}
                className="flex items-center space-x-1.5 bg-[#1b4332] hover:bg-[#255741] text-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-700/40 transition-colors text-xs font-semibold"
                title="Sign in with Google to sync to Firestore"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Sign in with Google</span>
                <span className="sm:hidden">Sign In</span>
              </button>
            )}

            {/* Share / Copy Link */}
            <button
              type="button"
              onClick={handleShare}
              title="Share garden plan link"
              className="p-2 bg-[#1b4332] hover:bg-[#255741] text-emerald-200 rounded-lg border border-emerald-700/40 transition-colors hidden sm:flex items-center justify-center"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* New Garden Wizard CTA */}
            <button
              type="button"
              onClick={onOpenWizard}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#0f291e] px-3.5 py-1.5 rounded-lg text-sm font-semibold shadow-md shadow-emerald-950/50 transition-all transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden xs:inline">Design Garden</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-[#0b2017] border-t border-[#163a2b] overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-3 py-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id as any)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950/50'
                      : 'text-emerald-300 hover:text-white hover:bg-[#143628]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-amber-400 text-amber-950">
                      {tab.badge}
                    </span>
                  )}
                  {tab.count !== undefined && (
                    <span className={`text-xs px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-emerald-700 text-white' : 'bg-[#1b4332] text-emerald-300'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
