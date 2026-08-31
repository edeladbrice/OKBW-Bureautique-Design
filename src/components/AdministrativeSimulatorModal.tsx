import React, { useState } from 'react';
import { 
  X, 
  Scale, 
  CheckSquare, 
  Square, 
  Clock, 
  AlertCircle, 
  FileCheck2, 
  Download, 
  MessageSquare, 
  Sparkles,
  Info
} from 'lucide-react';
import { formatFCFA, PRIMARY_WHATSAPP_NUMBER, getWavePaymentUrl, buildWhatsAppFormattedMessage } from '../utils/pricing';

interface ProcedureDef {
  id: string;
  name: string;
  category: 'concours' | 'judiciaire' | 'officiel';
  officialCost: number;
  courtFeeDescription: string;
  legalTurnaround: string;
  requiredDocuments: Array<{
    name: string;
    description: string;
    mandatory: boolean;
  }>;
  tips: string[];
}

const PROCEDURES_DATA: ProcedureDef[] = [
  {
    id: 'casier-judiciaire',
    name: 'Casier Judiciaire (Extrait du Bulletin N°3)',
    category: 'judiciaire',
    officialCost: 3500,
    courtFeeDescription: 'Timbres fiscaux officiels, greffe du tribunal et expédition certifiée inclus',
    legalTurnaround: '72 heures ouvrées (3 jours)',
    requiredDocuments: [
      { name: 'Copie lisible de la CNI ou du Passeport', description: 'Scan ou photo nette recto/verso', mandatory: true },
      { name: 'Copie de l\'Extrait d\'Acte de Naissance', description: 'Moins d\'un an ou extrait officiel', mandatory: true },
      { name: 'Précision du Tribunal de Première Instance', description: 'Tribunal de votre lieu de naissance (ex: Abidjan-Plateau, Yopougon, Bouaké, etc.)', mandatory: true }
    ],
    tips: [
      'Indispensable pour tout dossier de candidature ou concours de la Fonction Publique.',
      'Reçu officiel de dépôt transmis immédiatement dès confirmation du règlement.',
      'Retrait physique du document original ou expédition sécurisée.'
    ]
  },
  {
    id: 'certificat-nationalite',
    name: 'Certificat de Nationalité Ivoirienne',
    category: 'judiciaire',
    officialCost: 3500,
    courtFeeDescription: 'Frais de greffe, timbres fiscaux d\'État et enregistrement au Parquet',
    legalTurnaround: '72 heures ouvrées (3 jours)',
    requiredDocuments: [
      { name: 'Extrait d\'Acte de Naissance du demandeur', description: 'Original ou copie certifiée conforme', mandatory: true },
      { name: 'Copie CNI ou Certificat de Nationalité du père ou de la mère', description: 'Preuve de la filiation ivoirienne', mandatory: true },
      { name: 'Certificat de Résidence', description: 'Délivré par le commissariat ou la mairie', mandatory: false }
    ],
    tips: [
      'Document d\'État authentique signé par le juge du tribunal de votre lieu de naissance.',
      'Paiement sécurisé Wave Business à l\'enregistrement du dossier.'
    ]
  },
  {
    id: 'pack-duo-legal',
    name: 'Pack Duo Officiel : Nationalité + Casier Judiciaire',
    category: 'judiciaire',
    officialCost: 6500,
    courtFeeDescription: 'Pack complet combiné pour concours ou emploi (Économie de 500 F)',
    legalTurnaround: '72 heures ouvrées (3 jours)',
    requiredDocuments: [
      { name: 'Extrait d\'Acte de Naissance', description: 'Copie ou scan propre', mandatory: true },
      { name: 'CNI du demandeur', description: 'Recto-verso lisible', mandatory: true },
      { name: 'CNI d\'un des parents', description: 'Pour l\'établissement de la nationalité', mandatory: true }
    ],
    tips: [
      'Formule la plus demandée par les candidats aux concours ENA, CAFOP, Police et INFAS.'
    ]
  },
  {
    id: 'concours-fonction-publique',
    name: 'Dossier Concours Fonction Publique & ENA',
    category: 'concours',
    officialCost: 8500,
    courtFeeDescription: 'Pack complet : CV format État, lettre de motivation sur mesure, conversion des scans aux normes du portail',
    legalTurnaround: '24h à 48h (Délai d\'urgence disponible)',
    requiredDocuments: [
      { name: 'Scans des diplômes & attestations', description: 'Format PDF léger (< 500 Ko pour le portail)', mandatory: true },
      { name: 'Photo d\'identité sur fond blanc', description: 'Recadrée aux normes officielles', mandatory: true },
      { name: 'Certificat de visite médicale / Quittance', description: 'Scan du reçu d\'inscription en ligne', mandatory: true },
      { name: 'Casier judiciaire & Nationalité', description: 'Documents à jour de moins de 3 mois', mandatory: true }
    ],
    tips: [
      'OKBW optimise et compresse vos scans pour qu\'ils soient acceptés à 100% sur la plateforme officielle.',
      'Mise en page de votre CV selon le canevas ministériel en vigueur.'
    ]
  }
];

