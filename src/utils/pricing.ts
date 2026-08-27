import { CartItem, ServiceItem, TurnaroundOption, UploadedFile } from '../types';
import { CONTACT_INFO, SERVICES_DATA } from '../data/servicesData';

export function formatFCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
  return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
}

export const TURNAROUND_OPTIONS: TurnaroundOption[] = [
  {
    id: 'ultra-express',
    label: 'Ultra Express (< 4 Heures)',
    hoursDetail: 'Moins de 4 heures chrono',
    badge: '⚡ Priorité Maximale',
    description: 'Traitement immédiat par notre équipe, prioritaire sur toutes les commandes.',
    recommended: false
  },
  {
    id: 'express-same-day',
    label: 'Express Journée (< 12 Heures)',
    hoursDetail: 'Moins de 12 heures ouvrées',
    badge: '🚀 Même Journée',
    description: 'Livraison express garantie dans la journée avant 19h00.',
    recommended: true
  },
  {
    id: 'standard',
    label: 'Standard Rapide (24h à 48h)',
    hoursDetail: '24 à 48 heures',
    badge: '⏱️ Délai Classique',
    description: 'Rythme normal de traitement avec vérification qualité complète.',
    recommended: false
  },
  {
    id: 'scheduled',
    label: 'Planifié / Gros Dossier (72h et +)',
    hoursDetail: '72 heures et plus',
    badge: '📅 Volume & Sérénité',
    description: 'Idéal pour thèses universitaires, gros mémoires, relectures denses ou gros packs.',
    recommended: false
  }
];

/**
 * Instantiates the exact payment amount into the Wave Payment Link
 * This prevents underpayment and locks the exact expected service price.
 */
export function generateWavePaymentUrl(amount?: number, memo?: string): string {
  const baseUrl = CONTACT_INFO.wavePaymentUrl;
  if (!amount || amount <= 0) {
    return baseUrl;
  }
  
  const params = new URLSearchParams();
  params.set('amount', amount.toString());
  params.set('currency', 'XOF');
  if (memo) {
    params.set('memo', memo.slice(0, 50));
  }
  
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}${params.toString()}`;
}

export function calculateServicePrice(
  service: ServiceItem,
  quantity: number
): { unitPrice: number; totalPrice: number; savings: number; ruleApplied?: string } {
  const qty = Math.max(1, quantity);
  let unitPrice = service.basePrice;
  let totalPrice = unitPrice * qty;
  let regularTotal = service.basePrice * qty;
  let ruleApplied: string | undefined = undefined;

  switch (service.id) {
    case 'saisie-texte':
      if (qty > 50) {
        unitPrice = 200;
        totalPrice = qty * unitPrice;
        ruleApplied = 'Tarif promo gros volume : 200 F / page (au lieu de 250 F)';
      } else {
        unitPrice = 250;
        totalPrice = qty * unitPrice;
      }
      break;

    case 'retouche-photo':
      if (qty >= 10) {
        unitPrice = 250;
        totalPrice = qty * unitPrice;
        ruleApplied = 'Pack 10+ photos : 250 F / unité (au lieu de 300 F)';
      } else if (qty <= 5) {
        // Pack 5 photos is 1 500 F flat
        totalPrice = 1500;
        unitPrice = Math.round(1500 / qty);
        ruleApplied = `Pack découverte jusqu'à 5 photos (1 500 F forfaitaire)`;
      } else {
        // 6 to 9 photos
        unitPrice = 300;
        totalPrice = qty * unitPrice;
        ruleApplied = '6 à 9 photos : 300 F / photo';
      }
      break;

    case 'creation-affiche':
      if (qty >= 10) {
        unitPrice = 500;
        totalPrice = qty * unitPrice;
        ruleApplied = 'Pack 10+ affiches : 500 F / affiche (au lieu de 2 500 F)';
      } else if (qty >= 3) {
        unitPrice = 1000;
        totalPrice = qty * unitPrice;
        ruleApplied = 'Pack 3 à 9 affiches : 1 000 F / affiche (au lieu de 2 500 F)';
      } else {
        unitPrice = 2500;
        totalPrice = qty * unitPrice;
      }
      break;

    case 'modification-pdf':
      if (qty >= 10) {
        unitPrice = 150;
        totalPrice = qty * unitPrice;
        ruleApplied = 'Palier 10 à 20+ pages : 150 F / page';
      } else if (qty >= 5) {
        unitPrice = 250;
        totalPrice = qty * unitPrice;
        ruleApplied = 'Palier 5 à 9 pages : 250 F / page';
      } else {
        unitPrice = 500;
        totalPrice = qty * unitPrice;
        ruleApplied = 'Palier 1 à 4 pages : 500 F / page';
      }
      break;

    case 'conversion-correction':
      if (qty >= 40) {
        unitPrice = 100;
        totalPrice = qty * unitPrice;
        ruleApplied = 'Pack Volume 40 à 50+ unités : 100 F / unité';
      } else if (qty >= 30) {
        unitPrice = 150;
        totalPrice = qty * unitPrice;
        ruleApplied = 'Pack Volume 30 à 39 unités : 150 F / unité';
      } else if (qty >= 20) {
        unitPrice = 200;
        totalPrice = qty * unitPrice;
        ruleApplied = 'Pack Volume 20 à 29 unités : 200 F / unité';
      } else if (qty >= 5) {
        unitPrice = 250;
        totalPrice = qty * unitPrice;
        ruleApplied = 'Pack Volume 5 à 19 unités : 250 F / unité';
      } else {
        unitPrice = 500;
        totalPrice = qty * unitPrice;
      }
      break;

    default:
      unitPrice = service.basePrice;
      totalPrice = unitPrice * qty;
      break;
  }

  const savings = Math.max(0, regularTotal - totalPrice);

  return { unitPrice, totalPrice, savings, ruleApplied };
}

