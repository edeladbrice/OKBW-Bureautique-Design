import { jsPDF } from 'jspdf';
import { formatFCFA, getWavePaymentUrl } from './pricing';
import { ServiceItem } from '../types';

export interface ProformaInvoiceData {
  orderReference: string;
  date: string;
  customerName: string;
  customerPhone: string;
  items: Array<{
    name: string;
    quantity: number;
    unitLabel: string;
    unitPrice: number;
    totalPrice: number;
    notes?: string;
  }>;
  totalAmount: number;
  turnaround?: string;
  instructions?: string;
  isAdministrative?: boolean;
}

export function generateProformaPDF(data: ProformaInvoiceData): jsPDF {
  const doc尴尬 = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const doc = doc尴尬;

  // Colors
  const primaryBlue = [15, 82, 186]; // #0F52BA
  const darkNavy = [15, 23, 42]; // #0F172A
  const accentOrange = [255, 94, 20]; // #FF5E14
  const lightBg = [248, 250, 252]; // #F8FAFC
  const slateGray = [100, 116, 139]; // #64748B
  const emeraldGreen = [16, 185, 129]; // #10B981

  // Header Banner
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 0, 210, 38, 'F');

  // Top accent line
  doc.setFillColor(accentOrange[0], accentOrange[1], accentOrange[2]);
  doc.rect(0, 37, 210, 1.5, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('OKBW BUREAUTIQUE & DESIGN', 15, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('Solutions Bureautiques, Graphisme, Actes Officiels & Digital', 15, 25);
  doc.text('Abidjan, Côte d\'Ivoire • Tél: +225 01 41 75 24 03 / +225 01 40 01 88 31', 15, 30);

  // Document Title (Right side header)
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('DEVIS PROFORMA', 195, 18, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 180, 140);
  doc.text(`Réf : ${data.orderReference}`, 195, 25, { align: 'right' });
  doc.setTextColor(203, 213, 225);
  doc.text(`Date : ${data.date}`, 195, 30, { align: 'right' });

  // Customer & Order Info Box
  let currentY = 48;

  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(15, currentY, 180, 32, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, currentY, 180, 32, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('INFORMATIONS CLIENT & COMMANDE', 20, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);

  doc.text('Client :', 20, currentY + 14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(data.customerName || 'Client Particulier / Professionnel', 40, currentY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('Contact WhatsApp :', 20, currentY + 20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text(data.customerPhone || 'Non spécifié', 55, currentY + 20);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('Délai d\'exécution :', 20, currentY + 26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(data.turnaround || 'Standard Rapide (24h à 48h)', 55, currentY + 26);

  // Right Column of Info Box
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('Mode de Règlement :', 120, currentY + 14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
  doc.text('Wave Business Officiel', 158, currentY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('Statut :', 120, currentY + 20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
  doc.text('En attente de validation', 158, currentY + 20);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('Validité de l\'offre :', 120, currentY + 26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('30 Jours', 158, currentY + 26);

  // Items Table Header
  currentY += 40;

  doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.roundedRect(15, currentY, 180, 8, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('DESIGNATION DE LA PRESTATION', 20, currentY + 5.5);
  doc.text('QTE', 125, currentY + 5.5, { align: 'center' });
  doc.text('PRIX UNIT.', 150, currentY + 5.5, { align: 'center' });
  doc.text('TOTAL (FCFA)', 185, currentY + 5.5, { align: 'right' });

  // Items Rows
  currentY += 10;
  doc.setFontSize(8.5);

  data.items.forEach((item, index) => {
    // Zebra striping
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, currentY - 2, 180, 10, 'F');
    }

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text(item.name, 20, currentY + 4);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
    doc.text(`${item.quantity} ${item.unitLabel}`, 125, currentY + 4, { align: 'center' });
    doc.text(formatFCFA(item.unitPrice), 150, currentY + 4, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text(formatFCFA(item.totalPrice), 185, currentY + 4, { align: 'right' });

    // Item notes / instructions if any
    if (item.notes) {
      currentY += 6;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Note : ${item.notes}`, 22, currentY + 2);
      currentY += 4;
    } else {
      currentY += 10;
    }
  });

  // Table Bottom Border
  doc.setDrawColor(203, 213, 225);
  doc.line(15, currentY, 195, currentY);

  // Total Summary Box
  currentY += 5;

  const totalBoxX = 115;
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.roundedRect(totalBoxX, currentY, 80, 24, 2, 2, 'F');

  doc.setTextColor(203, 213, 225);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Total Hors Taxe (HT) :', totalBoxX + 6, currentY + 7);
  doc.text(formatFCFA(data.totalAmount), 190, currentY + 7, { align: 'right' });

  doc.text('TVA (0% Auto-entrepreneur) :', totalBoxX + 6, currentY + 13);
  doc.text('0 FCFA', 190, currentY + 13, { align: 'right' });

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('TOTAL NET A PAYER :', totalBoxX + 6, currentY + 20);
  doc.setTextColor(255, 180, 140);
  doc.text(formatFCFA(data.totalAmount), 190, currentY + 20, { align: 'right' });

  // Payment Instructions & Wave Info Box (Left side bottom)
  const paymentY = currentY;
  doc.setFillColor(240, 249, 255); // sky-50
  doc.roundedRect(15, paymentY, 95, 34, 2, 2, 'F');
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(15, paymentY, 95, 34, 2, 2, 'S');

  doc.setTextColor(14, 116, 144);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('PAIEMENT SECURISE VIA WAVE BUSINESS', 20, paymentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text('• Lien Marchand Direct :', 20, paymentY + 12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(2, 132, 199);
  doc.text(getWavePaymentUrl(data.totalAmount), 20, paymentY + 17);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text('• Prestation standard : Règlement après validation aperçu', 20, paymentY + 23);
  doc.text('• Actes judiciaires : Règlement timbres & greffe à l\'envoi', 20, paymentY + 28);
  doc.text('• Livraison HD immédiate dès confirmation Wave', 20, paymentY + 32);

  // General Terms & Official Stamp
  currentY += 40;

  // Digital Stamp Box
  const stampX = 130;
  doc.setDrawColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.setLineWidth(0.8);
  doc.roundedRect(stampX, currentY + 2, 65, 28, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text('OKBW BUREAUTIQUE & DESIGN', stampX + 32.5, currentY + 8, { align: 'center' });
  doc.setFontSize(7);
  doc.setTextColor(accentOrange[0], accentOrange[1], accentOrange[2]);
  doc.text('BON POUR ACCORD & LIVRAISON', stampX + 32.5, currentY + 14, { align: 'center' });
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text(`Abidjan, le ${data.date}`, stampX + 32.5, currentY + 20, { align: 'center' });
  doc.setFont('helvetica', 'italic');
  doc.text('Signature & Cachet Numérique', stampX + 32.5, currentY + 25, { align: 'center' });

  // Terms text (Left side)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('CONDITIONS GENERALES & GARANTIE OKBW :', 15, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('1. Révisions illimitées jusqu\'à entière satisfaction du client.', 15, currentY + 12);
  doc.text('2. Fichiers livrés en Haute Définition (PDF vectoriel, Word ou PNG/JPEG 300 DPI).', 15, currentY + 17);
  doc.text('3. Délais contractuels respectés selon l\'option de livraison sélectionnée.', 15, currentY + 22);
  doc.text('4. Envoi de vos éléments justificatifs par WhatsApp : +225 01 41 75 24 03.', 15, currentY + 27);

  // Footer banner
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 285, 210, 12, 'F');

  doc.setTextColor(203, 213, 225);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('OKBW Bureautique & Design • Service Client 24/7 WhatsApp: +225 01 41 75 24 03 / +225 01 40 01 88 31', 105, 291, { align: 'center' });
  doc.text('Paiement officiel sécurisé par Wave Business CI • Document généré automatiquement sur okbw.ci', 105, 294.5, { align: 'center' });

  return doc;
}

export function downloadProformaPDF(data: ProformaInvoiceData) {
  const doc = generateProformaPDF(data);
  const fileName = `Devis-OKBW-${data.orderReference}.pdf`;
  doc.save(fileName);
}