interface AdministrativeSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWaveQr?: (amount: number, title: string) => void;
}

export const AdministrativeSimulatorModal: React.FC<AdministrativeSimulatorModalProps> = ({
  isOpen,
  onClose,
  onOpenWaveQr
}) => {
  const [selectedId, setSelectedId] = useState<string>('casier-judiciaire');
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');

  if (!isOpen) return null;

  const currentProc = PROCEDURES_DATA.find((p) => p.id === selectedId) || PROCEDURES_DATA[0];

  const toggleDoc = (docName: string) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [docName]: !prev[docName]
    }));
  };

  const mandatoryCount = currentProc.requiredDocuments.filter((d) => d.mandatory).length;
  const checkedMandatoryCount = currentProc.requiredDocuments.filter(
    (d) => d.mandatory && checkedDocs[d.name]
  ).length;

  const isReady = checkedMandatoryCount === mandatoryCount;

  const handleWhatsAppOrder = () => {
    const missingDocs = currentProc.requiredDocuments
      .filter((d) => !checkedDocs[d.name])
      .map((d) => d.name);

    let customDetails = `Délai légal : ${currentProc.legalTurnaround}`;
    if (missingDocs.length > 0) {
      customDetails += ` | Pièces à compléter : ${missingDocs.join(', ')}`;
    } else {
      customDetails += ` | Toutes les pièces justificatives sont prêtes !`;
    }

    const whatsappUrl = `https://wa.me/${PRIMARY_WHATSAPP_NUMBER}?text=${encodeURIComponent(
      buildWhatsAppFormattedMessage({
        serviceName: currentProc.name,
        quantityText: '1 Dossier complet',
        customerName: clientName,
        customerPhone: clientPhone,
        instructions: customDetails,
        totalAmount: currentProc.officialCost,
        isAdministrative: true
      })
    )}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-600 via-orange-600 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider">Simulateur Officiel CI</span>
                <span className="text-xs text-amber-100">• Timbres & Greffe</span>
              </div>
              <h3 className="text-xl font-black text-white font-['Outfit']">
                Simulateur de Démarches & Concours
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Procedure Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PROCEDURES_DATA.map((proc) => {
              const active = proc.id === selectedId;
              return (
                <button
                  key={proc.id}
                  onClick={() => {
                    setSelectedId(proc.id);
                    setCheckedDocs({});
                  }}
                  className={`p-3 rounded-2xl text-left transition-all border ${
                    active
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-950 dark:text-amber-200 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs font-bold truncate">{proc.name}</div>
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 font-black mt-1">
                    {formatFCFA(proc.officialCost)}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Procedure Overview Box */}
          <div className="p-5 bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border border-amber-200/80 dark:border-amber-800/50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 dark:border-amber-800/40 pb-3">
              <div>
                <h4 className="text-lg font-black text-amber-950 dark:text-amber-100 font-['Outfit']">
                  {currentProc.name}
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                  {currentProc.courtFeeDescription}
                </p>
              </div>

              <div className="sm:text-right">
                <span className="text-[11px] text-amber-800 dark:text-amber-400 font-semibold block">Montant Forfaitaire</span>
                <span className="text-2xl font-black text-amber-900 dark:text-amber-200 font-['Outfit']">
                  {formatFCFA(currentProc.officialCost)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-bold text-amber-900 dark:text-amber-200">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Délai Légal d'Obtention : {currentProc.legalTurnaround}</span>
            </div>
          </div>

          {/* Checklist of Required Documents */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Pièces à fournir (Cochez pour préparer votre dossier) :
              </span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                {checkedMandatoryCount}/{mandatoryCount} pièces prêtes
              </span>
            </div>

            <div className="space-y-2">
              {currentProc.requiredDocuments.map((doc, idx) => {
                const checked = !!checkedDocs[doc.name];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleDoc(doc.name)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                      checked
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5">
                      {checked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex items-center space-x-2">
                        <strong className="text-slate-900 dark:text-white font-bold">{doc.name}</strong>
                        {doc.mandatory && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-bold">
                            Obligatoire
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {doc.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tips list */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Info className="w-4 h-4 text-blue-500" />
              <span>Conseils de l'équipe OKBW :</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pl-5 list-disc">
              {currentProc.tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>

          {/* Client Input Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Nom complet du demandeur :
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: KOUASSI Jean-Yves"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Numéro WhatsApp pour le suivi :
              </label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="Ex: +225 07 00 00 00 00"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              id="btn-admin-order-whatsapp"
              onClick={handleWhatsAppOrder}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Transmettre ce dossier sur WhatsApp (+225 01 41 75 24 03)</span>
            </button>

            {onOpenWaveQr && (
              <button
                onClick={() => onOpenWaveQr(currentProc.officialCost, currentProc.name)}
                className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-4 h-4 text-sky-200" />
                <span>Payer directement les frais greffe via Wave ({formatFCFA(currentProc.officialCost)})</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
