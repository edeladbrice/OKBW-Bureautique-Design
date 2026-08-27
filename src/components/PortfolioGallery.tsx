import React, { useState } from 'react';
import { 
  Palette, 
  Layers, 
  ExternalLink, 
  Sparkles, 
  Eye, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare, 
  X,
  Sliders
} from 'lucide-react';
import { PortfolioItem, ServiceItem } from '../types';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { CONTACT_INFO, SERVICES_DATA } from '../data/servicesData';

interface PortfolioGalleryProps {
  onSelectServiceForOrder: (service: ServiceItem) => void;
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({ onSelectServiceForOrder }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeModalItem, setActiveModalItem] = useState<PortfolioItem | null>(null);
  const [beforeAfterSlider, setBeforeAfterSlider] = useState<number>(50);

  const categories = [
    { id: 'all', label: 'Toutes les Réalisations' },
    { id: 'design', label: 'Affiches, Logos & Branding' },
    { id: 'bureautique', label: 'CV Pros & Mémoires' },
    { id: 'web', label: 'Sites Web & E-commerce' },
  ];

  const filteredItems = activeCategory === 'all'
    ? PORTFOLIO_DATA
    : PORTFOLIO_DATA.filter(item => item.category === activeCategory);

  const handleOrderSimilar = (item: PortfolioItem) => {
    // Find matching service
    let targetService = SERVICES_DATA.find(s => {
      if (item.id === 'portfolio-1') return s.id === 'creation-affiche';
      if (item.id === 'portfolio-2') return s.id === 'cv-premium';
      if (item.id === 'portfolio-3') return s.id === 'creation-logo';
      if (item.id === 'portfolio-4') return s.id === 'retouche-photo';
      if (item.id === 'portfolio-5') return s.id === 'saisie-texte';
      if (item.id === 'portfolio-6') return s.id === 'web-multipage';
      return s.category === item.category;
    });

    if (!targetService) {
      targetService = SERVICES_DATA[0];
    }

    setActiveModalItem(null);
    onSelectServiceForOrder(targetService);
  };

  return (
    <section id="portfolio" className="py-20 bg-slate-900 text-white scroll-mt-16 relative overflow-hidden">
      
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#0F52BA]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF8800]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#FF8800] text-xs font-bold uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5" />
            <span>Galerie & Portfolio Visuel</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] tracking-tight text-white">
            Nos Réalisations de Design & Projets Éditoriaux
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Découvrez un aperçu de nos créations d'affiches percutantes, logos sur-mesure, CVs haute direction et solutions documentaires livrées avec succès.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-[#FF8800] text-white shadow-lg shadow-orange-500/25 scale-105'
                  : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Bento Grid Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModalItem(item)}
              className="group relative bg-slate-800/80 rounded-3xl border border-slate-700/80 overflow-hidden cursor-pointer hover:border-[#FF8800]/60 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>

                {/* Top Badge */}
                <div className="absolute top-3.5 left-3.5">
                  <span className="px-3 py-1 rounded-xl bg-slate-900/90 backdrop-blur-sm border border-slate-700 text-[#FF8800] text-[11px] font-bold">
                    {item.categoryLabel}
                  </span>
                </div>

                {/* Hover Quick Action */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/40 backdrop-blur-[2px]">
                  <span className="px-4 py-2 rounded-2xl bg-[#FF8800] text-white text-xs font-black shadow-lg flex items-center space-x-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Eye className="w-4 h-4" />
                    <span>Voir le Projet</span>
                  </span>
                </div>
              </div>

              {/* Bottom Card Info */}
              <div className="p-6 space-y-3">
                <div className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">
                  Client : {item.client}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit'] group-hover:text-[#FF8800] transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Tags */}
                <div className="flex items-center flex-wrap gap-1.5 pt-2">
                  {item.tags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-slate-300 text-[10px] font-medium border border-slate-700/60">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Highlight banner */}
                <div className="pt-3 border-t border-slate-700/60 flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 flex-shrink-0 text-[#FF8800]" />
                  <span className="line-clamp-1">{item.highlight}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Lightbox / Project Details Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div 
            className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Area (Standard Image OR Before/After interactive preview) */}
            <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
              {activeModalItem.beforeImage && activeModalItem.afterImage ? (
                <div className="relative w-full h-full select-none">
                  {/* After Image */}
                  <img
                    src={activeModalItem.afterImage}
                    alt="Après transformation"
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Before Image with clip path based on slider */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${beforeAfterSlider}%` }}
                  >
                    <img
                      src={activeModalItem.beforeImage}
                      alt="Avant transformation"
                      className="absolute inset-0 w-full h-full object-cover max-w-none"
                      style={{ width: '100%' }}
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Split divider handle */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-lg cursor-ew-resize"
                    style={{ left: `${beforeAfterSlider}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
                      ↔
                    </div>
                  </div>

                  {/* Range input for slider */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={beforeAfterSlider}
                    onChange={(e) => setBeforeAfterSlider(parseInt(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-10"
                  />

                  {/* Labels */}
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 px-2 py-1 rounded text-[10px] font-bold text-slate-300">
                    AVANT
                  </div>
                  <div className="absolute bottom-3 right-3 bg-amber-500/90 px-2 py-1 rounded text-[10px] font-bold text-slate-950">
                    APRÈS
                  </div>
                </div>
              ) : (
                <img
                  src={activeModalItem.image}
                  alt={activeModalItem.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            {/* Modal Body Info */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[50vh] overflow-y-auto">
              
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
                <span>{activeModalItem.categoryLabel}</span>
                <span>•</span>
                <span className="text-slate-400">Projet client : {activeModalItem.client}</span>
              </div>

              <h3 className="text-2xl font-black font-['Outfit'] text-white">
                {activeModalItem.title}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                {activeModalItem.description}
              </p>

              {/* Deliverables */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Livrables & Fichiers remis</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeModalItem.deliverables.map((deliv, i) => (
                    <div key={i} className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact / Result */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span>{activeModalItem.highlight}</span>
              </div>

            </div>

            {/* Modal Footer CTAs */}
            <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Vous avez un projet similaire ? Commandez dès maintenant.
              </span>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <a
                  href={`https://wa.me/2250501088608?text=${encodeURIComponent(`Bonjour Okbw ! J'ai vu votre réalisation "${activeModalItem.title}" et j'aimerais commander un projet similaire.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Discuter sur WhatsApp</span>
                </a>

                <button
                  onClick={() => handleOrderSimilar(activeModalItem)}
                  className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-colors"
                >
                  <span>Commander ce type de prestation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
