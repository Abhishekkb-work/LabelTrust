import React, { useState } from 'react';
import { X, MessageSquarePlus, ThumbsUp, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Product, FSSAILicense, FeedbackExperienceType, CommunityFeedback } from '../types';
import { Language, translations } from '../utils/i18n';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  license?: FSSAILicense | null;
  onSubmitFeedback: (feedback: CommunityFeedback) => void;
  lang: Language;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  product,
  license,
  onSubmitFeedback,
  lang,
}) => {
  const [experienceType, setExperienceType] = useState<FeedbackExperienceType>('GOOD');
  const [userName, setUserName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [purchaseLocation, setPurchaseLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = translations[lang];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !title.trim()) return;

    setIsSubmitting(true);

    const newEntry: CommunityFeedback = {
      id: `fb-user-${Date.now()}`,
      productId: product.id,
      licenseId: product.fssaiLicenseId,
      userName: userName.trim() || 'Anonymous Consumer',
      experienceType,
      title: title.trim(),
      description: description.trim(),
      batchNumber: batchNumber.trim() || undefined,
      purchaseLocation: purchaseLocation.trim() || undefined,
      dateReported: new Date().toISOString().split('T')[0],
      helpfulCount: 1,
      verifiedPurchase: true,
    };

    setTimeout(() => {
      onSubmitFeedback(newEntry);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{t.reportExperience}</h3>
              <p className="text-xs text-slate-500">Contribute your consumer food experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Target Product Summary */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-10 h-10 object-cover rounded-lg border border-slate-100"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-xs text-slate-900 truncate">{product.name}</h4>
              <p className="text-[11px] text-slate-500 font-mono">FSSAI: {product.fssaiLicenseId}</p>
            </div>
          </div>

          {/* Experience Type Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              What type of experience are you reporting?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setExperienceType('GOOD')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  experienceType === 'GOOD'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <ThumbsUp className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
                <span className="text-[11px] block">Good / Fresh</span>
              </button>
              <button
                type="button"
                onClick={() => setExperienceType('MINOR_ISSUE')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  experienceType === 'MINOR_ISSUE'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <AlertTriangle className="w-4 h-4 mx-auto text-amber-600 mb-1" />
                <span className="text-[11px] block">Minor Issue</span>
              </button>
              <button
                type="button"
                onClick={() => setExperienceType('SERIOUS_ISSUE')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  experienceType === 'SERIOUS_ISSUE'
                    ? 'border-rose-500 bg-rose-50 text-rose-900 font-bold ring-2 ring-rose-500/20'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <ShieldAlert className="w-4 h-4 mx-auto text-rose-600 mb-1" />
                <span className="text-[11px] block">Serious Concern</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Summary Headline <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Seal was intact, fresh milk taste / Loose cap noticed"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:border-emerald-500 outline-hidden"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you observed (taste, smell, packaging, foreign matter, date mismatch)..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:border-emerald-500 outline-hidden"
            />
          </div>

          {/* Batch & Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Batch Number (Optional)
              </label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="e.g. B-2408"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:bg-white focus:border-emerald-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Store / City (Optional)
              </label>
              <input
                type="text"
                value={purchaseLocation}
                onChange={(e) => setPurchaseLocation(e.target.value)}
                placeholder="e.g. Blinkit Delhi, DMart Pune"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:border-emerald-500 outline-hidden"
              />
            </div>
          </div>

          {/* Nickname */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Your Name or Nickname (Guest mode allowed)
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Ananya S. (defaults to Anonymous)"
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:border-emerald-500 outline-hidden"
            />
          </div>

          {/* Legal / Transparency Disclaimer */}
          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
            <span className="font-bold">Consumer Notice:</span> Community reports are public and labeled as unverified community feedback. They do not constitute official food safety adjudications or laboratory certifications.
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !description.trim()}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-semibold text-xs rounded-xl transition-all shadow-xs"
            >
              {isSubmitting ? 'Submitting & Recalculating Score...' : 'Submit Consumer Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
