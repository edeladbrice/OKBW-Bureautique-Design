import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Palette, 
  FileCheck2, 
  Sparkles, 
  Globe, 
  Search, 
  ShoppingBag, 
  Check, 
  Info, 
  Zap, 
  MessageSquare,
  Clock,
  Layers,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { ServiceItem, ServiceCategory } from '../types';
import { SERVICES_DATA } from '../data/servicesData';
import { generateQuickServiceWhatsAppLink } from '../utils/pricing';

interface ServicesCatalogProps {
  onAddToCart: (service: ServiceItem, quantity?: number) => void;
  onSelectService: (service: ServiceItem) => void;
  onOpenCalculator: () => void;
}

export const ServicesCatalog: React.FC<ServicesCatalogProps> = ({
  onAddToCart,
  onSelectService,
  onOpenCalculator
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  const categories: { id: ServiceCategory; label: string; count: number; icon: React.ReactNode }[] = [
    { 
      id: 'all', 
      label: 'Toutes les Prestations', 
      count: SERVICES_DATA.length,
      icon: <Layers className="w-4 h-4" /> 
    },
    { 
      id: 'administratif', 
      label: '🏛️ E-Justice & Actes 🇨🇮', 
      count: SERVICES_DATA.filter(s => s.category === 'administratif').length,
      icon: <ShieldCheck className="w-4 h-4 text-[#FF5E14]" /> 
    },
    { 
      id: 'scolaire', 
      label: '🎓 Inscription en Ligne & Scolaire', 
      count: SERVICES_DATA.filter(s => s.category === 'scolaire').length,
      icon: <FileCheck className="w-4 h-4 text-blue-500" /> 
    },
    { 
      id: 'bureautique', 
      label: 'Bureautique & Documents', 
      count: SERVICES_DATA.filter(s => s.category === 'bureautique').length,
      icon: <FileText className="w-4 h-4" /> 
    },
    { 
      id: 'design', 
      label: 'Design Graphique & Image', 
      count: SERVICES_DATA.filter(s => s.category === 'design').length,
      icon: <Palette className="w-4 h-4" /> 
    },
    { 
      id: 'pdf', 
      label: 'Solutions PDF & Conversion', 
      count: SERVICES_DATA.filter(s => s.category === 'pdf').length,
      icon: <FileCheck2 className="w-4 h-4" /> 
    },
    { 
      id: 'optimisation', 
      label: 'Scan & Optimisation', 
      count: SERVICES_DATA.filter(s => s.category === 'optimisation').length,
      icon: <Sparkles className="w-4 h-4" /> 
    },
    { 
      id: 'web', 
      label: 'Création Web & Informatique', 
      count: SERVICES_DATA.filter(s => s.category === 'web').length,
      icon: <Globe className="w-4 h-4" /> 
    },
  ];

  const filteredServices = useMemo(() => {
    return SERVICES_DATA.filter((service) => {
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const matchesQuery = 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.targetAudience && service.targetAudience.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (service.promoNote && service.promoNote.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (service.requiredDocuments && service.requiredDocuments.some(d => d.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleQuickAdd = (service: ServiceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(service, 1);
    setAddedAnimationId(service.id);
    setTimeout(() => setAddedAnimationId(null), 1200);
  };

  return (
    <section id="catalogue" className="py-20 bg-[#F4F7F9] dark:bg-[#0B1320] border-t border-slate-200 dark:border-slate-800 scroll-mt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0F52BA] dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 text-xs font-bold uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5 text-[#FF5E14]" />
            <span>Boutique & Prestations en Ligne</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-['Outfit'] tracking-tight">
            Catalogue des Services & Commandes Directes
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Commandez vos démarches administratives officielles, documents bureautiques, designs et solutions PDF en 1 clic. Règlement sécurisé via Wave Business et confirmation directe sur WhatsApp.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="space-y-4 mb-10">
          
          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-btn-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 border ${
                    active
                      ? 'bg-[#0F52BA] text-white border-[#0F52BA] shadow-md shadow-blue-900/20'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className={active ? 'text-[#FF5E14]' : 'text-slate-500 dark:text-slate-400'}>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    active ? 'bg-[#FF5E14] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search bar & Quick Calculator Trigger */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-services-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un service (ex: Nationalité, Casier, CV, Affiche, Logo, Saisie, PDF...)"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0F52BA] focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Effacer
                </button>
              )}
            </div>

            <button
              id="catalog-calc-banner-btn"
              onClick={onOpenCalculator}
              className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#FF5E14] hover:brightness-110 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-all whitespace-nowrap"
            >
              <Zap className="w-4 h-4 text-white" />
              <span>Simulateur de Devis Express</span>
            </button>
          </div>

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mb-6 px-1">
          <span>{filteredServices.length} prestation(s) trouvée(s)</span>
          <span className="hidden sm:inline">Tarifs indiqués en Francs CFA (FCFA) - Net de taxe</span>
        </div>

        {/* Bento Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const isAdded = addedAnimationId === service.id;
            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                onClick={() => onSelectService(service)}
                className={`group bg-white dark:bg-slate-900 rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 ${
                  service.category === 'administratif'
                    ? 'border-[#FF5E14]/40 dark:border-orange-500/40 shadow-sm ring-1 ring-[#FF5E14]/20'
                    : service.recommended 
                      ? 'border-[#0F52BA]/50 dark:border-blue-500/50 shadow-md ring-1 ring-[#0F52BA]/20 dark:ring-blue-500/20' 
                      : 'border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-[#0F52BA]/40 dark:hover:border-blue-500/40'
                }`}
              >
                {/* Top Card Body */}
                <div className="p-6 space-y-4">
                  
                  {/* Badge & Delivery */}
                  <div className="flex items-center justify-between gap-2">
                    {service.badge ? (
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide ${
                        service.category === 'administratif'
                          ? 'bg-[#FF5E14] text-white'
                          : service.recommended 
                            ? 'bg-[#0F52BA] text-white' 
                            : 'bg-orange-50 dark:bg-orange-950/60 text-[#FF5E14] border border-orange-200 dark:border-orange-900/60'
                      }`}>
                        {service.badge}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                        {service.category}
                      </span>
                    )}

                    <div className="flex items-center space-x-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-[#0F52BA] dark:text-blue-400" />
                      <span>{service.deliveryTime}</span>
                    </div>
                  </div>

                  {/* Title & Price */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit'] group-hover:text-[#0F52BA] dark:group-hover:text-blue-400 transition-colors leading-snug">
                      {service.name}
                    </h3>
                    <div className="mt-2 flex items-baseline space-x-2">
                      <span className="text-2xl font-black text-[#0F52BA] dark:text-blue-400 font-['Outfit']">
                        {service.priceDisplay}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        / {service.unitLabel}
                      </span>
                    </div>
                  </div>

                  {/* Target audience banner if any */}
                  {service.targetAudience && (
                    <div className="px-2.5 py-1 rounded-xl bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-900/50 text-[11px] text-[#FF5E14] dark:text-orange-300 font-semibold flex items-center space-x-1.5">
                      <span>🇨🇮</span>
                      <span className="truncate">{service.targetAudience}</span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>

                  {/* Required Documents Highlight Chip */}
                  {service.requiredDocuments && service.requiredDocuments.length > 0 && (
                    <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-1">
                      <div className="flex items-center space-x-1.5 text-[11px] font-bold text-[#FF5E14] dark:text-orange-400">
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>{service.requiredDocuments.length} pièces justificatives à fournir :</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                        {service.requiredDocuments.join(', ')}
                      </p>
                    </div>
                  )}

                  {/* Promo & Volume Badge */}
                  {service.promoNote && (
                    <div className="p-3 rounded-2xl bg-orange-50/80 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 text-orange-950 dark:text-orange-200 text-xs font-semibold flex items-start space-x-2">
                      <Zap className="w-4 h-4 text-[#FF5E14] flex-shrink-0 mt-0.5" />
                      <span>{service.promoNote}</span>
                    </div>
                  )}

                  {/* Inclusions list preview */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Inclus :</span>
                    {service.inclusions.slice(0, 3).map((inc, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-slate-600 dark:text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{inc}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Bottom Actions Bar */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  
                  {/* View Details button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectService(service);
                    }}
                    className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#0F52BA] dark:hover:text-blue-400 flex items-center space-x-1 px-2.5 py-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Détails & Pièces</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    {/* Direct WhatsApp fast order */}
                    <a
                      href={generateQuickServiceWhatsAppLink(service, 1)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
                      title="Commander directement via WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>

                    {/* Add to Cart button */}
                    <button
                      type="button"
                      id={`add-to-cart-btn-${service.id}`}
                      onClick={(e) => handleQuickAdd(service, e)}
                      className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        isAdded
                          ? 'bg-emerald-600 text-white scale-105'
                          : service.category === 'administratif'
                            ? 'bg-[#FF5E14] hover:bg-[#e04f0f] text-white shadow-md shadow-orange-900/15'
                            : 'bg-[#0F52BA] hover:brightness-110 text-white shadow-md shadow-blue-900/15'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Ajouté !</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 text-white" />
                          <span>Commander</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Aucune prestation ne correspond à votre recherche</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Essayez un autre mot clé ou réinitialisez les filtres.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2.5 rounded-2xl bg-[#0F52BA] text-white text-xs font-bold shadow-md"
            >
              Afficher tout le catalogue
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
