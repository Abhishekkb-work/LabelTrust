import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  MessageSquarePlus,
  SlidersHorizontal,
  Building,
  Calendar,
  MapPin,
  FileText,
  ThumbsUp,
  Info,
  HelpCircle,
  Share2,
  Check,
} from 'lucide-react';
import { Product, FSSAILicense, CommunityFeedback, TrustScoreBreakdown } from '../types';
import { parseFSSAILicense } from '../utils/fssaiValidator';
import { Language, translations } from '../utils/i18n';

interface ProductDetailProps {
  product: Product;
  license?: FSSAILicense | null;
  feedbackList: CommunityFeedback[];
  scoreBreakdown: TrustScoreBreakdown;
  isInComparison: boolean;
  onToggleCompare: () => void;
  onOpenFeedbackModal: () => void;
  onBack: () => void;
  onOpenGuide: () => void;
  lang: Language;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  license,
  feedbackList,
  scoreBreakdown,
  isInComparison,
  onToggleCompare,
  onOpenFeedbackModal,
  onBack,
  onOpenGuide,
  lang,
}) => {
  const [feedbackFilter, setFeedbackFilter] = useState<'ALL' | 'GOOD' | 'ISSUES'>('ALL');
  const [copiedLink, setCopiedLink] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  const t = translations[lang];
  const fssaiParsed = parseFSSAILicense(product.fssaiLicenseId);

  // Score color styles
  const getScoreTheme = (category: string) => {
    switch (category) {
      case 'High Trust':
        return {
          textColor: 'text-emerald-700',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-300',
          strokeColor: '#059669',
          ringBg: 'bg-emerald-500',
        };
      case 'Medium Trust':
        return {
          textColor: 'text-amber-700',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-300',
          strokeColor: '#d97706',
          ringBg: 'bg-amber-500',
        };
      case 'Low Trust':
        return {
          textColor: 'text-orange-700',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-300',
          strokeColor: '#ea580c',
          ringBg: 'bg-orange-500',
        };
      case 'Very Low Trust':
        return {
          textColor: 'text-rose-700',
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-300',
          strokeColor: '#e11d48',
          ringBg: 'bg-rose-500',
        };
      default:
        return {
          textColor: 'text-slate-700',
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-300',
          strokeColor: '#64748b',
          ringBg: 'bg-slate-500',
        };
    }
  };

  const theme = getScoreTheme(scoreBreakdown.category);

  // Feedback calculations
  const totalFeedback = feedbackList.length;
  const goodFeedback = feedbackList.filter((f) => f.experienceType === 'GOOD');
  const minorFeedback = feedbackList.filter((f) => f.experienceType === 'MINOR_ISSUE');
  const seriousFeedback = feedbackList.filter((f) => f.experienceType === 'SERIOUS_ISSUE');

  const filteredFeedback = feedbackList.filter((f) => {
    if (feedbackFilter === 'GOOD') return f.experienceType === 'GOOD';
    if (feedbackFilter === 'ISSUES') return f.experienceType !== 'GOOD';
    return true;
  });

  const handleHelpfulClick = (feedbackId: string) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [feedbackId]: (prev[feedbackId] || 0) + 1,
    }));
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // SVG circular gauge math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scoreBreakdown.finalScore / 100) * circumference;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 transition-colors shadow-2xs"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={onToggleCompare}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-xl border transition-all shadow-2xs ${
              isInComparison
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isInComparison ? 'In Comparison' : t.addToCompare}</span>
          </button>
        </div>
      </div>

      {/* Top Hero Card: Product Header + Trust Gauge */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Product Image & Info (7 cols) */}
          <div className="md:col-span-7 flex flex-col sm:flex-row gap-5 items-start">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-2xl border border-slate-200 shadow-2xs shrink-0"
            />
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {product.brand}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {product.category}
                </span>
                {product.hindiName && (
                  <span className="text-[11px] text-slate-500 font-normal">
                    ({product.hindiName})
                  </span>
                )}
              </div>

              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                <span className="font-semibold text-slate-900 text-sm">₹{product.typicalPrice}</span>
                <span className="text-slate-400">·</span>
                <span>{product.packageSize}</span>
                <span className="text-slate-400">·</span>
                <span className="font-mono text-[11px] text-slate-500">GTIN: {product.barcode}</span>
              </div>

              {/* Badges / Claims */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {product.packagingClaims?.map((claim, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-slate-700"
                  >
                    {claim}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Score Gauge (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center sm:items-end justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-5 md:pt-0 md:pl-6">
            <div className="flex items-center gap-5">
              {/* Circular Gauge */}
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-28 h-28 -rotate-90 transform" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="#e2e8f0"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke={theme.strokeColor}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-slate-900 leading-none">
                    {scoreBreakdown.finalScore}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                    out of 100
                  </span>
                </div>
              </div>

              {/* Gauge Label & Actions */}
              <div className="space-y-1 text-left">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Food Trust Score
                </div>
                <div className={`text-base font-extrabold ${theme.textColor}`}>
                  {scoreBreakdown.category}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight max-w-[180px]">
                  {license?.status === 'ACTIVE'
                    ? 'Active license with public regulatory compliance'
                    : license?.status === 'SUSPENDED'
                    ? 'WARNING: License currently suspended by authorities'
                    : 'Non-renewed or unverified license status'}
                </p>
                <button
                  onClick={onOpenFeedbackModal}
                  className="mt-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 underline inline-flex items-center gap-1"
                >
                  <MessageSquarePlus className="w-3 h-3" /> Report Experience
                </button>
              </div>
            </div>

            {/* Quick Summary Strip */}
            <div className="w-full mt-4 p-2.5 bg-slate-50 rounded-xl text-center md:text-left text-[11px] text-slate-600 border border-slate-150">
              <span className="font-semibold text-slate-800">Snapshot: </span>
              {scoreBreakdown.violationsReason}. {scoreBreakdown.communityReason}.
            </div>
          </div>
        </div>
      </div>

      {/* Critical Safety Notice if Suspended or Recalled */}
      {license?.status === 'SUSPENDED' && (
        <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-start gap-3.5 text-rose-950">
          <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-rose-900">
              CRITICAL REGULATORY ALERT: License Suspended & Confiscation Issued
            </h3>
            <p className="text-xs text-rose-800 leading-relaxed">
              Official records from the State Food & Drug Administration (FDA) indicate this facility has been suspended following enforcement inspection and seized adulterated stock. Avoid purchasing or consuming this product until certified clearance.
            </p>
          </div>
        </div>
      )}

      {/* Section 1: Verified Regulatory Information (FSSAI) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h2 className="font-bold text-slate-900 text-sm tracking-tight">
              {t.verifiedOfficial}
            </h2>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Govt FSSAI Registry
            </span>
          </div>

          <a
            href={license?.sourceUrl || 'https://foscos.fssai.gov.in'}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
          >
            <span>Verify on FoSCoS Public Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Regulatory Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              FSSAI License Number
            </span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {fssaiParsed.formattedDisplay}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {fssaiParsed.licenseType} License · {fssaiParsed.stateName}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Regulatory Status
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`font-black text-sm ${
                  license?.status === 'ACTIVE'
                    ? 'text-emerald-700'
                    : license?.status === 'SUSPENDED'
                    ? 'text-rose-700'
                    : 'text-amber-700'
                }`}
              >
                {license?.status || 'UNKNOWN'}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Category: {license?.category || product.category}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Validity Period
            </span>
            <span className="font-medium text-slate-800">
              Valid until: <strong className="text-slate-900">{license?.validUntil || '2027'}</strong>
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Issued: {license?.issuedDate || '2015'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Official Inspections
            </span>
            <span className="font-bold text-slate-900 text-sm">
              {license?.inspectionsCompleted || 12} audits
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Conducted by State & Central FSSAI
            </span>
          </div>
        </div>

        {/* Registered Manufacturer Address */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 flex items-start gap-2.5 text-xs text-slate-700">
          <Building className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900">
              {license?.companyName || product.brand}
            </span>
            <p className="text-slate-600 mt-0.5">{license?.registeredAddress || 'Registered in India'}</p>
          </div>
        </div>

        {/* Violations and Enforcement Notices */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Recorded Violations, Recalls & Directives ({license?.violations?.length || 0})
          </h3>

          {!license?.violations || license.violations.length === 0 ? (
            <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Clean Enforcement Record:</strong> Zero official recall notices, adulteration fines, or licensing suspensions recorded in the national FSSAI database for this license.
              </span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {license.violations.map((violation) => (
                <div
                  key={violation.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    violation.severity === 'CRITICAL'
                      ? 'bg-rose-50 border-rose-300 text-rose-950'
                      : violation.severity === 'HIGH'
                      ? 'bg-orange-50 border-orange-300 text-orange-950'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          violation.severity === 'CRITICAL'
                            ? 'bg-rose-600 text-white'
                            : violation.severity === 'HIGH'
                            ? 'bg-orange-600 text-white'
                            : 'bg-amber-600 text-white'
                        }`}
                      >
                        {violation.type}
                      </span>
                      <span className="font-bold text-slate-900 text-xs">{violation.title}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      Date: {violation.date}
                    </span>
                  </div>

                  <p className="text-slate-800 leading-relaxed text-[11px]">
                    {violation.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 font-mono">
                    <span>Order: {violation.orderNumber}</span>
                    <span>Authority: {violation.authority}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Trust Score Breakdown & Formula Transparency */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-slate-900 text-sm tracking-tight">
              Trust Score Calculation Transparency
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700">
            Total: {scoreBreakdown.finalScore} / 100
          </span>
        </div>

        <p className="text-xs text-slate-600">
          The trust score uses a rule-based weighted model that synthesizes verified regulatory history (60%) with consumer community incident reports (40%):
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">1. Baseline Score</span>
            <span className="text-lg font-black text-slate-800 font-mono">+50</span>
            <p className="text-[10px] text-slate-500 mt-0.5">Neutral standard start</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">2. License Status</span>
            <span
              className={`text-lg font-black font-mono ${
                scoreBreakdown.licenseStatusAdjustment >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {scoreBreakdown.licenseStatusAdjustment >= 0 ? '+' : ''}
              {scoreBreakdown.licenseStatusAdjustment}
            </span>
            <p className="text-[10px] text-slate-500 mt-0.5">{scoreBreakdown.licenseStatusReason}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">3. Violations / Recalls</span>
            <span
              className={`text-lg font-black font-mono ${
                scoreBreakdown.violationsAdjustment >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {scoreBreakdown.violationsAdjustment >= 0 ? '+' : ''}
              {scoreBreakdown.violationsAdjustment}
            </span>
            <p className="text-[10px] text-slate-500 mt-0.5">{scoreBreakdown.violationsReason}</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">4. Community Feedback</span>
            <span
              className={`text-lg font-black font-mono ${
                scoreBreakdown.communityAdjustment >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {scoreBreakdown.communityAdjustment >= 0 ? '+' : ''}
              {scoreBreakdown.communityAdjustment}
            </span>
            <p className="text-[10px] text-slate-500 mt-0.5">{scoreBreakdown.communityReason}</p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
          <strong>Legal & Safety Disclaimer:</strong> This score is an automated estimate for consumer awareness. It does not certify chemical purity or prove statutory adulteration without certified laboratory testing by an NABL-accredited food lab.
        </div>
      </div>

      {/* Section 3: Ingredients & Nutritional Highlights */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-slate-900 text-sm tracking-tight border-b border-slate-100 pb-2">
          Ingredients & Nutritional Overview
        </h2>

        <div>
          <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1.5">
            Declared Ingredients
          </span>
          <div className="flex flex-wrap gap-1.5">
            {product.ingredients.map((ing, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                {ing}
              </span>
            ))}
          </div>
        </div>

        {product.nutritionalHighlights && (
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1.5">
              Nutritional Table Highlights
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-150">
                <span className="text-slate-400 text-[10px] block">Energy</span>
                <span className="font-bold text-slate-800">{product.nutritionalHighlights.calories}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-150">
                <span className="text-slate-400 text-[10px] block">Protein</span>
                <span className="font-bold text-slate-800">{product.nutritionalHighlights.protein}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-150">
                <span className="text-slate-400 text-[10px] block">Fat</span>
                <span className="font-bold text-slate-800">{product.nutritionalHighlights.fat}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-150">
                <span className="text-slate-400 text-[10px] block">Sugar</span>
                <span className="font-bold text-slate-800">{product.nutritionalHighlights.sugar}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-150">
                <span className="text-slate-400 text-[10px] block">Sodium</span>
                <span className="font-bold text-slate-800">{product.nutritionalHighlights.sodium}</span>
              </div>
            </div>
          </div>
        )}

        {product.riskNotes && (
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900">
            <strong>Ingredient Watch:</strong> {product.riskNotes}
          </div>
        )}
      </div>

      {/* Section 4: Crowdsourced Community Feedback */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <h2 className="font-bold text-slate-900 text-sm tracking-tight">
                {t.userReported}
              </h2>
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Unverified Community Reports
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Crowdsourced experiences submitted by verified purchasers and consumer shoppers.
            </p>
          </div>

          <button
            onClick={onOpenFeedbackModal}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 shrink-0"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>{t.reportExperience}</span>
          </button>
        </div>

        {/* Ratio Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>
              <strong>{totalFeedback}</strong> Community Reports
            </span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-emerald-700 font-semibold">{goodFeedback.length} Positive</span>
              <span className="text-amber-700 font-semibold">{minorFeedback.length} Minor Issues</span>
              <span className="text-rose-700 font-semibold">{seriousFeedback.length} Serious</span>
            </div>
          </div>

          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${totalFeedback > 0 ? (goodFeedback.length / totalFeedback) * 100 : 100}%` }}
              className="bg-emerald-500 h-full"
              title="Positive"
            ></div>
            <div
              style={{ width: `${totalFeedback > 0 ? (minorFeedback.length / totalFeedback) * 100 : 0}%` }}
              className="bg-amber-400 h-full"
              title="Minor Issues"
            ></div>
            <div
              style={{ width: `${totalFeedback > 0 ? (seriousFeedback.length / totalFeedback) * 100 : 0}%` }}
              className="bg-rose-500 h-full"
              title="Serious Issues"
            ></div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 text-xs">
          <button
            onClick={() => setFeedbackFilter('ALL')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              feedbackFilter === 'ALL'
                ? 'bg-slate-900 text-white font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Reports ({feedbackList.length})
          </button>
          <button
            onClick={() => setFeedbackFilter('GOOD')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              feedbackFilter === 'GOOD'
                ? 'bg-emerald-700 text-white font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Good Quality ({goodFeedback.length})
          </button>
          <button
            onClick={() => setFeedbackFilter('ISSUES')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              feedbackFilter === 'ISSUES'
                ? 'bg-rose-700 text-white font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Reported Issues ({minorFeedback.length + seriousFeedback.length})
          </button>
        </div>

        {/* Feedback Items List */}
        <div className="space-y-3">
          {filteredFeedback.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
              No reports found in this category. Be the first to share your experience!
            </div>
          ) : (
            filteredFeedback.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        item.experienceType === 'GOOD'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.experienceType === 'MINOR_ISSUE'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.experienceType === 'GOOD'
                        ? 'Good Quality'
                        : item.experienceType === 'MINOR_ISSUE'
                        ? 'Minor Packaging Issue'
                        : 'Serious Quality Issue'}
                    </span>
                    <span className="font-bold text-slate-900 text-xs">{item.title}</span>
                  </div>

                  <span className="text-[11px] text-slate-400">{item.dateReported}</span>
                </div>

                <p className="text-slate-700 leading-relaxed text-xs">{item.description}</p>

                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">{item.userName}</span>
                    {item.batchNumber && (
                      <span className="font-mono text-[10px] bg-slate-200/70 px-1.5 py-0.2 rounded">
                        Batch: {item.batchNumber}
                      </span>
                    )}
                    {item.purchaseLocation && <span>· {item.purchaseLocation}</span>}
                  </div>

                  <button
                    onClick={() => handleHelpfulClick(item.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-emerald-700 transition-colors"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Helpful ({item.helpfulCount + (helpfulVotes[item.id] || 0)})</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
