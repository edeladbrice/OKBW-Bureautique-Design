export type ServiceCategory = 
  | 'all'
  | 'bureautique'
  | 'design'
  | 'optimisation'
  | 'pdf'
  | 'web'
  | 'administratif';

export interface PricingTier {
  minQty: number;
  maxQty?: number;
  unitPrice: number;
  label: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'bureautique' | 'design' | 'optimisation' | 'pdf' | 'web' | 'administratif';
  basePrice: number;
  maxPrice?: number;
  priceDisplay: string;
  unitLabel: string;
  description: string;
  promoNote?: string;
  targetAudience?: string;
  requiredDocuments?: string[];
  inclusions: string[];
  pricingTiers?: PricingTier[];
  volumeRulesDescription?: string;
  badge?: string;
  icon: string;
  deliveryTime: string;
  recommended?: boolean;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
}

export interface TurnaroundOption {
  id: string;
  label: string;
  hoursDetail: string;
  badge: string;
  description: string;
  priceModifierPercent?: number;
  recommended?: boolean;
}

export interface CartItem {
  service: ServiceItem;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customNotes?: string;
  fileName?: string;
  files?: UploadedFile[];
  selectedOption?: string;
  selectedTurnaroundId?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'design' | 'bureautique' | 'pdf' | 'web';
  categoryLabel: string;
  client: string;
  description: string;
  image: string;
  beforeImage?: string;
  afterImage?: string;
  tags: string[];
  deliverables: string[];
  highlight: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  service: string;
  rating: number;
  comment: string;
  date: string;
  avatarColor: string;
}

export interface ContactInfo {
  whatsappNumber: string;
  whatsappUrl: string;
  wavePaymentUrl: string;
  email: string;
  location: string;
  hours: string;
}
