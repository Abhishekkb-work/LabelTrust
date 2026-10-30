import React from 'react';
import { X, ShieldCheck, HelpCircle, ExternalLink, AlertTriangle, Building, Calendar, MapPin } from 'lucide-react';
import { Language, translations } from '../utils/i18n';

interface FssaiGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const FssaiGuideModal: React.FC<FssaiGuideModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              🇮🇳
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{t.guideFssai}</h3>
              <p className="text-xs text-slate-500">Food Safety and Standards Authority of India (FSSAI)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-slate-700 max-h-[75vh] overflow-y-auto">
          {/* Anatomy Graphic */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Anatomy of a 14-Digit FSSAI License
            </h4>
            <div className="flex flex-wrap gap-1.5 font-mono text-center text-xs mb-3">
              <div className="flex-1 min-w-[50px] p-2 bg-white rounded border border-emerald-200 shadow-2xs">
                <div className="text-emerald-700 font-bold text-base">1</div>
                <div className="text-[10px] text-slate-500 mt-1">Digit 1</div>
                <div className="text-[9px] text-slate-700 font-medium">Type (Central)</div>
              </div>
              <div className="flex-1 min-w-[50px] p-2 bg-white rounded border border-emerald-200 shadow-2xs">
                <div className="text-emerald-700 font-bold text-base">00</div>
                <div className="text-[10px] text-slate-500 mt-1">Digits 2-3</div>
                <div className="text-[9px] text-slate-700 font-medium">State Code</div>
              </div>
              <div className="flex-1 min-w-[50px] p-2 bg-white rounded border border-emerald-200 shadow-2xs">
                <div className="text-emerald-700 font-bold text-base">12</div>
                <div className="text-[10px] text-slate-500 mt-1">Digits 4-5</div>
                <div className="text-[9px] text-slate-700 font-medium">Enrolment Yr (2012)</div>
              </div>
              <div className="flex-1 min-w-[50px] p-2 bg-white rounded border border-emerald-200 shadow-2xs">
                <div className="text-emerald-700 font-bold text-base">021</div>
                <div className="text-[10px] text-slate-500 mt-1">Digits 6-8</div>
                <div className="text-[9px] text-slate-700 font-medium">Quantity Code</div>
              </div>
              <div className="flex-1 min-w-[70px] p-2 bg-white rounded border border-emerald-200 shadow-2xs">
                <div className="text-emerald-700 font-bold text-base">000071</div>
                <div className="text-[10px] text-slate-500 mt-1">Digits 9-14</div>
                <div className="text-[9px] text-slate-700 font-medium">Manufacturer ID</div>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              Under FSS (Licensing and Registration of Food Businesses) Regulations, every food manufacturer, repacker, and marketer must print this 14-digit number alongside the official FSSAI logo.
            </p>
          </div>

          {/* Key Facts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1.5">
                <Building className="w-4 h-4 text-emerald-600" /> Central vs State License
              </div>
              <p className="text-slate-600">
                Large manufacturers, dairy plants handling &gt; 50,000 litres/day, and inter-state importers receive <strong>Central Licenses (Digit 1 = '1')</strong>. Regional bakeries or small oil mills hold <strong>State Licenses (Digit 1 = '2')</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1.5">
                <Calendar className="w-4 h-4 text-amber-600" /> License Validity & Renewal
              </div>
              <p className="text-slate-600">
                Licenses are granted for 1 to 5 years. Operating on an expired license is a punishable offense under Section 58 of the Food Safety & Standards Act 2006.
              </p>
            </div>
          </div>

          {/* Logos to look for */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5">
              Official Quality Marks on Indian Food
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-150">
                <span className="font-mono font-bold text-emerald-700 px-1.5 py-0.5 bg-emerald-100 rounded text-[11px]">FSSAI</span>
                <span className="text-slate-600">Mandatory food safety license mark with 14-digit code.</span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-150">
                <span className="font-mono font-bold text-amber-700 px-1.5 py-0.5 bg-amber-100 rounded text-[11px]">AGMARK</span>
                <span className="text-slate-600">Government certification mark for agricultural products (Ghee, Mustard Oil, Spices, Honey).</span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-150">
                <span className="font-mono font-bold text-blue-700 px-1.5 py-0.5 bg-blue-100 rounded text-[11px]">+F Logo</span>
                <span className="text-slate-600">Food Fortification Resource Centre mark for essential micronutrient fortification (Vit A, D, Iron, Iodine).</span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-150">
                <span className="font-mono font-bold text-green-700 px-1.5 py-0.5 bg-green-100 rounded text-[11px]">Jaivik Bharat</span>
                <span className="text-slate-600">Official green leaf logo verifying certified organic food under FSSAI Organic Food Regulations.</span>
              </div>
            </div>
          </div>

          {/* Grievance Links */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> How to Lodge a Real Adulteration Complaint
            </div>
            <p className="text-amber-800">
              If you suspect food adulteration, chemical contamination, or misleading labels, submit an official grievance to the Government of India:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="https://foscos.fssai.gov.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-slate-800 font-medium rounded-lg border border-amber-300 hover:bg-amber-100 transition-colors"
              >
                FoSCoS Portal <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
              <a
                href="https://foodlicensing.fssai.gov.in/cmsweb/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-slate-800 font-medium rounded-lg border border-amber-300 hover:bg-amber-100 transition-colors"
              >
                FSSAI Food Safety Connect <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-slate-800 font-mono font-medium rounded-lg border border-amber-300">
                Toll Free: 1800-112-100
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
