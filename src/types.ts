export type LicenseStatus = 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'CANCELLED' | 'UNKNOWN';

export type ViolationSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ViolationType = 'RECALL' | 'FINE' | 'WARNING' | 'SUSPENSION' | 'ADJUDICATION_ORDER';

export interface Violation {
  id: string;
  licenseId: string;
  type: ViolationType;
  severity: ViolationSeverity;
  title: string;
  description: string;
  date: string;
  orderNumber: string;
  authority: string;
  sourceUrl?: string;
}

export interface FSSAILicense {
  id: string; // 14-digit license number
  status: LicenseStatus;
  companyName: string;
  brandNames: string[];
  registeredAddress: string;
  state: string;
  category: string;
  licenseType: 'Central' | 'State';
  issuedDate: string;
  validUntil: string;
  inspectionsCompleted: number;
  violations: Violation[];
  sourceUrl: string;
  isVerifiedOfficial: boolean;
}

export type FeedbackExperienceType = 'GOOD' | 'MINOR_ISSUE' | 'SERIOUS_ISSUE';

export interface CommunityFeedback {
  id: string;
  productId: string;
  licenseId?: string;
  userName: string;
  isAnonymous?: boolean;
  experienceType: FeedbackExperienceType;
  title: string;
  description: string;
  batchNumber?: string;
  purchaseLocation?: string;
  dateReported: string;
  helpfulCount: number;
  verifiedPurchase?: boolean;
  hasPhoto?: boolean;
}

export interface TrustScoreBreakdown {
  baseScore: number;
  licenseStatusAdjustment: number;
  licenseStatusReason: string;
  violationsAdjustment: number;
  violationsReason: string;
  communityAdjustment: number;
  communityReason: string;
  recencyFactorAdjustment: number;
  finalScore: number;
  category: 'High Trust' | 'Medium Trust' | 'Low Trust' | 'Very Low Trust' | 'Insufficient Data';
  colorCode: string; // 'emerald' | 'amber' | 'orange' | 'rose' | 'slate'
}

export interface Product {
  id: string;
  barcode: string; // EAN-13 / GTIN
  name: string;
  hindiName?: string;
  brand: string;
  category: string;
  fssaiLicenseId: string;
  packageSize: string;
  typicalPrice: number; // in INR ₹
  imageUrl: string;
  ingredients: string[];
  nutritionalHighlights?: {
    calories?: string;
    protein?: string;
    fat?: string;
    sugar?: string;
    sodium?: string;
  };
  certifications?: string[]; // e.g., 'AGMARK', 'Jaivik Bharat', 'ISO 22000'
  packagingClaims?: string[]; // e.g., '100% Pure', 'No Added Preservatives'
  riskNotes?: string;
}

export interface OcrExtractionResult {
  fssaiNumber?: string;
  brandName?: string;
  productName?: string;
  batchNo?: string;
  mfgDate?: string;
  bestBefore?: string;
  ingredients?: string[];
  claims?: string[];
  rawText?: string;
  confidence: number;
  warnings?: string[];
}
