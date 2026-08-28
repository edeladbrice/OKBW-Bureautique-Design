import React from 'react';
import { Clock, Zap, Rocket, Calendar, CheckSquare, Square, Check, ShieldCheck, Lock, FileCheck2, AlertCircle } from 'lucide-react';
import { TurnaroundOption } from '../types';
import { TURNAROUND_OPTIONS, ADMINISTRATIVE_LOCKED_TURNAROUND } from '../utils/pricing';

interface TurnaroundSelectorProps {
  selectedId: string;
  onSelect: (option: TurnaroundOption) => void;
  title?: string;
  subtitle?: string;
  isAdministrativeLocked?: boolean;
}

export const TurnaroundSelector: React.FC<TurnaroundSelectorProps> = ({
  selectedId,
  onSelect,
  title = "Délai de réalisation souhaité (Cases à cocher)",
  subtitle = "Sélectionnez le créneau horaire correspondant à votre degré d'urgence :",
  isAdministrativeLocked = false
}) => {
  if (isAdministrativeLocked) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5 text-[#FF5E14]" />
            <span>Délai Légal Réglementaire (Verrouillé 72h / 3 Jours)</span>
          </label>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/80 text-[#FF5E14] border border-orange-300 dark:border-orange-800">
            ⚖️ Procédure Tribunal
          </span>
        </div>

        {/* Dedicated Locked 72h Judicial Card */}
        <div className="p-4 rounded-2xl border-2 border-[#FF5E14] bg-orange-50/90 dark:bg-orange-950/40 shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start space-x-2.5">
              <div className="w-5 h-5 rounded-md bg-[#FF5E14] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                  72h Strictes (3 Jours Ouvrés) — Retrait Greffe & Tribunal
                </h4>
                <span className="text-[11px] font-bold text-[#FF5E14] dark:text-orange-400 flex items-center space-x-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  <span>Délai légal de délivrance du document physique : 3 jours après la demande</span>
                </span>
              </div>
            </div>

            <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-[#FF5E14] text-white whitespace-nowrap shadow-xs">
              72h Bloquées
            </span>
          </div>

          {/* Key Judicial Process Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-900/60 text-xs text-slate-800 dark:text-slate-200 flex items-start space-x-2">
              <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-emerald-700 dark:text-emerald-400">Reçu officiel IMMÉDIAT :</strong>
                <span className="text-[11px] text-slate-600 dark:text-slate-400">
                  Dès paiement, vous recevez votre reçu officiel de demande & de transaction.
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-900/60 text-xs text-slate-800 dark:text-slate-200 flex items-start space-x-2">
              <Clock className="w-4 h-4 text-[#FF5E14] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-orange-900 dark:text-orange-300">Document physique sous 3 jours :</strong>
                <span className="text-[11px] text-slate-600 dark:text-slate-400">
                  Le retrait officiel au tribunal s'effectue exactement 3 jours après la demande.
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-orange-800 dark:text-orange-300 bg-orange-100/70 dark:bg-orange-900/40 p-2 rounded-xl">
            <AlertCircle className="w-4 h-4 text-[#FF5E14] flex-shrink-0" />
            <span>
              <strong>Note de greffe :</strong> Les options express (2h à 24h) sont inapplicables aux actes judiciaires en raison du protocole légal de signature des magistrats.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{title}</span>
          </label>
        </div>
        {subtitle && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {/* Checkbox-style options grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {TURNAROUND_OPTIONS.map((option) => {
          const isSelected = selectedId === option.id;

          return (
            <div
              key={option.id}
              onClick={() => onSelect(option)}
              className={`relative p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-2 select-none ${
                isSelected
                  ? 'border-blue-600 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/20 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {/* Header with Checkbox & Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start space-x-2.5">
                  {/* Custom Checkbox visual */}
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-transparent'
                  }`}>
                    <Check className={`w-3.5 h-3.5 stroke-[3] ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {option.label}
                    </h4>
                    <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 flex items-center space-x-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{option.hoursDetail}</span>
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap ${
                  option.id === 'ultra-express'
                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                    : option.id === 'express-same-day'
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {option.badge}
                </span>
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-600 dark:text-slate-300 pl-7 leading-relaxed">
                {option.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

