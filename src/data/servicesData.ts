import { ServiceItem, ContactInfo } from '../types';

export const CONTACT_INFO: ContactInfo = {
  whatsappNumber: '+225 01 41 75 24 03',
  secondaryPhone: '+225 01 40 01 88 31',
  displayContacts: '+225 01 41 75 24 03 / +225 01 40 01 88 31',
  whatsappUrl: 'https://wa.me/2250141752403',
  wavePaymentUrl: 'https://pay.wave.com/m/M_ci_xSfaNea0jdqH/c/ci/',
  email: 'contact@okbw-design.ci',
  location: 'Abidjan, Côte d\'Ivoire & Services à distance 24/7',
  hours: 'Lun - Sam : 08h00 - 20h00 | Urgences PDF & CV 7j/7'
};

export const SERVICES_DATA: ServiceItem[] = [
  // 1. COLLECTION BUREAUTIQUE & DOCUMENTS
  {
    id: 'cv-premium',
    name: 'CV Professionnel (Design + Costume)',
    category: 'bureautique',
    basePrice: 1000,
    priceDisplay: '1 000 F',
    unitLabel: 'CV complet',
    description: 'Transformation complète de votre profil professionnel. Inclut la mise en page moderne, l\'ajout d\'un costume virtuel sur votre photo et un fond blanc net. Idéal pour postuler dans de grandes entreprises et multinationales.',
    inclusions: [
      'Mise en page graphique moderne & percutante',
      'Ajout d\'un costume virtuel professionnel sur votre photo',
      'Détourage net sur fond blanc ou sobre',
      'Optimisation des rubriques (compétences, expériences)',
      'Export PDF Haute Définition prêt à l\'envoi + version modifiable'
    ],
    badge: 'Best-Seller Pro',
    icon: 'FileUser',
    deliveryTime: '24h max (Express 6h disponible)',
    recommended: true
  },
  {
    id: 'cv-standard',
    name: 'CV Standard',
    category: 'bureautique',
    basePrice: 500,
    priceDisplay: '500 F',
    unitLabel: 'CV',
    description: 'Mise en page propre et professionnelle de votre parcours. Utilisation de votre photo actuelle sans retouche complexe. Rapide et efficace pour vos candidatures.',
    inclusions: [
      'Mise en page claire, sobre et structurée',
      'Intégration de votre photo originale',
      'Organisation chronologique ou thématique',
      'Fichier PDF Haute Résolution pour l\'impression et l\'envoi email'
    ],
    icon: 'FileText',
    deliveryTime: '12h à 24h'
  },
  {
    id: 'saisie-texte',
    name: 'Saisie de texte & Mémoires',
    category: 'bureautique',
    basePrice: 250,
    priceDisplay: '250 F',
    unitLabel: 'par page',
    description: 'Saisie informatique rapide et fidèle de vos manuscrits, cours, thèses, rapports de stage ou mémoires universitaires.',
    promoNote: '👉 Promo : Le prix passe à 200 F / page pour les documents de plus de 50 pages.',
    volumeRulesDescription: '1 à 50 pages : 250 F / page | Plus de 50 pages : 200 F / page',
    pricingTiers: [
      { minQty: 1, maxQty: 50, unitPrice: 250, label: '1 à 50 pages' },
      { minQty: 51, unitPrice: 200, label: 'Plus de 50 pages (Promo)' }
    ],
    inclusions: [
      'Saisie fidèle de manuscrits ou notes vocales/photos',
      'Mise en page universitaire ou administrative conforme',
      'Sommaire automatique et pagination',
      'Livraison aux formats Word (.docx) et PDF'
    ],
    icon: 'Keyboard',
    deliveryTime: 'Selon volume (20 à 40 pages / jour)'
  },
  {
    id: 'lettre-motivation',
    name: 'Lettre de Motivation / Administrative',
    category: 'bureautique',
    basePrice: 500,
    priceDisplay: '500 F',
    unitLabel: 'la lettre',
    description: 'Rédaction ou mise en forme percutante de vos lettres de motivation, demandes d\'emploi, lettres de démission ou courriers administratifs officiels. Style formel et convaincant.',
    inclusions: [
      'Structure formelle respectant les codes professionnels',
      'Accroche personnalisée selon le poste ou l\'organisme',
      'Style rédactionnel soigné et persuasif',
      'Format Word modifiable + PDF prêt à signer et envoyer'
    ],
    icon: 'MailCheck',
    deliveryTime: '12h à 24h'
  },
  {
    id: 'presentation-powerpoint',
    name: 'Diaporama PowerPoint (Soutenance / Pro)',
    category: 'bureautique',
    basePrice: 2500,
    priceDisplay: '2 500 F',
    unitLabel: 'diaporama (jusqu\'à 15 slides)',
    description: 'Création de supports visuels captivants et dynamiques pour vos soutenances de mémoire, présentations d\'entreprise, pitchs commerciaux ou séminaires.',
    promoNote: '👉 Inclus : Jusqu\'à 15 diapositives structurées pour captiver votre audience.',
    inclusions: [
      'Conception graphique moderne & charte graphique adaptée',
      'Jusqu\'à 15 diapositives professionnelles incluses',
      'Intégration d\'icônes vectorielles, graphiques et schémas',
      'Transitions sobres et lisibilité optimale sur vidéoprojecteur',
      'Fichiers PowerPoint (.pptx) + PDF pour présentation'
    ],
    badge: 'Spécial Soutenance',
    icon: 'Presentation',
    deliveryTime: '24h à 48h'
  },

  // 2. COLLECTION DESIGN & IMAGE
  {
    id: 'retouche-photo',
    name: 'Retouche & Restauration Photo',
    category: 'design',
    basePrice: 1500,
    priceDisplay: '1 500 F',
    unitLabel: 'le pack 5 photos',
    description: 'Redonnez vie à vos précieux souvenirs. Restauration de vieilles photos abîmées, déchirées, décolorées ou floues grâce à nos techniques avancées.',
    promoNote: '👉 Packs : 1 500 F les 5 photos | 250 F l\'unité à partir de 10 photos.',
    volumeRulesDescription: '1 à 5 photos : Pack 1 500 F | 6 à 9 photos : 300 F / photo | 10+ photos : 250 F / photo',
    pricingTiers: [
      { minQty: 1, maxQty: 5, unitPrice: 300, label: 'Pack 5 photos (1 500 F total)' },
      { minQty: 6, maxQty: 9, unitPrice: 300, label: '6 à 9 photos (300 F/u)' },
      { minQty: 10, unitPrice: 250, label: '10 photos et plus (250 F/u)' }
    ],
    inclusions: [
      'Suppression des rayures, pliures et taches d\'usure',
      'Rehaussement de netteté et amélioration des visages',
      'Correction colorimétrique ou colorisation photo N&B',
      'Livraison en format JPEG / PNG très haute résolution'
    ],
    badge: 'Artisanat Numérique',
    icon: 'ImagePlus',
    deliveryTime: '24h à 48h'
  },
  {
    id: 'creation-affiche',
    name: 'Création d\'Affiches (Pub / Événement)',
    category: 'design',
    basePrice: 2500,
    priceDisplay: '2 500 F',
    unitLabel: 'l\'affiche',
    description: 'Design percutant et mémorable pour vos événements, concerts, campagnes promotionnelles, salons, réseaux sociaux ou affichages grand format.',
    promoNote: '👉 Packs : 1 000 F l\'unité (si commande de 3 affiches) | 500 F l\'unité à partir de 10 affiches.',
    volumeRulesDescription: '1 affiche : 2 500 F | 3 affiches : 3 000 F (1 000 F/u) | 10+ affiches : 500 F / unité',
    pricingTiers: [
      { minQty: 1, maxQty: 2, unitPrice: 2500, label: '1 à 2 affiches (2 500 F/u)' },
      { minQty: 3, maxQty: 9, unitPrice: 1000, label: 'Pack 3+ affiches (1 000 F/u)' },
      { minQty: 10, unitPrice: 500, label: 'Pack 10+ affiches (500 F/u)' }
    ],
    inclusions: [
      'Création visuelle 100% originale et sur-mesure',
      'Adaptation aux dimensions réseaux sociaux (Story, Feed) & Print (A4, A3, Roll-up)',
      'Typographies tendance et traitement d\'images captivant',
      'Fichiers HD prêts à diffuser et imprimer'
    ],
    badge: 'Impact Garanti',
    icon: 'Sparkles',
    deliveryTime: '24h à 48h',
    recommended: true
  },
  {
    id: 'creation-logo',
    name: 'Création de Logo Sur-Mesure',
    category: 'design',
    basePrice: 3500,
    priceDisplay: '3 500 F',
    unitLabel: 'pack identité',
    description: 'Identité visuelle unique et distinctive basée sur vos besoins, vos valeurs et votre secteur d\'activité. Idéal pour lancer votre marque ou entreprise.',
    promoNote: '👉 Inclus : 2 variantes au choix + Remise des fichiers en Haute Définition.',
    inclusions: [
      '2 propositions de concepts graphiques distincts',
      'Affinage et révisions sur le concept sélectionné',
      'Déclinaisons fond clair, fond sombre et monochrome',
      'Pack complet HD (PNG transparent, JPG haute résolution)',
      'Guide rapide des couleurs (codes HEX/RVB)'
    ],
    badge: 'Incontournable Créateurs',
    icon: 'Palette',
    deliveryTime: '48h à 72h'
  },
  {
    id: 'carte-de-visite',
    name: 'Design Carte de Visite',
    category: 'design',
    basePrice: 2000,
    priceDisplay: '2 000 F',
    unitLabel: 'design recto/verso',
    description: 'Conception graphique haut de gamme de votre carte de visite professionnelle. Fichier livré calibré et prêt pour l\'impression directe chez votre imprimeur habituel.',
    inclusions: [
      'Conception Recto ou Recto/Verso moderne',
      'Intégration de votre logo, coordonnées et QR Code dynamique',
      'Marges techniques et traits de coupe d\'imprimerie intégrés',
      'Livraison PDF vectoriel CMJN 300 DPI + aperçu 3D'
    ],
    icon: 'CreditCard',
    deliveryTime: '24h'
  },

  // 3. COLLECTION OPTIMISATION & EXPERTISE
  {
    id: 'scan-archivage',
    name: 'Scan & Archivage Numérique',
    category: 'optimisation',
    basePrice: 100,
    priceDisplay: '100 F',
    unitLabel: 'par document/page',
    description: 'Numérisation haute résolution de vos documents physiques, contrats, reçus ou registres. Scan haute qualité avec redressement et classement organisé en format PDF pour votre mobile ou ordinateur.',
    inclusions: [
      'Numérisation haute définition sans perte de détails',
      'Nettoyage des fonds et redressement automatique',
      'Nommage structuré et classement par dossiers thématiques',
      'Optimisation du poids de fichier pour envoi WhatsApp / Email'
    ],
    icon: 'ScanLine',
    deliveryTime: 'Express dans la journée'
  },
  {
    id: 'correction-reecriture',
    name: 'Correction & Réécriture Pro',
    category: 'optimisation',
    basePrice: 500,
    priceDisplay: '500 F',
    unitLabel: 'par page',
    description: 'Relecture approfondie et méticuleuse de vos écrits. Correction stricte de l\'orthographe, de la grammaire, de la syntaxe et amélioration du style pour un rendu irréprochable.',
    inclusions: [
      'Correction grammaticale, lexicale et orthographique',
      'Harmonisation de la syntaxe et du ton de communication',
      'Suppression des répétitions et coquilles',
      'Document avec suivi des modifications + version finale nettoyée'
    ],
    icon: 'SpellCheck',
    deliveryTime: '24h (selon volume)'
  },

  // 4. COLLECTION SOLUTIONS PDF & CONVERSION
  {
    id: 'modification-pdf',
    name: 'Modification de Document PDF (Texte/Image)',
    category: 'pdf',
    basePrice: 500,
    priceDisplay: '500 F',
    unitLabel: 'par page',
    description: 'Modification directe et invisible de vos fichiers PDF existants : changer une date, corriger un nom, actualiser un montant, effacer ou ajouter un paragraphe ou une image.',
    promoNote: '👉 Tarifs dégressifs : 1 à 4 p (500 F/p) | 5 à 9 p (250 F/p) | 10 à 20 p (150 F/p)',
    volumeRulesDescription: '1 à 4 pages : 500 F / page | 5 à 9 pages : 250 F / page | 10 à 20 pages : 150 F / page',
    pricingTiers: [
      { minQty: 1, maxQty: 4, unitPrice: 500, label: '1 à 4 pages (500 F/p)' },
      { minQty: 5, maxQty: 9, unitPrice: 250, label: '5 à 9 pages (250 F/p)' },
      { minQty: 10, maxQty: 50, unitPrice: 150, label: '10 à 20+ pages (150 F/p)' }
    ],
    inclusions: [
      'Conservation parfaite des polices d\'origine',
      'Retouche textuelle et remplacement d\'images',
      'Suppression ou ajout d\'éléments sans trace de montage',
      'Sauvegarde PDF optimisée et sécurisée'
    ],
    badge: 'Service Express',
    icon: 'FileEdit',
    deliveryTime: '2h à 6h (Urgence disponible)',
    recommended: true
  },
  {
    id: 'conversion-simple',
    name: 'Conversion simple (PDF ↔ Word/Excel)',
    category: 'pdf',
    basePrice: 250,
    priceDisplay: '250 F',
    unitLabel: 'par document',
    description: 'Conversion fidèle de vos documents vers un format modifiable (Word, Excel) ou portable (PDF) sans altération de contenu. Fidélité garantie au document d\'origine.',
    inclusions: [
      'Conversion PDF vers Word modifiable (.docx) ou Excel (.xlsx)',
      'Conversion Word/PowerPoint/Images vers PDF certifié',
      'Maintien de la structure des tableaux et des colonnes',
      'Reconnaissance optique des caractères (OCR) de base'
    ],
    icon: 'RefreshCw',
    deliveryTime: 'Moins d\'1 heure'
  },
  {
    id: 'conversion-correction',
    name: 'Conversion avec Correction & Mise au propre',
    category: 'pdf',
    basePrice: 500,
    priceDisplay: '500 F',
    unitLabel: 'par unité',
    description: 'Service complet à haute valeur ajoutée : nous convertissons votre document ET nous corrigeons manuellement toutes les fautes, les décalages de mise en page, les césures ou les bugs de conversion.',
    promoNote: '👉 Packs Volume : 1u = 500 F | 5-10u = 250 F | 20u = 200 F | 30u = 150 F | 40-50u = 100 F',
    volumeRulesDescription: '1u : 500 F | 5-10u : 250 F/u | 20u : 200 F/u | 30u : 150 F/u | 40-50u : 100 F/u',
    pricingTiers: [
      { minQty: 1, maxQty: 4, unitPrice: 500, label: '1 à 4 unités (500 F/u)' },
      { minQty: 5, maxQty: 19, unitPrice: 250, label: '5 à 19 unités (250 F/u)' },
      { minQty: 20, maxQty: 29, unitPrice: 200, label: '20 à 29 unités (200 F/u)' },
      { minQty: 30, maxQty: 39, unitPrice: 150, label: '30 à 39 unités (150 F/u)' },
      { minQty: 40, unitPrice: 100, label: '40 à 50+ unités (100 F/u)' }
    ],
    inclusions: [
      'Conversion technique haute précision',
      'Correction manuelle des incohérences et textes cassés',
      'Reprise esthétique de la mise en page (marges, polices, tableaux)',
      'Livraison des fichiers éditables propres et version PDF parfaite'
    ],
    badge: 'Qualité Zéro Défaut',
    icon: 'CheckCircle2',
    deliveryTime: '24h à 48h'
  },

  // 5. SERVICES INFORMATIQUES & CRÉATION WEB
  {
    id: 'web-vitrine',
    name: 'Site Web Vitrine (Landing Page / One-Page)',
    category: 'web',
    basePrice: 35000,
    maxPrice: 50000,
    priceDisplay: '35 000 F à 50 000 F',
    unitLabel: 'projet clé en main',
    description: 'Site responsive 1 page moderne et ultra-rapide (style landing page), conçu pour présenter vos activités et générer des contacts qualifiés.',
    inclusions: [
      'Design responsive optimisé mobile, tablette et PC',
      'Intégration boutons d\'action WhatsApp & Wave direct',
      'Formulaire de contact relié à votre boîte email',
      'Référencement naturel (SEO) de base pour Google',
      'Hébergement et mise en ligne accompagnés'
    ],
    badge: 'Pack Lancement Pro',
    icon: 'Globe',
    deliveryTime: '3 à 5 jours ouvrés'
  },
  {
    id: 'web-multipage',
    name: 'Site Web Multi-pages (Entreprise / E-commerce)',
    category: 'web',
    basePrice: 75000,
    maxPrice: 150000,
    priceDisplay: '75 000 F à 150 000 F',
    unitLabel: 'plateforme complète',
    description: 'Site web complet jusqu\'à 5 pages professionnelles avec boutique en ligne, gestion de catalogue produits, réservation en ligne et passerelles de paiement Wave/Mobile Money.',
    inclusions: [
      'Jusqu\'à 5 pages sur-mesure (Accueil, Services, À propos, Boutique, Contact)',
      'Boutique e-commerce avec panier et gestion des commandes',
      'Intégration directe des paiements Wave & Mobile Money',
      'Espace d\'administration simple pour gérer vos contenus',
      'Formation offerte à la prise en main du site'
    ],
    badge: 'Recommandé Entreprise',
    icon: 'ShoppingBag',
    deliveryTime: '7 à 14 jours ouvrés',
    recommended: true
  },
  {
    id: 'app-pwa',
    name: 'Application Mobile Web (PWA / WebView)',
    category: 'web',
    basePrice: 60000,
    maxPrice: 100000,
    priceDisplay: '60 000 F à 100 000 F',
    unitLabel: 'application installable',
    description: 'Application Android légère et moderne basée sur votre site web. Installable directement sur le téléphone de vos clients sans passer par les démarches lourdes des stores.',
    inclusions: [
      'Icône d\'application personnalisée sur l\'écran d\'accueil',
      'Accès rapide direct et fonctionnement fluide hors-ligne partiel',
      'Notifications push possibles pour vos promos',
      'Compatible 100% téléphones Android et iOS récents'
    ],
    icon: 'Smartphone',
    deliveryTime: '5 à 7 jours ouvrés'
  },
  {
    id: 'app-sur-mesure',
    name: 'Application Sur-Mesure (Projet complexe)',
    category: 'web',
    basePrice: 150000,
    priceDisplay: 'Sur Devis (À partir de 150 000 F)',
    unitLabel: 'développement sur-mesure',
    description: 'Développement d\'outils informatiques dédiés : automatisation de tâches répétitives, gestion de stocks, portail client, base de données sécurisée ou logiciel métier.',
    inclusions: [
      'Cahier des charges personnalisé et analyse des flux de travail',
      'Architecture sécurisée avec base de données robuste',
      'Tableaux de bord d\'analyse et exports de rapports',
      'Maintenance et support technique inclus (1er mois)'
    ],
    badge: 'Grand Compte & PME',
    icon: 'Cpu',
    deliveryTime: 'Sur étude du cahier des charges'
  },

  // 6. E-SERVICES ADMINISTRATIFS & JUSTICE EN LIGNE
  {
    id: 'certificat-nationalite',
    name: 'Demande de Certificat de Nationalité Ivoirienne en Ligne',
    category: 'administratif',
    basePrice: 3500,
    priceDisplay: '3 500 F',
    unitLabel: 'par certificat',
    targetAudience: 'Personne de nationalité ivoirienne née de parents ivoiriens (père ou mère)',
    description: 'Assistance, constitution et traitement dématérialisé de votre demande officielle de Certificat de Nationalité Ivoirienne auprès de la juridiction compétente. Paiement requis pour enregistrement : vous recevez immédiatement votre reçu officiel de demande & transaction, et le retrait du document authentifié s\'effectue 3 jours (72h) après la demande.',
    promoNote: '⚖️ Procédure Légale : Reçu officiel immédiat dès paiement • Retrait du document physique 3 jours (72h) après la demande au tribunal.',
    isAdministrative: true,
    administrativeTimeline: {
      receiptDelay: 'Immédiat dès la confirmation du paiement',
      documentDelay: '3 jours (72h ouvrées) après la soumission au tribunal',
      paymentRequirement: 'Paiement requis à l\'enregistrement pour acquitter les timbres fiscaux officiels'
    },
    requiredDocuments: [
      'Extrait d\'acte de naissance ou copie intégrale du demandeur (de préférence récent)',
      'Photocopie de la CNI / Passeport / Attestation d\'identité du demandeur (si majeur)',
      'Certificat de nationalité ivoirienne du père OU de la mère (ou copie CNI / acte de naissance du parent ivoirien)',
      'Une (1) photo d\'identité couleur récente sur fond blanc net',
      'Justificatif de résidence / domicile actuel'
    ],
    inclusions: [
      'Paiement préalable des timbres fiscaux et droits de greffe officiels',
      'Émission & transmission IMMÉDIATE du Reçu officiel de demande et de transaction',
      'Saisie et soumission officielle auprès du tribunal territorialement compétent',
      'Suivi régulier du dossier jusqu\'à signature par le magistrat',
      'Retrait au greffe à J+3 (72h) & Envoi du scan HD + mise à disposition de l\'original'
    ],
    badge: '⚖️ 72h Tribunal • Reçu Immédiat',
    icon: 'ShieldCheck',
    deliveryTime: '72h strictes (3 jours) • Reçu immédiat dès paiement',
    recommended: true
  },
  {
    id: 'casier-judiciaire',
    name: 'Demande d\'Extrait de Casier Judiciaire (Bulletin N°3) en Ligne',
    category: 'administratif',
    basePrice: 3500,
    priceDisplay: '3 500 F',
    unitLabel: 'par extrait',
    targetAudience: 'Personne de nationalité ivoirienne et de parents ivoiriens',
    description: 'Traitement officiel de votre demande d\'extrait de casier judiciaire (Bulletin N°3) auprès du greffe du tribunal de votre lieu de naissance. Le paiement est requis pour engager la demande et acheter les timbres fiscaux : vous recevez immédiatement votre reçu de demande & transaction, et le retrait du casier judiciaire physique s\'effectue 3 jours (72h) après la demande.',
    promoNote: '⚖️ Procédure Légale : Reçu officiel immédiat dès paiement • Retrait du casier judiciaire 3 jours (72h) après la demande au tribunal.',
    isAdministrative: true,
    administrativeTimeline: {
      receiptDelay: 'Immédiat dès la confirmation du paiement',
      documentDelay: '3 jours (72h ouvrées) après enregistrement au greffe',
      paymentRequirement: 'Paiement requis à l\'enregistrement pour acquitter les droits de chancellerie & timbres'
    },
    requiredDocuments: [
      'Extrait d\'acte de naissance ou copie d\'acte d\'état civil conforme',
      'Photocopie recto/verso de la Carte Nationale d\'Identité (CNI) ou du Passeport valide',
      'Certificat de nationalité ivoirienne (si requis selon la juridiction de naissance)',
      'Précision exacte du lieu, de la date de naissance et de la juridiction compétente'
    ],
    inclusions: [
      'Paiement des droits de chancellerie et timbres fiscaux officiels au greffe',
      'Transmission IMMÉDIATE du Reçu officiel de demande et de transaction de paiement',
      'Dépôt physique et enregistrement légal au greffe du tribunal compétent',
      'Retrait officiel du document par notre service d\'assistance 3 jours (72h) après la demande',
      'Transmission express de la version numérisée HD certifiée + original papier'
    ],
    badge: '⚖️ 72h Tribunal • Reçu Immédiat',
    icon: 'FileCheck2',
    deliveryTime: '72h strictes (3 jours) • Reçu immédiat dès paiement',
    recommended: true
  },
  {
    id: 'pack-nationalite-casier',
    name: 'Pack Duo : Nationalité Ivoirienne + Casier Judiciaire',
    category: 'administratif',
    basePrice: 6500,
    priceDisplay: '6 500 F',
    unitLabel: 'pack 2 documents',
    targetAudience: 'Candidats aux concours (ENA, CAFOP, Police, Douanes...) et demandeurs d\'emploi ivoiriens',
    description: 'Formule combinée économique regroupant le Certificat de Nationalité et le Casier Judiciaire (Bulletin N°3). Le règlement préalable permet l\'achat simultané des timbres fiscaux : vous recevez immédiatement votre reçu de demande & transaction, et le retrait des 2 documents originaux s\'effectue sous 72h (3 jours ouvrés) au greffe.',
    promoNote: '👉 Économisez 500 F (6 500 F au lieu de 7 000 F) • Reçu immédiat dès paiement • Retrait sous 72h (3 jours).',
    isAdministrative: true,
    administrativeTimeline: {
      receiptDelay: 'Immédiat dès la confirmation du paiement',
      documentDelay: '3 jours (72h ouvrées) après enregistrement simultané',
      paymentRequirement: 'Paiement requis à l\'enregistrement pour acquitter les timbres fiscaux des 2 actes'
    },
    requiredDocuments: [
      'Extrait d\'acte de naissance ou copie intégrale récente',
      'Photocopie de la CNI / Passeport en cours de validité',
      'Pièce d\'identité ou Certificat de nationalité du père ou de la mère',
      'Deux (2) photos d\'identité récentes sur fond blanc'
    ],
    inclusions: [
      'Prise en charge intégrale des deux démarches administratives simultanément',
      'Paiement groupé des timbres fiscaux et droits de greffe',
      'Transmission IMMÉDIATE du Reçu officiel de demande et transaction pour chaque acte',
      'Contrôle anti-rejet spécial dossiers de concours d\'État',
      'Retrait au tribunal à J+3 (72h) & Expédition groupée des 2 scans HD + originaux'
    ],
    badge: 'Pack Économique 72h',
    icon: 'Layers',
    deliveryTime: '72h strictes (3 jours) • Reçu immédiat dès paiement',
    recommended: true
  },

  // 7. INSCRIPTIONS EN LIGNE SCOLAIRES (6ème à Terminale)
  {
    id: 'inscription-privee',
    name: 'Inscription en Ligne - Établissement Privé & Semi-Privé',
    category: 'scolaire',
    basePrice: 3500,
    priceDisplay: '3 500 F',
    unitLabel: 'par élève',
    targetAudience: 'Élèves du secteur privé et semi-privé (Tout niveau de la 6ème à la Terminale)',
    description: 'Prise en charge complète de l\'inscription en ligne pour tout niveau du secondaire (de la 6ème à la Tle) dans les établissements privés et semi-privés : création de compte de scolarité, saisie des formulaires officiels, téléversement des pièces justificatives et validation de la fiche d\'inscription.',
    promoNote: '👉 Tarif fixe : 3 500 F pour tout niveau (6ème à Tle) en privé et semi-privé.',
    inclusions: [
      'Création et sécurisation du compte élève (6ème à Tle)',
      'Renseignement scrupuleux de la fiche d\'inscription officielle',
      'Numérisation et cadrage des pièces jointes (bulletins, extraits, photos)',
      'Édition et transmission de la fiche d\'inscription validée en PDF HD',
      'Assistance WhatsApp continue pour le suivi du dossier'
    ],
    badge: 'Rentrée Sérénité',
    icon: 'GraduationCap',
    deliveryTime: '2h à 12h max',
    recommended: true
  },
  {
    id: 'inscription-publique',
    name: 'Inscription en Ligne - Établissement Public & MENA',
    category: 'scolaire',
    basePrice: 6500,
    priceDisplay: '6 500 F',
    unitLabel: 'par élève',
    targetAudience: 'Élèves des établissements publics (Tout niveau de la 6ème à la Terminale - Inscription MENA)',
    description: 'Traitement officiel de votre inscription en ligne pour les établissements publics (MENA) de la 6ème à la Terminale. Intègre le paiement des droits obligatoires d\'État, la vérification du matricule MENA et l\'édition du reçu officiel d\'inscription.',
    promoNote: '👉 Tarif officiel : 6 500 F pour tout niveau (6ème à Tle) en établissement public avec reçu officiel garanti.',
    inclusions: [
      'Vérification et déblocage du matricule officiel MENA',
      'Paiement dématérialisé sécurisé des frais d\'inscription d\'État',
      'Génération & transmission immédiate du reçu officiel d\'inscription avec QR Code',
      'Contrôle anti-erreur d\'affectation ou d\'établissement',
      'Archivage numérique du reçu et envoi sur votre WhatsApp'
    ],
    badge: 'Officiel Public',
    icon: 'School',
    deliveryTime: '2h à 24h max',
    recommended: true
  }
];
