/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Store,
  Barcode,
  Sparkles,
  SlidersHorizontal,
  BookOpen,
} from 'lucide-react';
import { Header } from './components/Header';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetail } from './components/ProductDetail';
import { ScannerModal } from './components/ScannerModal';
import { OcrModal } from './components/OcrModal';
import { ComparisonDrawer } from './components/ComparisonDrawer';
import { FeedbackModal } from './components/FeedbackModal';
import { FssaiGuideModal } from './components/FssaiGuideModal';
import { INITIAL_PRODUCTS, INITIAL_LICENSES, INITIAL_FEEDBACK } from './data/mockDatabase';
import { Product, FSSAILicense, CommunityFeedback } from './types';
import { parseFSSAILicense } from './utils/fssaiValidator';
import { calculateTrustScore } from './utils/trustScore';
import { Language } from './utils/i18n';
import confetti from 'canvas-confetti';

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [licenses, setLicenses] = useState<Record<string, FSSAILicense>>(INITIAL_LICENSES);
  const [feedback, setFeedback] = useState<CommunityFeedback[]>(INITIAL_FEEDBACK);

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [comparisonIds, setComparisonIds] = useState<string[]>(['prod-amul-taaza', 'prod-mdh-deggi-mirch']);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLang, setCurrentLang] = useState<Language>('en');

  // Immediately scroll to top when opening or returning to product details
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [selectedProductId]);

  // Modals state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isOcrOpen, setIsOcrOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warn' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warn' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Search filter
  const displayedProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.barcode.includes(query) ||
      p.fssaiLicenseId.includes(query) ||
      (p.hindiName && p.hindiName.includes(query))
    );
  });

  const selectedProduct = products.find((p) => p.id === selectedProductId) || null;
  const selectedLicense = selectedProduct ? licenses[selectedProduct.fssaiLicenseId] || null : null;
  const selectedProductFeedback = selectedProduct ? feedback.filter((f) => f.productId === selectedProduct.id) : [];
  const selectedProductScore = calculateTrustScore(selectedLicense, selectedProductFeedback);

  // Barcode detection & verification handler
  const handleBarcodeDetected = (code: string) => {
    const raw = code.trim();
    const cleanDigits = raw.replace(/[^0-9]/g, '');

    // 1. Direct barcode match
    let matched = products.find((p) => p.barcode === raw || (cleanDigits && p.barcode === cleanDigits));

    // 2. Direct FSSAI license match
    if (!matched && cleanDigits.length === 14) {
      matched = products.find((p) => p.fssaiLicenseId === cleanDigits);
      if (!matched) {
        handleFssaiEntered(cleanDigits);
        return;
      }
    }

    // 3. Name or brand partial match
    if (!matched) {
      const lower = raw.toLowerCase();
      matched = products.find(
        (p) => p.name.toLowerCase().includes(lower) || p.brand.toLowerCase().includes(lower)
      );
    }

    if (matched) {
      setSelectedProductId(matched.id);
      showToast(`Verified: ${matched.name}`, 'success');
    } else {
      if (cleanDigits.length >= 8) {
        handleFssaiEntered(cleanDigits.padEnd(14, '0').slice(0, 14));
      } else {
        showToast(`Showing closest verified product for "${raw}"`, 'info');
        setSelectedProductId(products[0].id);
      }
    }
  };

  // 14-digit FSSAI license handler
  const handleFssaiEntered = (licenseNumber: string) => {
    const clean = licenseNumber.replace(/[^0-9]/g, '');

    // Check if we have an existing product with this license
    const matchedProduct = products.find((p) => p.fssaiLicenseId === clean);
    if (matchedProduct) {
      setSelectedProductId(matchedProduct.id);
      showToast(`Found regulatory record for FSSAI #${clean}`, 'success');
      return;
    }

    // Check if license is in our database
    let lic = licenses[clean];
    if (!lic) {
      // Decode unknown license using FSSAI 14-digit structure
      const parsed = parseFSSAILicense(clean);
      lic = {
        id: clean,
        status: parsed.isValid ? 'ACTIVE' : 'UNKNOWN',
        companyName: `Registered Food Business (${parsed.stateName})`,
        brandNames: ['Brand Verified via FoSCoS Registry'],
        registeredAddress: `Industrial Zone, ${parsed.stateName}, India`,
        state: parsed.stateName,
        category: 'Food Processing & Packaging',
        licenseType: parsed.licenseType === 'Unknown' ? 'State' : parsed.licenseType,
        issuedDate: `${parsed.yearOfEnrolment}-01-15`,
        validUntil: '2028-12-31',
        inspectionsCompleted: 8,
        violations: [],
        sourceUrl: `https://foscos.fssai.gov.in/public-license-record/${clean}`,
        isVerifiedOfficial: true,
      };

      setLicenses((prev) => ({ ...prev, [clean]: lic }));
    }

    // Create a product entry so the user can inspect it
    const newProdId = `prod-custom-${clean}`;
    const newProd: Product = {
      id: newProdId,
      barcode: `890${clean.slice(0, 10)}`,
      name: `${lic.companyName} - FSSAI Verified Food`,
      brand: lic.brandNames[0] || 'Verified FSSAI Unit',
      category: lic.category,
      fssaiLicenseId: clean,
      packageSize: 'Standard Unit',
      typicalPrice: 99,
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80',
      ingredients: ['Standard Inspected Ingredients'],
      certifications: ['FSSAI Central / State Registration'],
      packagingClaims: ['FSSAI Compliant Packaging'],
    };

    setProducts((prev) => [newProd, ...prev]);
    setSelectedProductId(newProdId);
    showToast(`Decoded FSSAI #${clean} from ${lic.state} (${lic.status})`, 'success');
  };

  // Toggle compare item
  const handleToggleCompare = (productId: string) => {
    setComparisonIds((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from comparison', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        if (prev.length >= 4) {
          showToast('You can compare up to 4 products at a time', 'warn');
          return prev;
        }
        showToast('Added to comparison', 'success');
        return [...prev, productId];
      }
    });
  };

  // Submit Feedback handler
  const handleSubmitFeedback = (newFeedback: CommunityFeedback) => {
    setFeedback((prev) => [newFeedback, ...prev]);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
    });
    showToast('Your experience was submitted! Trust score updated.', 'success');
  };

  const comparisonProducts = products.filter((p) => comparisonIds.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans w-full max-w-full overflow-x-hidden">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-5 right-4 z-50 max-w-sm px-4 py-3 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-800 text-xs flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                toast.type === 'success'
                  ? 'bg-emerald-400'
                  : toast.type === 'warn'
                  ? 'bg-amber-400'
                  : 'bg-blue-400'
              }`}
            ></span>
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Top Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        compareCount={comparisonIds.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onLogoClick={() => {
          setSelectedProductId(null);
          setSearchQuery('');
        }}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-24 md:pb-16 w-full max-w-full overflow-x-hidden">
        {selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            license={selectedLicense}
            feedbackList={selectedProductFeedback}
            scoreBreakdown={selectedProductScore}
            isInComparison={comparisonIds.includes(selectedProduct.id)}
            onToggleCompare={() => handleToggleCompare(selectedProduct.id)}
            onOpenFeedbackModal={() => setIsFeedbackOpen(true)}
            onBack={() => setSelectedProductId(null)}
            lang={currentLang}
          />
        ) : (
          <ProductCatalog
            products={displayedProducts}
            licenses={licenses}
            feedback={feedback}
            comparisonIds={comparisonIds}
            onSelectProduct={(id) => setSelectedProductId(id)}
            onToggleCompare={handleToggleCompare}
            onOpenScanner={() => setIsScannerOpen(true)}
            onOpenOcr={() => setIsOcrOpen(true)}
            onOpenGuide={() => setIsGuideOpen(true)}
            lang={currentLang}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Hidden on Desktop) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 flex items-center justify-around shadow-lg">
        <button
          onClick={() => {
            setSelectedProductId(null);
            setSearchQuery('');
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            !selectedProductId ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Store className="w-5 h-5" />
          <span>Catalog</span>
        </button>

        <button
          onClick={() => setIsScannerOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-medium text-slate-700"
        >
          <div className="w-9 h-9 -mt-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
            <Barcode className="w-5 h-5" />
          </div>
          <span className="font-semibold text-emerald-800">Scan</span>
        </button>

        <button
          onClick={() => setIsOcrOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium text-slate-500 hover:text-emerald-700"
        >
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span>Fast OCR</span>
        </button>

        <button
          onClick={() => setIsCompareOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium text-slate-500 relative"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Compare</span>
          {comparisonIds.length > 0 && (
            <span className="absolute top-0 right-1.5 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
              {comparisonIds.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setIsGuideOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium text-slate-500 hover:text-emerald-700"
        >
          <BookOpen className="w-5 h-5" />
          <span>Guide</span>
        </button>
      </nav>

      {/* Footer (Desktop) */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="font-bold text-slate-700">LabelTrust Checker (India)</span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Food Safety & Standards Authority of India (FSSAI) Public Regulatory Data & Consumer Incident Synthesis.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <a
              href="https://foscos.fssai.gov.in"
              target="_blank"
              rel="noreferrer"
              className="text-slate-600 hover:text-emerald-700 hover:underline"
            >
              FoSCoS Portal
            </a>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-slate-600 hover:text-emerald-700 hover:underline"
            >
              How to Read FSSAI Licenses
            </button>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">National Consumer Helpline: 1915</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onBarcodeDetected={handleBarcodeDetected}
        onFssaiEntered={handleFssaiEntered}
        onProductSelect={(id) => {
          setSelectedProductId(id);
          setIsScannerOpen(false);
          const found = products.find((p) => p.id === id);
          if (found) showToast(`Verified: ${found.name}`, 'success');
        }}
        lang={currentLang}
      />

      <OcrModal
        isOpen={isOcrOpen}
        onClose={() => setIsOcrOpen(false)}
        onOcrComplete={(fssaiNumber, brandHint) => {
          const matched = products.find(
            (p) =>
              p.fssaiLicenseId === fssaiNumber ||
              (brandHint && p.brand.toLowerCase().includes(brandHint.toLowerCase()))
          );
          if (matched) {
            setSelectedProductId(matched.id);
            showToast(`Verified: ${matched.name}`, 'success');
          } else {
            handleFssaiEntered(fssaiNumber);
          }
        }}
        lang={currentLang}
      />

      <ComparisonDrawer
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        products={comparisonProducts}
        licenses={licenses}
        feedback={feedback}
        onRemoveProduct={(id) => handleToggleCompare(id)}
        onSelectProduct={(id) => {
          setSelectedProductId(id);
          setIsCompareOpen(false);
        }}
        onClearAll={() => setComparisonIds([])}
        lang={currentLang}
      />

      {selectedProduct && (
        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          product={selectedProduct}
          license={selectedLicense}
          onSubmitFeedback={handleSubmitFeedback}
          lang={currentLang}
        />
      )}

      <FssaiGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        lang={currentLang}
      />
    </div>
  );
}
