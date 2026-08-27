import React from 'react';
import { 
  Star, 
  Quote, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  Users, 
  Clock, 
  HeartHandshake 
} from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/testimonialsData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="avis" className="py-20 bg-[#F4F7F9] border-b border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-50 text-[#FF8800] border border-orange-200 text-xs font-bold uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-[#FF8800] text-[#FF8800]" />
            <span>Témoignages & Retours d'Expérience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-['Outfit'] tracking-tight text-slate-900">
            Ils nous font Confiance pour leurs Documents & Visuels
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Étudiants, cadres dirigeants, commerçants et chefs d'entreprises témoignent de la rapidité et de l'excellence de nos prestations.
          </p>
        </div>

        {/* Stats Counter Bar Bento style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div className="text-3xl sm:text-4xl font-black text-[#0F52BA] font-['Outfit']">+850</div>
            <div className="text-xs sm:text-sm font-bold text-slate-700 mt-1">Documents Traités</div>
            <div className="text-[11px] text-slate-500 mt-0.5">CV, thèses, affiches & logos</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div className="text-3xl sm:text-4xl font-black text-[#FF8800] font-['Outfit']">99.8%</div>
            <div className="text-xs sm:text-sm font-bold text-slate-700 mt-1">Satisfaction Client</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Avis vérifiés 5 étoiles</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 font-['Outfit']">2h à 24h</div>
            <div className="text-xs sm:text-sm font-bold text-slate-700 mt-1">Délai Moyen Express</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Engagement respect des délais</div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div className="text-3xl sm:text-4xl font-black text-[#0F52BA] font-['Outfit']">100%</div>
            <div className="text-xs sm:text-sm font-bold text-slate-700 mt-1">Paiements Sécurisés</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Via Wave Business officiel</div>
          </div>
        </div>

        {/* Testimonials Bento Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS_DATA.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 relative"
            >
              <Quote className="w-10 h-10 text-slate-200 absolute top-6 right-6 pointer-events-none" />

              <div className="space-y-3">
                {/* Rating stars & verified badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Commande Vérifiée</span>
                  </span>
                </div>

                {/* Comment */}
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "{item.comment}"
                </p>

                {/* Service Tag */}
                <div className="inline-block px-3 py-1 rounded-xl bg-blue-50 text-[#0F52BA] text-xs font-bold border border-blue-100">
                  Prestation : {item.service}
                </div>
              </div>

              {/* Author info */}
              <div className="pt-4 border-t border-slate-100 flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${item.avatarColor} text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                  <p className="text-xs text-slate-500">{item.role} • {item.location}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
