import { CartItem, ServiceItem } from '../types';
import { CONTACT_INFO, SERVICES_DATA } from '../data/servicesData';

export function formatFCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
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
  customerInfo?: { name?: string; phone?: string; notes?: string; urgency?: string }
): string {
  const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0);

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
    if (item.fileName) {
      message += `   • Fichier associé : 📎 ${item.fileName}\n`;
    }
    message += `\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *TOTAL DE LA COMMANDE : ${formatFCFA(totalAmount)}*\n\n`;

  if (customerInfo?.name) {
    message += `👤 *Client* : ${customerInfo.name}\n`;
  }
  if (customerInfo?.phone) {
    message += `📱 *Téléphone* : ${customerInfo.phone}\n`;
  }
  if (customerInfo?.urgency) {
    message += `⏱️ *Délai souhaité* : ${customerInfo.urgency}\n`;
  }
  if (customerInfo?.notes) {
    message += `📝 *Notes complémentaires* : ${customerInfo.notes}\n`;
  }

  message += `\n💳 *Mode de règlement souhaité* : Wave Business ou Mobile Money\n`;
  message += `🔗 Lien de paiement Wave préparé : ${CONTACT_INFO.wavePaymentUrl}\n\n`;
  message += `Merci de me confirmer la prise en charge et les étapes de transmission des documents !`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/2250501088608?text=${encoded}`;
}

export function generateQuickServiceWhatsAppLink(service: ServiceItem, quantity: number = 1): string {
  const { totalPrice, unitPrice, ruleApplied } = calculateServicePrice(service, quantity);
  
  let message = `👋 *Bonjour Okbw Bureautique et Design !*\n\n`;
  message += `Je souhaite commander directement la prestation suivante :\n\n`;
  message += `📌 *Prestation* : ${service.name}\n`;
  message += `🔢 *Quantité* : ${quantity} (${service.unitLabel})\n`;
  message += `💵 *Tarif estimé* : ${formatFCFA(totalPrice)} (${formatFCFA(unitPrice)}/unité)\n`;
  if (ruleApplied) {
    message += `✨ *Offre appliquée* : ${ruleApplied}\n`;
  }
  message += `⏱️ *Délai estimé* : ${service.deliveryTime}\n\n`;
  message += `Je suis prêt à payer via Wave Business (${CONTACT_INFO.wavePaymentUrl}).\n`;
  message += `Comment procédons-nous pour l'envoi de mes fichiers / informations ?`;

  return `https://wa.me/2250501088608?text=${encodeURIComponent(message)}`;
}

export function getServiceById(id: string): ServiceItem | undefined {
  return SERVICES_DATA.find((s) => s.id === id);
}
