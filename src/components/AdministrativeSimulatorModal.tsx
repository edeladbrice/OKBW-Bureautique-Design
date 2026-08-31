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
import { 
  formatFCFA, 
  PRIMARY_WHATSAPP_NUMBER, 
  getWavePaymentUrl, 
  buildWhatsAppFormattedMessage,
  generateOrderReference,
  saveOrderToHistory,
  StoredOrderRecord
} from '../utils/pricing';
import { SmartStepWalkthrough } from './SmartSiteGuidance';

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
    id: 'certificat-nationalite',
    name: 'Certificat de Nationalité Ivoirienne',
    category: 'judiciaire',
    officialCost: 3500,
    courtFeeDescription: 'Frais de greffe, timbres fiscaux d\'État et enregistrement au Parquet',
    legalTurnaround: '72 heures ouvrées (3 jours)',
    requiredDocuments: [
      { 
        name: '1. Extrait d\'acte de naissance ou copie intégrale du demandeur', 
        description: 'De préférence récent (moins d\'un an ou extrait officiel conforme avec mention lisible).', 
        mandatory: true 
      },
      { 
        name: '2. Photocopie de la CNI / Passeport / Attestation d\'identité', 
        description: 'Document officiel du demandeur (si majeur) en cours de validité (recto-verso bien net).', 
        mandatory: true 
      },
      { 
        name: '3. Certificat de nationalité ivoirienne du père OU de la mère', 
        description: 'Ou copie CNI / acte de naissance du parent ivoirien attestant de la filiation ivoirienne.', 
        mandatory: true 
      },
      { 
        name: '4. Une (1) photo d\'identité couleur récente', 
        description: 'Photo nette sur fond blanc sans reflet ni accessoire couvrant le visage.', 
        mandatory: true 
      },
      { 
        name: '5. Justificatif de résidence / domicile actuel', 
        description: 'Certificat de résidence délivré par le commissariat/mairie ou facture CIE/SODECI.', 
        mandatory: true 
      }
    ],
    tips: [
      'Document d\'État authentique signé par le magistrat du tribunal territorialement compétent.',
      'Reçu officiel de demande & de transaction émis immédiatement dès confirmation du paiement.',
      'Retrait physique du document authentifié 3 jours (72h ouvrées) après la demande.'
    ]
  },
  {
    id: 'casier-judiciaire',
    name: 'Casier Judiciaire (Extrait du Bulletin N°3)',
    category: 'judiciaire',
    officialCost: 3500,
    courtFeeDescription: 'Timbres fiscaux officiels, greffe du tribunal et expédition certifiée inclus',
    legalTurnaround: '72 heures ouvrées (3 jours)',
    requiredDocuments: [
      { 
        name: '1. Extrait d\'acte de naissance ou copie intégrale du demandeur', 
        description: 'Moins d\'un an ou extrait officiel conforme de votre lieu de naissance.', 
        mandatory: true 
      },
      { 
        name: '2. Photocopie de la CNI / Passeport / Attestation d\'identité', 
        description: 'Scan ou photo nette recto/verso en cours de validité du demandeur.', 
        mandatory: true 
      },
      { 
        name: '3. Certificat de nationalité ivoirienne du demandeur ou parent', 
        description: 'Preuve de la nationalité ivoirienne pour l\'enregistrement au casier central.', 
        mandatory: true 
      },
      { 
        name: '4. Une (1) photo d\'identité couleur récente', 
        description: 'Format officiel sur fond blanc net pour la fiche de renseignement.', 
        mandatory: true 
      },
      { 
        name: '5. Justificatif de résidence & Précision du Tribunal', 
        description: 'Lieu de résidence actuel et Tribunal de Première Instance de votre lieu de naissance.', 
        mandatory: true 
      }
    ],
    tips: [
      'Indispensable pour tout dossier de candidature ou concours de la Fonction Publique.',
      'Reçu officiel de dépôt transmis immédiatement dès confirmation du règlement.',
      'Retrait physique du document original sous 72h ouvrées au greffe.'
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
      { 
        name: '1. Extrait d\'acte de naissance ou copie intégrale du demandeur', 
        description: 'Document original ou copie certifiée conforme (de préférence récent).', 
        mandatory: true 
      },
      { 
        name: '2. Photocopie de la CNI / Passeport / Attestation d\'identité', 
        description: 'Pièce d\'identité officielle du demandeur recto-verso.', 
        mandatory: true 
      },
      { 
        name: '3. Certificat de nationalité du père OU de la mère', 
        description: 'Ou CNI / acte de naissance du parent ivoirien.', 
        mandatory: true 
      },
      { 
        name: '4. Deux (2) photos d\'identité couleur récentes', 
        description: 'Sur fond blanc net pour les 2 dossiers judiciaires.', 
        mandatory: true 
      },
      { 
        name: '5. Justificatif de résidence / domicile actuel', 
        description: 'Attestation de domicile ou certificat de résidence dans votre commune.', 
        mandatory: true 
      }
    ],
    tips: [
      'Formule la plus demandée par les candidats aux concours ENA, CAFOP, Police et INFAS.',
      'Économisez 500 F sur le traitement conjoint des 2 actes judiciaires.'
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
      { name: '1. Extrait d\'acte de naissance + CNI du candidat', description: 'Scans HD conformes aux critères de la plateforme', mandatory: true },
      { name: '2. Casier judiciaire & Certificat de nationalité', description: 'Moins de 3 mois pour le dépôt officiel', mandatory: true },
      { name: '3. Diplômes & attestations de réussite', description: 'Format PDF léger compressé (< 500 Ko pour le portail)', mandatory: true },
      { name: '4. Photo d\'identité sur fond blanc net', description: 'Recadrée aux dimensions et ratio officiels', mandatory: true },
      { name: '5. Quittance / Fiche d\'inscription au concours', description: 'Scan du reçu de paiement des droits d\'inscription', mandatory: true }
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
  onSelectService?: (service: any) => void;
  onOpenWaveQr?: (amount: number, title: string) => void;
  onOrderSuccess?: (order: StoredOrderRecord) => void;
}

export const AdministrativeSimulatorModal: React.FC<AdministrativeSimulatorModalProps> = ({
  isOpen,
  onClose,
  onOpenWaveQr,
  onOrderSuccess
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

  const handleInstantSubmit = () => {
    const missingDocs = currentProc.requiredDocuments
      .filter((d) => !checkedDocs[d.name])
      .map((d) => d.name);

    let customDetails = `Délai légal : ${currentProc.legalTurnaround}`;
    if (missingDocs.length > 0) {
      customDetails += ` | Pièces à compléter : ${missingDocs.join(', ')}`;
    } else {
      customDetails += ` | Toutes les pièces justificatives sont prêtes !`;
    }

    const ref = generateOrderReference();
    const now = new Date();
    const formattedDate = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' à ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const record = saveOrderToHistory({
      orderReference: ref,
      date: formattedDate,
      customerName: clientName.trim() || 'Demandeur Officiel',
      customerPhone: clientPhone.trim() || '',
      serviceName: currentProc.name,
      quantityText: '1 Dossier complet (Tribunal)',
      totalAmount: currentProc.officialCost,
      instructions: customDetails,
      status: 'recu',
      wavePaymentUrl: getWavePaymentUrl(currentProc.officialCost),
      isAdministrative: true
    });

    onClose();

    if (onOrderSuccess) {
      onOrderSuccess(record);
    }
  };

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

          {/* Smart Interactive Step Guide */}
          <SmartStepWalkthrough
            currentStep={clientName.trim() ? 2 : 1}
            isAdministrative={true}
            serviceTitle={currentProc.name}
            amount={currentProc.officialCost}
          />

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
          <div className="p-5 rounded-2xl bg-orange-50/80 dark:bg-slate-800/90 border-2 border-orange-400 dark:border-orange-500/60 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-orange-200 dark:border-slate-700 pb-3">
              <div className="flex items-center space-x-2">
                <FileCheck2 className="w-5 h-5 text-[#FF5E14]" />
                <h5 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide font-['Outfit']">
                  📋 5 Pièces à Fournir pour votre dossier :
                </h5>
              </div>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-[#FF5E14] text-white shadow-xs self-start sm:self-auto">
                {checkedMandatoryCount}/{mandatoryCount} pièces prêtes
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-200 font-medium">
              Cochez les pièces prêtes ou transmettez-les directement par WhatsApp / Messagerie instantanée :
            </p>

            <div className="space-y-2.5">
              {currentProc.requiredDocuments.map((doc, idx) => {
                const checked = !!checkedDocs[doc.name];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleDoc(doc.name)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start space-x-3.5 ${
                      checked
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-500 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500/50 shadow-xs'
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {checked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="text-slate-950 dark:text-white font-black text-xs sm:text-sm">
                          {doc.name}
                        </strong>
                        {doc.mandatory && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 font-extrabold border border-orange-300 dark:border-orange-800">
                            Requis
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed text-xs">
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
            {/* Primary Instant Submission */}
            <button
              id="btn-admin-order-instant"
              onClick={handleInstantSubmit}
              className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-950/25 transition-all flex items-center justify-center space-x-2 animate-pulse"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>⚡ Transmettre ce dossier instantanément (Sans redirection)</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-admin-order-whatsapp"
                onClick={handleWhatsAppOrder}
                className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                title="Ouvrir également sur WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ouvrir sur WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenWaveQr) {
                    onOpenWaveQr(currentProc.officialCost, currentProc.name);
                  } else {
                    window.open(getWavePaymentUrl(currentProc.officialCost), '_blank');
                  }
                }}
                className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                <span>Payer Wave ({formatFCFA(currentProc.officialCost)})</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
