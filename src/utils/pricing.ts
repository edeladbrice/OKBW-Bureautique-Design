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

export const PRIMARY_WHATSAPP_NUMBER = '2250141752403';
export const SECONDARY_CONTACT_NUMBER = '+225 01 40 01 88 31';
export const DISPLAY_CONTACTS = '+225 01 41 75 24 03 / +225 01 40 01 88 31';
export const WAVE_PAYMENT_URL = 'https://pay.wave.com/m/M_ci_xSfaNea0jdqH/c/ci/';

export function getWavePaymentUrl(amount?: number): string {
  if (amount && amount > 0) {
    return `https://pay.wave.com/m/M_ci_xSfaNea0jdqH/c/ci/?amount=${Math.round(amount)}`;
  }
  return WAVE_PAYMENT_URL;
}

export const ADMIN_SERVICE_IDS = [
  'certificat-nationalite',
  'casier-judiciaire',
  'pack-nationalite-casier'
];

export function isAdministrativeService(serviceOrId: ServiceItem | string): boolean {
  if (typeof serviceOrId === 'string') {
    return ADMIN_SERVICE_IDS.includes(serviceOrId);
  }
  return serviceOrId.category === 'administratif' || ADMIN_SERVICE_IDS.includes(serviceOrId.id);
}

export function hasAdministrativeService(cart: CartItem[]): boolean {
  return cart.some(item => isAdministrativeService(item.service));
}

export const ADMINISTRATIVE_LOCKED_TURNAROUND: TurnaroundOption = {
  id: 'admin-legal-72h',
  label: 'Délai Légal Greffe / Tribunal (72h / 3 Jours)',
  hoursDetail: '72h ouvrées (3 jours) • Reçu immédiat dès paiement',
  badge: '⚖️ 72h Délai Greffe',
  description: 'Reçu officiel de demande et transaction transmis immédiatement dès le paiement. Retrait du document physique 3 jours après la demande au tribunal.',
  recommended: true
};

export function generateOrderReference(): string {
  const randomCode = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  return `OKBW-${year}-${randomCode}`;
}

export interface StoredOrderRecord {
  id: string;
  orderReference: string;
  date: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  quantityText: string;
  totalAmount: number;
  instructions: string;
  status: 'recu' | 'conception' | 'apercu_pret' | 'regle_livre';
  wavePaymentUrl: string;
  isAdministrative?: boolean;
}

export function saveOrderToHistory(order: Omit<StoredOrderRecord, 'id'>): StoredOrderRecord {
  const fullOrder: StoredOrderRecord = {
    ...order,
    id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  };

  try {
    const existing = localStorage.getItem('okbw_orders_history');
    const list: StoredOrderRecord[] = existing ? JSON.parse(existing) : [];
    list.unshift(fullOrder);
    // Keep last 50 orders
    localStorage.setItem('okbw_orders_history', JSON.stringify(list.slice(0, 50)));
  } catch (e) {
    console.error('Error saving order history', e);
  }

  return fullOrder;
}

export function getStoredOrders(): StoredOrderRecord[] {
  try {
    const existing = localStorage.getItem('okbw_orders_history');
    return existing ? JSON.parse(existing) : [];
  } catch {
    return [];
  }
}

export function updateStoredOrderStatus(orderReference: string, status: StoredOrderRecord['status']) {
  try {
    const list = getStoredOrders();
    const updated = list.map(item => item.orderReference === orderReference ? { ...item, status } : item);
    localStorage.setItem('okbw_orders_history', JSON.stringify(updated));
  } catch (e) {
    console.error('Error updating order status', e);
  }
}