export function generateWhatsAppOrderLink(
  cart: CartItem[],
  customerInfo?: { name?: string; phone?: string; notes?: string; urgency?: string; turnaroundOption?: TurnaroundOption }
): string {
  const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const waveDirectUrl = generateWavePaymentUrl(totalAmount, `Cmd Okbw ${customerInfo?.name ? '(' + customerInfo.name + ')' : ''}`);

  let message = `👋 *Bonjour Okbw Bureautique et Design !*\n\n`;
  message += `Je souhaite passer une commande via votre site web :\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;

  cart.forEach((item, index) => {
    message += `*${index + 1}. ${item.service.name}*\n`;
    message += `   • Quantité : ${item.quantity} ${item.service.unitLabel}\n`;
    message += `   • Prix unitaire : ${formatFCFA(item.unitPrice)}\n`;
    message += `   • Total article : ${formatFCFA(item.totalPrice)}\n`;
    if (item.customNotes) {
      message += `   • Instructions : _${item.customNotes}_\n`;
    }
    if (item.files && item.files.length > 0) {
      message += `   • Fichiers exemplaires joints (${item.files.length}) :\n`;
      item.files.forEach(f => {
        message += `     📎 ${f.name} (${formatFileSize(f.size)})\n`;
      });
    } else if (item.fileName) {
      message += `   • Fichier exemplaire associé : 📎 ${item.fileName}\n`;
    }
    message += `\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *MONTANT EXACT VERROUILLÉ : ${formatFCFA(totalAmount)}*\n\n`;

  if (customerInfo?.name) {
    message += `👤 *Nom du Client* : ${customerInfo.name}\n`;
  }
  if (customerInfo?.phone) {
    message += `📱 *Téléphone / WhatsApp* : ${customerInfo.phone}\n`;
  }
  if (customerInfo?.turnaroundOption) {
    message += `⏱️ *Délai sélectionné* : ${customerInfo.turnaroundOption.label} (${customerInfo.turnaroundOption.hoursDetail})\n`;
  } else if (customerInfo?.urgency) {
    message += `⏱️ *Délai sélectionné* : ${customerInfo.urgency}\n`;
  }
  if (customerInfo?.notes) {
    message += `📝 *Consignes particulières* : ${customerInfo.notes}\n`;
  }

  message += `\n🔒 *Lien de Paiement Wave Officiel (Montant Verrouillé ${formatFCFA(totalAmount)})* :\n`;
  message += `👉 ${waveDirectUrl}\n\n`;
  message += `_Ce lien intègre directement le montant exact de ${formatFCFA(totalAmount)} pour sécuriser et valider immédiatement ma commande sans risque d'erreur de montant._\n\n`;
  message += `Merci de me confirmer la réception de mes fichiers et le lancement du travail !`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/2250501088608?text=${encoded}`;
}

export function generateQuickServiceWhatsAppLink(
  service: ServiceItem, 
  quantity: number = 1,
  files?: UploadedFile[],
  turnaround?: TurnaroundOption
): string {
  const { totalPrice, unitPrice, ruleApplied } = calculateServicePrice(service, quantity);
  const waveDirectUrl = generateWavePaymentUrl(totalPrice, `Service ${service.name.slice(0, 30)}`);
  
  let message = `👋 *Bonjour Okbw Bureautique et Design !*\n\n`;
  message += `Je souhaite commander directement la prestation suivante :\n\n`;
  message += `📌 *Prestation* : ${service.name}\n`;
  message += `🔢 *Quantité* : ${quantity} (${service.unitLabel})\n`;
  message += `💵 *Montant exact verrouillé* : ${formatFCFA(totalPrice)} (${formatFCFA(unitPrice)}/unité)\n`;
  if (ruleApplied) {
    message += `✨ *Règle appliquée* : ${ruleApplied}\n`;
  }
  if (turnaround) {
    message += `⏱️ *Délai sélectionné* : ${turnaround.label} (${turnaround.hoursDetail})\n`;
  } else {
    message += `⏱️ *Délai estimé* : ${service.deliveryTime}\n`;
  }

  if (files && files.length > 0) {
    message += `📁 *Fichiers exemplaires prêts (${files.length})* :\n`;
    files.forEach(f => {
      message += `   📎 ${f.name} (${formatFileSize(f.size)})\n`;
    });
  }

  message += `\n🔒 *Lien de paiement Wave sécurisé avec montant exact (${formatFCFA(totalPrice)})* :\n`;
  message += `👉 ${waveDirectUrl}\n\n`;
  message += `Je transmets mes consignes et fichiers pour démarrage immédiat. Merci !`;

  return `https://wa.me/2250501088608?text=${encodeURIComponent(message)}`;
}

export function getServiceById(id: string): ServiceItem | undefined {
  return SERVICES_DATA.find((s) => s.id === id);
}
