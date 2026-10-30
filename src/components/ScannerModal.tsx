import React, { useEffect, useState, useRef } from 'react';
import { X, Camera, Barcode, CheckCircle2, AlertCircle, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { Language, translations } from '../utils/i18n';
import { parseFSSAILicense } from '../utils/fssaiValidator';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBarcodeDetected: (barcode: string) => void;
  onFssaiEntered: (licenseNumber: string) => void;
  lang: Language;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  onBarcodeDetected,
  onFssaiEntered,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'manual' | 'presets'>('presets');
  const [manualInput, setManualInput] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const t = translations[lang];

  // Stop camera when modal closes or changes tab
  useEffect(() => {
    if (!isOpen || activeTab !== 'camera') {
      stopCameraScanner();
    } else if (isOpen && activeTab === 'camera') {
      startCameraScanner();
    }

    return () => {
      stopCameraScanner();
    };
  }, [isOpen, activeTab]);

  const startCameraScanner = async () => {
    setCameraError(null);
    setIsScanning(true);

    try {
      // Ensure element exists
      const qrRegion = document.getElementById('qr-camera-stream');
      if (!qrRegion) return;

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('qr-camera-stream');
      }

      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleSuccessfulScan(decodedText);
        },
        () => {
          // Frame scan error (normal during frame stream)
        }
      );
    } catch (err: any) {
      console.warn('Camera scan initialization failed:', err);
      setCameraError(
        'Camera access not available or blocked in this browser frame. You can use Quick Test Presets or enter barcode manually below.'
      );
      setIsScanning(false);
    }
  };

  const stopCameraScanner = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
      } catch (e) {
        // Ignore stop error
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleSuccessfulScan = (code: string) => {
    stopCameraScanner();
    const clean = code.trim();
    if (clean.length === 14 && /^\d+$/.test(clean)) {
      onFssaiEntered(clean);
    } else {
      onBarcodeDetected(clean);
    }
    onClose();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = manualInput.trim().replace(/[^0-9]/g, '');
    if (!clean) return;

    if (clean.length === 14) {
      onFssaiEntered(clean);
      onClose();
    } else {
      onBarcodeDetected(clean);
      onClose();
    }
  };

  if (!isOpen) return null;

  const samplePresets = [
    {
      name: 'Amul Taaza Milk (1L)',
      brand: 'Amul',
      barcode: '8901262010052',
      fssai: '10012021000071',
      trust: 'High Trust (Score 90)',
      badgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      name: 'MDH Deggi Mirch (100g)',
      brand: 'MDH',
      barcode: '8901972000216',
      fssai: '10017042003195',
      trust: 'Medium Trust (Score 60)',
      badgeClass: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      name: 'Dabur 100% Pure Honey',
      brand: 'Dabur',
      barcode: '8901207010178',
      fssai: '10012011000088',
      trust: 'High Trust (Score 90)',
      badgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      name: 'Patanjali Pure Honey',
      brand: 'Patanjali',
      barcode: '8904109400277',
      fssai: '10014011001559',
      trust: 'Low Trust (Score 45)',
      badgeClass: 'text-orange-700 bg-orange-50 border-orange-200',
    },
    {
      name: 'Fortune Sunlite Sunflower Oil',
      brand: 'Fortune',
      barcode: '8906007280018',
      fssai: '10012011000120',
      trust: 'High Trust (Score 80)',
      badgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      name: 'Shree Ganesh Ghee (SUSPENDED)',
      brand: 'Ganesh Pure Dairy',
      barcode: '8909876543210',
      fssai: '11518018000342',
      trust: 'Very Low Trust (Score 25 - RECALLED)',
      badgeClass: 'text-rose-700 bg-rose-50 border-rose-200 font-bold',
    },
    {
      name: 'BakeWell Cookies (EXPIRED LIC)',
      brand: 'BakeWell LLP',
      barcode: '8907766554433',
      fssai: '10013022001511',
      trust: 'Low Trust (Score 40 - EXPIRED)',
      badgeClass: 'text-rose-700 bg-rose-50 border-rose-200',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{t.scanBarcode}</h3>
              <p className="text-xs text-slate-500">Scan product EAN-13, QR Code or select a test sample</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 px-6 pt-3 gap-2 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'presets'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Test Presets</span>
          </button>
          <button
            onClick={() => setActiveTab('camera')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'camera'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera Scan</span>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'manual'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Barcode className="w-3.5 h-3.5" />
            <span>Manual Entry</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 mb-2">
                Select an authentic Indian packaged food barcode to test instant regulatory verification:
              </p>
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {samplePresets.map((preset) => (
                  <button
                    key={preset.barcode}
                    onClick={() => handleSuccessfulScan(preset.barcode)}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                        {preset.name}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 font-mono">
                        <span>Barcode: {preset.barcode}</span>
                        <span>·</span>
                        <span>FSSAI: {preset.fssai}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${preset.badgeClass}`}>
                        {preset.trust}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'camera' && (
            <div className="space-y-4">
              <div className="relative w-full aspect-4/3 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center">
                <div id="qr-camera-stream" className="w-full h-full object-cover"></div>
                {/* Aiming Reticle */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-56 h-56 border-2 border-emerald-400/80 rounded-2xl relative shadow-lg">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-400"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-400"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-400"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-400"></div>
                    <div className="absolute inset-x-2 top-1/2 h-0.5 bg-emerald-400/80 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {cameraError ? (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Camera Access Note</p>
                    <p className="mt-0.5">{cameraError}</p>
                    <button
                      onClick={() => setActiveTab('presets')}
                      className="mt-2 text-xs font-bold text-amber-900 underline"
                    >
                      Use Demo Presets Instead →
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-center text-xs text-slate-500">
                  Align product barcode or QR code within the highlighted frame
                </p>
              )}
            </div>
          )}

          {activeTab === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enter Barcode (EAN-13) or 14-Digit FSSAI License Number
                </label>
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="e.g. 8901262010052 or 10012021000071"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-hidden"
                  autoFocus
                />
                <p className="text-[11px] text-slate-500 mt-1.5">
                  14 numeric digits will be verified against the official FSSAI central database.
                </p>
              </div>

              {manualInput.replace(/[^0-9]/g, '').length === 14 && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                  <div className="font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Valid 14-digit FSSAI format detected
                  </div>
                  <div className="mt-1 font-mono text-[11px]">
                    {parseFSSAILicense(manualInput).stateName} · Enrolment:{' '}
                    {parseFSSAILicense(manualInput).yearOfEnrolment}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!manualInput.trim()}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs rounded-xl transition-all shadow-xs"
              >
                Lookup Regulatory Record
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
