import React, { useState } from 'react';
import {
  Barcode,
  Sparkles,
  SlidersHorizontal,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Plus,
  Check,
  Search,
  Filter,
} from 'lucide-react';
import { Product, FSSAILicense, CommunityFeedback } from '../types';
import { calculateTrustScore } from '../utils/trustScore';
import { Language, translations } from '../utils/i18n';

interface ProductCatalogProps {
  products: Product[];
  licenses: Record<string, FSSAILicense>;
  feedback: CommunityFeedback[];
  comparisonIds: string[];
  onSelectProduct: (productId: string) => void;
  onToggleCompare: (productId: string) => void;
  onOpenScanner: () => void;
  onOpenOcr: () => void;
  onOpenGuide: () => void;
  lang: Language;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  licenses,
  feedback,
  comparisonIds,
  onSelectProduct,
  onToggleCompare,
  onOpenScanner,
  onOpenOcr,
  onOpenGuide,
  lang,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [trustFilter, setTrustFilter] = useState<string>('All');

  const t = translations[lang];

  const categories = ['All', 'Dairy', 'Spices', 'Sweeteners', 'Edible Oils', 'Bakery & Biscuits', 'Packaged Staples'];

  // Score each product
  const scoredProducts = products.map((prod) => {
    const lic = licenses[prod.fssaiLicenseId] || null;
    const prodFeedback = feedback.filter((f) => f.productId === prod.id);
    const score = calculateTrustScore(lic, prodFeedback);
    return {
      product: prod,
      license: lic,
      score,
      feedbackCount: prodFeedback.length,
    };
  });

  const filteredProducts = scoredProducts.filter(({ product, score, license }) => {
    if (selectedCategory !== 'All' && product.category !== selectedCategory) {
      return false;
    }
    if (trustFilter === 'High Trust' && score.finalScore < 80) return false;
    if (trustFilter === 'Needs Review' && (score.finalScore >= 80 || score.finalScore < 50)) return false;
    if (trustFilter === 'Alerts & Suspended' && license?.status !== 'SUSPENDED' && score.finalScore >= 50) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Hero Action Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>FSSAI Public Registry & Crowdsourced Trust</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Know the safety & regulatory record of your packaged food
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Scan barcodes, photograph rear labels, or enter 14-digit FSSAI numbers to verify official licensee records, past violations, and consumer incident reports before buying.
          </p>

          {/* Quick Action CTA Buttons */}
          <div className="flex flex-wrap gap-3 pt-3">
            <button
              onClick={onOpenScanner}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 group"
            >
              <Barcode className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
              <span>{t.scanBarcode}</span>
            </button>

            <button
              onClick={onOpenOcr}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span>{t.scanPhoto}</span>
            </button>

            <button
              onClick={onOpenGuide}
              className="px-4 py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-medium text-xs rounded-xl transition-colors hidden sm:inline-flex items-center gap-1.5"
            >
              <span>{t.guideFssai}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Decorative Grid Accents */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none hidden md:block"></div>
      </div>

      {/* Filter Toolbar */}
      <div className="space-y-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Trust Status Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold text-slate-700">Filter Trust Tier:</span>
            {['All', 'High Trust', 'Needs Review', 'Alerts & Suspended'].map((status) => (
              <button
                key={status}
                onClick={() => setTrustFilter(status)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  trustFilter === status
                    ? 'bg-emerald-100 text-emerald-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <span className="text-slate-400 text-xs">
            Showing <strong>{filteredProducts.length}</strong> verified products
          </span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredProducts.map(({ product, license, score, feedbackCount }) => {
          const isComparing = comparisonIds.includes(product.id);
          const isSuspended = license?.status === 'SUSPENDED';

          return (
            <div
              key={product.id}
              className={`group bg-white rounded-2xl border transition-all hover:shadow-md flex flex-col justify-between overflow-hidden ${
                isSuspended
                  ? 'border-rose-300 ring-1 ring-rose-300'
                  : score.finalScore >= 80
                  ? 'border-slate-200 hover:border-emerald-400'
                  : 'border-slate-200 hover:border-amber-400'
              }`}
            >
              {/* Product Top Visual */}
              <div
                onClick={() => onSelectProduct(product.id)}
                className="relative cursor-pointer aspect-16/10 bg-slate-100 overflow-hidden"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Score Tag in Top Corner */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl shadow-xs border border-slate-200/80">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      score.finalScore >= 80
                        ? 'bg-emerald-500'
                        : score.finalScore >= 60
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                  ></span>
                  <span className="font-black text-slate-900 text-xs">{score.finalScore}</span>
                  <span className="text-[10px] text-slate-400">/100</span>
                </div>

                {/* Suspended Alert Banner Overlay */}
                {isSuspended && (
                  <div className="absolute bottom-0 inset-x-0 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 text-center flex items-center justify-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    <span>State FDA Suspension Issued</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div onClick={() => onSelectProduct(product.id)} className="cursor-pointer space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-bold text-slate-700 uppercase tracking-wider">
                      {product.brand}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {product.fssaiLicenseId.slice(0, 6)}...
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-600 pt-0.5">
                    <span className="font-bold text-slate-900">₹{product.typicalPrice}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-[11px] text-slate-500">{product.packageSize}</span>
                  </div>
                </div>

                {/* Score Reason & Status Snippet */}
                <div className="pt-2 border-t border-slate-100 text-[11px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">FSSAI Status:</span>
                    <span
                      className={`font-semibold ${
                        license?.status === 'ACTIVE'
                          ? 'text-emerald-700'
                          : license?.status === 'SUSPENDED'
                          ? 'text-rose-700 font-bold'
                          : 'text-amber-700'
                      }`}
                    >
                      {license?.status || 'Active'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Notices / Violations:</span>
                    <span
                      className={`font-medium ${
                        license?.violations?.length
                          ? 'text-rose-700 font-bold'
                          : 'text-slate-600'
                      }`}
                    >
                      {license?.violations?.length ? `${license.violations.length} recorded` : '0 (Clean)'}
                    </span>
                  </div>
                </div>

                {/* Card Action Row */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onSelectProduct(product.id)}
                    className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Inspect Record</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCompare(product.id);
                    }}
                    className={`p-1.5 rounded-xl border transition-all ${
                      isComparing
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                    title={isComparing ? 'Remove from compare' : 'Add to compare'}
                  >
                    {isComparing ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Educational Consumer Notice at bottom of catalog */}
      <div className="p-4 bg-slate-100/80 rounded-2xl border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Consumer Protection:</strong> LabelTrust Checker relies on the FoSCoS registry under the Food Safety & Standards Act 2006. We never declare adulteration without court/lab confirmation.
          </span>
        </div>
        <button
          onClick={onOpenGuide}
          className="text-xs font-bold text-slate-800 hover:text-emerald-700 shrink-0 underline"
        >
          Read FSSAI Guide →
        </button>
      </div>
    </div>
  );
};
