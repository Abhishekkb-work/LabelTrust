// FSSAI 14-digit license parser and validation utility
// Ref: Food Safety and Standards Authority of India (FSSAI) Licensing and Registration System

export const STATE_CODES: Record<string, string> = {
  '01': 'Jammu & Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '27': 'Maharashtra',
  '28': 'Andhra Pradesh',
  '29': 'Karnataka',
  '30': 'Goa',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '36': 'Telangana',
  '37': 'Ladakh',
};

export interface FSSAIStructure {
  isValid: boolean;
  cleanNumber: string;
  licenseType: 'Central' | 'State' | 'Unknown';
  stateName: string;
  yearOfEnrolment: string;
  serialNumber: string;
  formattedDisplay: string;
  validationError?: string;
}

export function parseFSSAILicense(rawInput: string): FSSAIStructure {
  const clean = rawInput.replace(/[^0-9]/g, '');

  if (clean.length !== 14) {
    return {
      isValid: false,
      cleanNumber: clean,
      licenseType: 'Unknown',
      stateName: 'Unknown',
      yearOfEnrolment: 'Unknown',
      serialNumber: '',
      formattedDisplay: rawInput,
      validationError: clean.length === 0 
        ? 'Please enter 14 digits' 
        : `License must be 14 digits (currently ${clean.length})`,
    };
  }

  const firstDigit = clean[0];
  const stateCode = clean.substring(1, 3);
  const yearDigits = clean.substring(3, 5);
  const serial = clean.substring(8);

  const licenseType = firstDigit === '1' ? 'Central' : firstDigit === '2' ? 'State' : 'Unknown';
  const stateName = STATE_CODES[stateCode] || 'Central / All India Jurisdiction';
  const yearOfEnrolment = `20${yearDigits}`;

  // Formatted as: 1-00-12-021-000071
  const formattedDisplay = `${clean.substring(0, 1)} ${clean.substring(1, 3)} ${clean.substring(3, 5)} ${clean.substring(5, 8)} ${clean.substring(8)}`;

  return {
    isValid: true,
    cleanNumber: clean,
    licenseType,
    stateName,
    yearOfEnrolment,
    serialNumber: serial,
    formattedDisplay,
  };
}

export function sanitizeLicense(input: string): string {
  return input.replace(/[^0-9]/g, '').slice(0, 14);
}
