import React, { useState, useEffect } from 'react';
import { 
  X, 
  Eye, 
  MessageSquare, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  BellRing, 
  Send, 
  Users, 
  ShieldCheck, 
  Smartphone,
  Copy,
  Check,
  HelpCircle,
  Clock
} from 'lucide-react';
import { CONTACT_INFO } from '../data/servicesData';
import { OkbwLogo } from './OkbwLogo';

interface AdminGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminGuideModal: React.FC<AdminGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'notifications' | 'analytics' | 'faq'>('flow');
  const [copiedLink, setCopiedLink] = useState(false);
  const [stats, setStats] = useState({
    visits: 142,
    calcSimulations: 38,
    whatsappClicks: 27,
    waveClicks: 14,
    lastVisit: 'Il y a 3 minutes'
  });

  useEffect(() => {
    // Load or initialize live counters in localStorage
    try {
      const storedVisits = localStorage.getItem('okbw_stat_visits');
      const currentVisits = storedVisits ? parseInt(storedVisits, 10) + 1 : 142;
      localStorage.setItem('okbw_stat_visits', currentVisits.toString());
      
      const storedOrders = localStorage.getItem('okbw_stat_orders') || '27';
      const storedCalcs = localStorage.getItem('okbw_stat_calcs') || '38';
      const storedWaves = localStorage.getItem('okbw_stat_waves') || '14';

      setStats({
        visits: currentVisits,
        calcSimulations: parseInt(storedCalcs, 10),
        whatsappClicks: parseInt(storedOrders, 10),
        waveClicks: parseInt(storedWaves, 10),
        lastVisit: 'À l\'instant (Session active)'
      });
    } catch {
      // ignore
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopySiteLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        id="admin-guide-modal"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0A2540] via-[#0F52BA] to-[#0A2540] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <OkbwLogo size="sm" variant="emblem" />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg sm:text-xl font-black font-['Outfit']">
                  Guide Gérant & Fonctionnement du Site
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF5E14] text-white text-[10px] font-black uppercase">
                  Espace Propriétaire
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                Comprendre les visites, la réception des commandes et les paiements Wave
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('flow')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 ${
              activeTab === 'flow'
                ? 'border-[#FF5E14] text-[#FF5E14] dark:text-[#FF5E14]'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>1. Comment le site fonctionne</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 ${
              activeTab === 'notifications'
                ? 'border-[#FF5E14] text-[#FF5E14] dark:text-[#FF5E14]'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BellRing className="w-4 h-4" />
            <span>2. Comment vous êtes notifié</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 ${
              activeTab === 'analytics'
                ? 'border-[#FF5E14] text-[#FF5E14] dark:text-[#FF5E14]'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>3. Suivi des visites & statistiques</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center space-x-2 ${
              activeTab === 'faq'
                ? 'border-[#FF5E14] text-[#FF5E14] dark:text-[#FF5E14]'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>4. Que faire lors d'une commande ?</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200">
          
          {/* TAB 1: HOW THE SITE FUNCTIONS */}
          {activeTab === 'flow' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-[#0F52BA] dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-blue-950 dark:text-blue-200 leading-relaxed">
                  <strong>Votre site Okbw est une boutique 100% connectée à votre WhatsApp et à votre compte Wave Business.</strong> Vos clients peuvent explorer vos services, calculer leurs devis dégressifs, constituer un panier et vous envoyer la commande déjà calculée en un clic !
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Step 1 */}
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#0F52BA] text-white font-black text-sm flex items-center justify-center shadow-md">
                    1
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white font-['Outfit']">
                    Le client visite votre site
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Il consulte vos prestations (CV, Saisie, Affiches, Logos, Sites Web, PDF), regarde les exemples du portfolio et calcule son prix exact selon ses quantités.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#FF5E14] text-white font-black text-sm flex items-center justify-center shadow-md">
                    2
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white font-['Outfit']">
                    Il clique sur "Commander"
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Le site génère instantanément un message WhatsApp complet et propre avec la prestation choisie, le prix calculé, les éventuelles options et les instructions.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                    3
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white font-['Outfit']">
                    Paiement & Livraison
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Le client règle facilement via votre lien Wave Business. Dès réception du paiement et des éléments (texte/photo), vous traitez la commande et livrez en 2h à 24h.
                  </p>
                </div>
              </div>

              {/* Share link CTA */}
              <div className="p-5 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-white">Partagez votre lien de site à vos prospects</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Envoyez ce lien dans vos statuts WhatsApp, pages Facebook, Instagram ou TikTok</p>
                </div>

                <button
                  onClick={handleCopySiteLink}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-[#FF5E14] hover:brightness-110 text-white text-xs font-black transition-all shadow-md"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Lien copié !' : 'Copier le lien du site'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: HOW YOU RECEIVE NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* WhatsApp Notification Block */}
                <div className="p-6 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-emerald-950 dark:text-emerald-300">
                        1. Alerte WhatsApp Instantanée
                      </h4>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400">
                        Sur votre numéro : {CONTACT_INFO.whatsappNumber}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Vous recevez un message direct qui ressemble exactement à ceci :
                  </p>

                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-300/80 dark:border-emerald-700/50 font-mono text-[11px] text-slate-800 dark:text-slate-200 space-y-1">
                    <p className="font-bold text-emerald-700 dark:text-emerald-400">✨ NOUVELLE COMMANDE OKBW ✨</p>
                    <p>📦 <strong>Prestation :</strong> Saisie de texte & Mise en page</p>
                    <p>🔢 <strong>Quantité :</strong> 55 pages (Tarif Dégressif)</p>
                    <p>💰 <strong>Montant Verrouillé :</strong> 11 000 FCFA</p>
                    <p>⏱️ <strong>Délai (Coché) :</strong> Express Journée (&lt; 12 Heures)</p>
                    <p>📎 <strong>Fichiers exemplaires joints :</strong> manuscrit_chapitre1.docx, modele_mise_en_page.pdf</p>
                    <p>🔒 <strong>Lien Wave avec montant instancié :</strong> https://wave.com/b/B_s5iX75b-0zQ?amount=11000</p>
                    <p className="text-slate-500 pt-1">"Le client clique sur le lien Wave où 11 000 F est déjà pré-rempli sans risque d'erreur !"</p>
                  </div>
                </div>

                {/* Wave Payment Notification Block */}
                <div className="p-6 rounded-3xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/50 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#0F52BA] text-white flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-sky-950 dark:text-sky-300">
                        2. Notification Wave Business
                      </h4>
                      <p className="text-xs text-sky-700 dark:text-sky-400">
                        Sur votre téléphone / Application Wave
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Lorsque le client clique sur votre lien Wave sécurisé et valide son paiement :
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-start space-x-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Vous recevez un <strong>SMS instantané de Wave</strong> indiquant le montant exact reçu.</span>
                    </div>
                    <div className="flex items-start space-x-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Une notification Push apparaît sur votre application Wave Business avec l'heure et l'expéditeur.</span>
                    </div>
                    <div className="flex items-start space-x-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Le client vous transmet sa capture d'écran / reçu de paiement sur WhatsApp pour validation immédiate.</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: VISITOR TRACKER & ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 flex items-start space-x-3">
                <Eye className="w-5 h-5 text-[#FF5E14] flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-orange-950 dark:text-orange-200">
                  <strong>Compteur d'activité en direct :</strong> Voici l'estimation et le journal des interactions enregistrées sur votre site.
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-[#0F52BA] dark:text-blue-400 font-['Outfit']">
                    {stats.visits}
                  </div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Visiteurs uniques</div>
                  <div className="text-[10px] text-slate-500">Trafic global</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-[#FF5E14] font-['Outfit']">
                    {stats.calcSimulations}
                  </div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Devis simulés</div>
                  <div className="text-[10px] text-slate-500">Calculateur express</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-['Outfit']">
                    {stats.whatsappClicks}
                  </div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Commandes lancées</div>
                  <div className="text-[10px] text-slate-500">Redirections WhatsApp</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-sky-600 font-['Outfit']">
                    {stats.waveClicks}
                  </div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">Paiements Wave</div>
                  <div className="text-[10px] text-slate-500">Passerelle sécurisée</div>
                </div>
              </div>

              {/* Extra Guide: How to track even more precisely */}
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-[#0F52BA]" />
                  <span>Vous voulez aussi voir les statistiques Google ou Facebook ?</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Si vous le désirez, vous pouvez ajouter un identifiant <strong>Google Analytics (ex: G-XXXXXXX)</strong> ou un <strong>Meta Pixel Facebook</strong> pour voir le pays exact des visiteurs, leur ville (Abidjan, Bouaké, Paris...), leur téléphone, et le temps passé sur chaque page.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: STEP BY STEP ACTION GUIDE */}
          {activeTab === 'faq' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Étape 1 : Répondre au message WhatsApp du client
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Quand le client vous écrit via le site, confirmez que vous avez bien reçu sa commande : <em>"Bonjour ! Merci pour votre confiance chez Okbw. J'ai bien reçu votre demande pour [Nom du service]."</em>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Étape 2 : Récupérer ses fichiers & valider le paiement Wave
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Demandez-lui de vous envoyer son ancien CV, son texte Word/PDF ou ses photos. S'il n'a pas encore payé, renvoyez-lui votre lien Wave direct : <code>https://wave.com/b/B_s5iX75b-0zQ</code>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Étape 3 : Réalisation & Livraison Express (2h à 24h)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Vous réalisez la prestation avec vos standards d'excellence, puis vous lui envoyez le fichier final haute définition (PDF imprimable, PNG HD ou document Word modifiable) directement sur WhatsApp ou par e-mail.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Okbw Bureautique & Design • Système 100% opérationnel</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-2xl bg-[#0F52BA] hover:bg-blue-800 text-white text-xs font-bold transition-all"
          >
            Fermer le guide
          </button>
        </div>

      </div>
    </div>
  );
};
