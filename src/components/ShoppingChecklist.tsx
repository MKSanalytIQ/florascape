import React, { useState } from 'react';
import { 
  ShoppingBag, 
  CheckSquare, 
  Square, 
  Printer, 
  DollarSign, 
  Layers, 
  Download,
  Check
} from 'lucide-react';
import { GardenPlan, ShoppingItem } from '../types/garden';

interface ShoppingChecklistProps {
  garden: GardenPlan;
}

export const ShoppingChecklist: React.FC<ShoppingChecklistProps> = ({ garden }) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const categories = [
    'All',
    'Plants',
    'Hardscape & Edging',
    'Soil & Mulch',
    'Irrigation & Lighting',
  ];

  const filteredItems = garden.shoppingList.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round(
    (completedCount / Math.max(1, garden.shoppingList.length)) * 100
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header and Summary */}
      <div className="bg-[#0f291e] border border-emerald-800/70 rounded-2xl p-6 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-6 h-6 text-emerald-400" />
              <h2 className="font-serif text-2xl font-bold">Procurement & Build Checklist</h2>
            </div>
            <p className="text-xs text-emerald-300/80 mt-1">
              Estimated nursery quantities and landscape supplies for {garden.title}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#143628] hover:bg-[#1b4332] text-emerald-200 hover:text-white rounded-xl text-xs font-semibold border border-emerald-700/50 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Checklist</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-[#143628] p-4 rounded-xl border border-emerald-800/60">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-emerald-300 font-semibold">
              Procurement Readiness: {completedCount} of {garden.shoppingList.length} items acquired
            </span>
            <span className="font-mono font-bold text-emerald-400">{progressPercent}%</span>
          </div>
          <div className="w-full bg-[#0c2219] h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-emerald-800/60">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-[#143628] text-emerald-300 hover:text-white hover:bg-[#1b4332]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Shopping Items List */}
      <div className="bg-[#0f291e] border border-emerald-800/70 rounded-2xl overflow-hidden shadow-xl text-white divide-y divide-emerald-800/40">
        {filteredItems.map((item, idx) => {
          const isDone = !!checkedItems[idx];
          return (
            <div
              key={idx}
              onClick={() => toggleCheck(idx)}
              className={`p-4 flex items-center justify-between hover:bg-[#143628] cursor-pointer transition-colors ${
                isDone ? 'bg-[#0c2219]/60 opacity-60' : ''
              }`}
            >
              <div className="flex items-center space-x-3.5 min-w-0">
                <button
                  type="button"
                  className="text-emerald-400 hover:text-emerald-300 shrink-0"
                >
                  {isDone ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-emerald-600" />
                  )}
                </button>

                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm font-semibold truncate ${
                        isDone ? 'line-through text-emerald-400' : 'text-white'
                      }`}
                    >
                      {item.item}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full ${
                        item.priority === 'Essential'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : item.priority === 'Recommended'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-400/80 mt-0.5">
                    Category: {item.category} • Est. Quantity: {item.estimatedQuantity}
                  </p>
                </div>
              </div>

              {/* Price Tag */}
              <div className="text-right shrink-0 pl-3">
                <span className="font-mono text-sm font-bold text-emerald-300">
                  {item.estimatedCost}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