export function buildWhatsAppFormattedMessage(params: {
  serviceName: string;
  quantityText: string;
  customerName?: string;
  customerPhone?: string;
  instructions?: string;
  totalAmount: number;
  isAdministrative?: boolean;
  orderReference?: string;
}): string {
  const ref = params.orderReference || generateOrderReference();
  const name = params.customerName?.trim() ? params.customerName.trim() : 'Non renseigné';
  const phone = params.customerPhone?.trim() ? params.customerPhone.trim() : 'Non renseigné';
  const instructions = params.instructions?.trim() ? params.instructions.trim() : 'Prestation standard';
  const wavePaymentLink = getWavePaymentUrl(params.totalAmount);

  let message = `Bonjour OKBW Bureautique & Design !\n`;
  message += `Voici le récapitulatif de ma commande via le Bot du site :\n\n`;
  message += `• Réf. Commande : ${ref}\n`;
  message += `• Service : ${params.serviceName}\n`;
  message += `• Quantité / Pages : ${params.quantityText}\n`;
  message += `• Nom du client : ${name}\n`;
  if (phone && phone !== 'Non renseigné') {
    message += `• Contact WhatsApp client : ${phone}\n`;
  }
  message += `• Instructions : ${instructions}\n`;
  
  if (params.isAdministrative) {
    message += `• Montant total : ${formatFCFA(params.totalAmount)}\n`;
    message += `• Modalité : Règlement à l'enregistrement (Timbres fiscaux & greffe) • Reçu officiel immédiat dès paiement • Retrait physique sous 72h\n`;
    message += `• Lien de paiement Wave officiel : ${wavePaymentLink}\n\n`;
    message += `Je vous joins les photos/scans de mes pièces justificatives ci-dessous dans cette discussion.`;
  } else {
    message += `• Montant à régler à la livraison : ${formatFCFA(params.totalAmount)}\n`;
    message += `• Lien de paiement Wave officiel : ${wavePaymentLink}\n\n`;
    message += `Je vous joins mes fichiers ci-dessous dans cette discussion.\n`;
    message += `(Règlement via le lien Wave ci-dessus dès validation de l'aperçu).`;
  }

  // Also auto-save to local order history
  saveOrderToHistory({
    orderReference: ref,
    date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    customerName: name,
    customerPhone: phone,
    serviceName: params.serviceName,
    quantityText: params.quantityText,
    totalAmount: params.totalAmount,
    instructions,
    status: 'recu',
    wavePaymentUrl: wavePaymentLink,
    isAdministrative: params.isAdministrative
  });

  return message;
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

  let serviceName = '';
  let quantityText = '';

  if (cart.length === 1) {
    const item = cart[0];
    serviceName = item.service.name;
    quantityText = `${item.quantity} (${item.service.unitLabel})`;
  } else {
    serviceName = cart.map((item) => `${item.service.name} (${item.quantity} ${item.service.unitLabel})`).join(' + ');
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    quantityText = `${totalQty} (${cart.length} prestations)`;
  }

  const detailsList: string[] = [];
  if (customerInfo?.phone?.trim()) {
    detailsList.push(`Tél: ${customerInfo.phone.trim()}`);
  }
  if (customerInfo?.turnaroundOption) {
    detailsList.push(`Délai souhaité : ${customerInfo.turnaroundOption.label} (${customerInfo.turnaroundOption.hoursDetail})`);
  } else if (customerInfo?.urgency) {
    detailsList.push(`Délai : ${customerInfo.urgency}`);
  }

  cart.forEach((item) => {
    if (item.customNotes?.trim()) {
      detailsList.push(`${item.service.name} : "${item.customNotes.trim()}"`);
    }
  });

  if (customerInfo?.notes?.trim()) {
    detailsList.push(customerInfo.notes.trim());
  }

  const instructions = detailsList.length > 0 ? detailsList.join(' | ') : 'Prestation standard';

  const isAdministrative = hasAdministrativeService(cart);

  const message = buildWhatsAppFormattedMessage({
    serviceName,
    quantityText,
    customerName: customerInfo?.name,
    customerPhone: customerInfo?.phone,
    instructions,
    totalAmount,
    isAdministrative
  });

  return `https://wa.me/${PRIMARY_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generateQuickServiceWhatsAppLink(
  service: ServiceItem, 
  quantity: number = 1,
  customerName?: string,
  customerPhone?: string,
  customDetails?: string,
  turnaround?: TurnaroundOption
): string {
  const { totalPrice } = calculateServicePrice(service, quantity);
  const isAdministrative = isAdministrativeService(service);
  
  const detailsParts: string[] = [];
  if (turnaround) {
    detailsParts.push(`Délai souhaité : ${turnaround.label} (${turnaround.hoursDetail})`);
  }
  if (customDetails?.trim()) {
    detailsParts.push(customDetails.trim());
  }
  const instructions = detailsParts.length > 0 ? detailsParts.join(' | ') : 'Prestation standard';

  const message = buildWhatsAppFormattedMessage({
    serviceName: service.name,
    quantityText: `${quantity} (${service.unitLabel})`,
    customerName,
    customerPhone,
    instructions,
    totalAmount: totalPrice,
    isAdministrative
  });

  return `https://wa.me/${PRIMARY_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getServiceById(id: string): ServiceItem | undefined {
  return SERVICES_DATA.find((s) => s.id === id);
}
