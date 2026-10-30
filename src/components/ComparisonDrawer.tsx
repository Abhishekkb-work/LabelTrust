import React from 'react';
import { X, ShieldCheck, AlertTriangle, ArrowRight, Trash2, CheckCircle2, ExternalLink } from 'lucide-react';
import { Product, FSSAILicense, CommunityFeedback } from '../types';
import { calculateTrustScore } from '../utils/trustScore';
import { Language, translations } from '../utils/i18n';

interface ComparisonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  licenses: Record<string, FSSAILicense>;
  feedback: CommunityFeedback[];
  onRemoveProduct: (productId: string) => void;
  onSelectProduct: (productId: string) => void;
  onClearAll: () => void;
  lang: Language;
}

export const ComparisonDrawer: React.FC<ComparisonDrawerProps> = ({
  isOpen,
  onClose,
  products,
  licenses,
  feedback,
  onRemoveProduct,
  onSelectProduct,
  onClearAll,
  lang,
}) => {
  if (!isOpen) return null;
  const t = translations[lang];

  // Calculate scores for each product
  const scoredProducts = products.map((prod) => {
    const lic = licenses[prod.fssaiLicenseId] || null;
    const prodFeedback = feedback.filter((f) => f.productId === prod.id);
    const score = calculateTrustScore(lic, prodFeedback);
    return {
      product: prod,
      license: lic,
      score,
      feedbackCount: prodFeedback.length,
      goodCount: prodFeedback.filter((f) => f.experienceType === 'GOOD').length,
    };
  });

  // Find highest and lowest score
  const highestScore = Math.max(...scoredProducts.map((p) => p.score.finalScore), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {t.compareCount} ({products.length})
              </h3>
              <p className="text-xs text-slate-500">
                Side-by-side food safety compliance and regulatory history analysis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {products.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs font-medium text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
              >
                Clear Comparison
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-x-auto overflow-y-auto flex-1">
          {products.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-500 text-sm">No products currently added for comparison.</p>
              <p className="text-slate-400 text-xs mt-1">
                Browse products or scan food packaging and tap "Add to Compare".
              </p>
            </div>
          ) : (
            <div className="min-w-[650px] space-y-6">
              {/* Product Cards Header Row */}
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))`,
                }}
              >
                {scoredProducts.map(({ product, license, score }) => {
                  const isTop = score.finalScore === highestScore && products.length > 1;

                  return (
                    <div
                      key={product.id}
                      className={`relative p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isTop
                          ? 'border-emerald-500 bg-emerald-50/20 shadow-xs'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      {/* Top Choice Badge */}
                      {isTop && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs">
                          Higher Regulatory Trust
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-2">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-xl border border-slate-100"
                        />
                        <button
                          onClick={() => onRemoveProduct(product.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-3">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          {product.brand}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 line-clamp-2 mt-0.5">
                          {product.name}
                        </h4>
                        <div className="mt-1 text-xs font-semibold text-slate-700">
                          ₹{product.typicalPrice} <span className="text-slate-400 font-normal">/ {product.packageSize}</span>
                        </div>
                      </div>

                      {/* Score Highlight Box */}
                      <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                        <div className="text-2xl font-black text-slate-900 flex items-center justify-center gap-1">
                          <span>{score.finalScore}</span>
                          <span className="text-xs font-normal text-slate-400">/ 100</span>
                        </div>
                        <div
                          className={`text-[11px] font-bold mt-0.5 ${
                            score.category === 'High Trust'
                              ? 'text-emerald-700'
                              : score.category === 'Medium Trust'
                              ? 'text-amber-700'
                              : 'text-rose-700'
                          }`}
                        >
                          {score.category}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onSelectProduct(product.id);
                          onClose();
                        }}
                        className="mt-3 w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
                      >
                        View Full Details →
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Side-by-side Specs Matrix */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200 text-xs">
                {/* Row: FSSAI License */}
                <div
                  className="grid bg-slate-50/80 p-3 items-center"
                  style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))` }}
                >
                  {scoredProducts.map(({ product, license }) => (
                    <div key={product.id} className="pr-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        FSSAI License No.
                      </span>
                      <span className="font-mono font-bold text-slate-800 text-[11px]">
                        {product.fssaiLicenseId}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Row: Status */}
                <div
                  className="grid p-3 items-center"
                  style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))` }}
                >
                  {scoredProducts.map(({ product, license }) => (
                    <div key={product.id} className="pr-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        License Status
                      </span>
                      <span
                        className={`inline-block font-bold text-xs ${
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
                  ))}
                </div>

                {/* Row: Violations / Recalls */}
                <div
                  className="grid bg-slate-50/80 p-3 items-center"
                  style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))` }}
                >
                  {scoredProducts.map(({ product, license }) => {
                    const count = license?.violations?.length || 0;
                    return (
                      <div key={product.id} className="pr-3">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                          Official Violations / Notices
                        </span>
                        {count === 0 ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> 0 (Clean record)
                          </span>
                        ) : (
                          <span className="text-rose-700 font-semibold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> {count} notice(s) on file
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Row: Manufacturer & State */}
                <div
                  className="grid p-3 items-center"
                  style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))` }}
                >
                  {scoredProducts.map(({ product, license }) => (
                    <div key={product.id} className="pr-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        Manufacturer
                      </span>
                      <p className="text-slate-800 text-[11px] font-medium line-clamp-2">
                        {license?.companyName || 'Not Registered'}
                      </p>
                      <p className="text-slate-500 text-[10px]">{license?.state || 'Unknown'}</p>
                    </div>
                  ))}
                </div>

                {/* Row: Community Feedback */}
                <div
                  className="grid bg-slate-50/80 p-3 items-center"
                  style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))` }}
                >
                  {scoredProducts.map(({ product, feedbackCount, goodCount }) => (
                    <div key={product.id} className="pr-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        Community Satisfaction
                      </span>
                      <p className="text-slate-800 font-semibold">
                        {feedbackCount > 0 ? `${goodCount} of ${feedbackCount} Positive` : 'No reviews yet'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation Note */}
              <div className="p-4 bg-slate-100 rounded-xl text-xs text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 block">Trust Comparative Insight:</span>
                <p>
                  Products with higher trust scores indicate consistent regulatory compliance, active licenses in FoSCoS, and lower community-reported safety issues. Always inspect the physical packaging seal before consumption.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
