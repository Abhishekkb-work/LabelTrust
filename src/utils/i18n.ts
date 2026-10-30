export type Language = 'en' | 'hi' | 'kn';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  scanBarcode: string;
  scanPhoto: string;
  searchPlaceholder: string;
  trustScore: string;
  verifiedOfficial: string;
  userReported: string;
  addToCompare: string;
  removeFromCompare: string;
  compareCount: string;
  reportExperience: string;
  disclaimer: string;
  licenseStatus: string;
  violationsCount: string;
  manufacturer: string;
  highTrust: string;
  mediumTrust: string;
  lowTrust: string;
  veryLowTrust: string;
  insufficientData: string;
  guideFssai: string;
  cleanRecord: string;
  recallsNotices: string;
  quickTestSamples: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appTitle: 'LabelTrust Checker',
    appSubtitle: 'FSSAI Food Safety Trust Score & Label Verification',
    scanBarcode: 'Scan Barcode / QR',
    scanPhoto: 'Label Photo & AI OCR',
    searchPlaceholder: 'Search by Product, Brand, or 14-digit FSSAI No...',
    trustScore: 'Trust Score',
    verifiedOfficial: 'Official Regulatory Record (FSSAI)',
    userReported: 'Crowdsourced Community Report (Unverified)',
    addToCompare: 'Add to Compare',
    removeFromCompare: 'Remove',
    compareCount: 'Compare Products',
    reportExperience: 'Report My Experience',
    disclaimer: 'This prototype estimates safety risk using public FSSAI regulatory data and unverified community reports. It does not certify adulteration or chemical purity without certified lab testing.',
    licenseStatus: 'License Status',
    violationsCount: 'Violations / Recalls',
    manufacturer: 'Registered Manufacturer',
    highTrust: 'High Trust',
    mediumTrust: 'Medium Trust',
    lowTrust: 'Low Trust',
    veryLowTrust: 'Very Low Trust',
    insufficientData: 'Insufficient Data',
    guideFssai: 'How to Read 14-Digit FSSAI License',
    cleanRecord: 'No Recorded Violations',
    recallsNotices: 'Official Regulatory Notices',
    quickTestSamples: 'Quick Test Demo Samples',
  },
  hi: {
    appTitle: 'लेबलट्रस्ट चेकर',
    appSubtitle: 'FSSAI खाद्य सुरक्षा ट्रस्ट स्कोर एवं लेबल जांच',
    scanBarcode: 'बारकोड / QR स्कैन करें',
    scanPhoto: 'लेबल फोटो और AI OCR',
    searchPlaceholder: 'उत्पाद, ब्रांड या 14-अंकीय FSSAI नंबर खोजें...',
    trustScore: 'ट्रस्ट स्कोर',
    verifiedOfficial: 'आधिकारिक नियामक रिकॉर्ड (FSSAI)',
    userReported: 'उपभोक्ता समुदाय रिपोर्ट (असत्यापित)',
    addToCompare: 'तुलना में जोड़ें',
    removeFromCompare: 'हटाएं',
    compareCount: 'उत्पाद तुलना',
    reportExperience: 'अपना अनुभव दर्ज करें',
    disclaimer: 'यह प्रोटोटाइप सार्वजनिक FSSAI डेटा और उपभोक्ता रिपोर्टों पर आधारित अनुमान है। यह प्रयोगशाला परीक्षण के बिना मिलावट की पुष्टि नहीं करता।',
    licenseStatus: 'लाइसेंस स्थिति',
    violationsCount: 'उल्लंघन / रिकॉल',
    manufacturer: 'पंजीकृत निर्माता',
    highTrust: 'उच्च विश्वास (High Trust)',
    mediumTrust: 'मध्यम विश्वास (Medium Trust)',
    lowTrust: 'कम विश्वास (Low Trust)',
    veryLowTrust: 'अत्यधिक कम विश्वास',
    insufficientData: 'अपर्याप्त डेटा',
    guideFssai: '14-अंकीय FSSAI लाइसेंस कैसे पढ़ें',
    cleanRecord: 'कोई आधिकारिक उल्लंघन नहीं',
    recallsNotices: 'आधिकारिक नियामक नोटिस',
    quickTestSamples: 'डेमो परीक्षण सैंपल',
  },
  kn: {
    appTitle: 'ಲೇಬಲ್‌ಟ್ರಸ್ಟ್ ಪರೀಕ್ಷಕ',
    appSubtitle: 'FSSAI ಆಹಾರ ಸುರಕ್ಷತೆ ಟ್ರಸ್ಟ್ ಸ್ಕೋರ್ ಮತ್ತು ಲೇಬಲ್ ಪರಿಶೀಲನೆ',
    scanBarcode: 'ಬಾರ್‌ಕೋಡ್ / QR ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
    scanPhoto: 'ಲೇಬಲ್ ಫೋಟೋ ಮತ್ತು AI OCR',
    searchPlaceholder: 'ಉತ್ಪನ್ನ, ಬ್ರ್ಯಾಂಡ್ ಅಥವಾ 14-ಅಂಕಿಯ FSSAI ಸಂಖ್ಯೆ ಹುಡುಕಿ...',
    trustScore: 'ಟ್ರಸ್ಟ್ ಸ್ಕೋರ್',
    verifiedOfficial: 'ಅಧಿಕೃತ ನಿಯಂತ್ರಕ ದಾಖಲೆ (FSSAI)',
    userReported: 'ಗ್ರಾಹಕ ಸಮುದಾಯ ವರದಿ (ದೃಢೀಕರಿಸದ)',
    addToCompare: 'ಹೋಲಿಕೆಗೆ ಸೇರಿಸಿ',
    removeFromCompare: 'ತೆಗೆದುಹಾಕಿ',
    compareCount: 'ಉತ್ಪನ್ನ ಹೋಲಿಕೆ',
    reportExperience: 'ನಿಮ್ಮ ಅನುಭವ ಹಂಚಿಕೊಳ್ಳಿ',
    disclaimer: 'ಈ ಅಪ್ಲಿಕೇಶನ್ ಸಾರ್ವಜನಿಕ FSSAI ಮಾಹಿತಿ ಮತ್ತು ಸಮುದಾಯ ವರದಿಗಳನ್ನು ಬಳಸುತ್ತದೆ. ಇದು ಲ್ಯಾಬ್ ಪರೀಕ್ಷೆಯಿಲ್ಲದೆ ಕಲಬೆರಕೆಯನ್ನು ಖಚಿತಪಡಿಸುವುದಿಲ್ಲ.',
    licenseStatus: 'ಪರವಾನಗಿ ಸ್ಥಿತಿ',
    violationsCount: 'ಉಲ್ಲಂಘನೆಗಳು / ಹಿಂಪಡೆಯುವಿಕೆ',
    manufacturer: 'ನೋಂದಾಯಿತ ತಯಾರಕರು',
    highTrust: 'ಹೆಚ್ಚಿನ ನಂಬಿಕೆ (High Trust)',
    mediumTrust: 'ಮಧ್ಯಮ ನಂಬಿಕೆ',
    lowTrust: 'ಕಡಿಮೆ ನಂಬಿಕೆ',
    veryLowTrust: 'ಅತ್ಯಂತ ಕಡಿಮೆ ನಂಬಿಕೆ',
    insufficientData: 'ಅಪೂರ್ಣ ಮಾಹಿತಿ',
    guideFssai: '14-ಅಂಕಿಯ FSSAI ಪರವಾನಗಿ ಓದುವುದು ಹೇಗೆ',
    cleanRecord: 'ದಾಖಲಿತ ಉಲ್ಲಂಘನೆಗಳಿಲ್ಲ',
    recallsNotices: 'ಅಧಿಕೃತ ನಿಯಂತ್ರಕ ನೋಟಿಸ್‌ಗಳು',
    quickTestSamples: 'ಡೆಮೊ ಪರೀಕ್ಷಾ ಮಾದರಿಗಳು',
  },
};
