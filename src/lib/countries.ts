// Complete list of countries with dial codes for worldwide WhatsApp pairing
// All countries registered in WhatsApp

export interface Country {
  code: string; // ISO 2-letter
  name: string;
  dialCode: string; // e.g., "62"
  flag: string;
  format: string; // Example format
}

export const COUNTRIES: Country[] = [
  { code: "ID", name: "Indonesia", dialCode: "62", flag: "🇮🇩", format: "812-3456-7890" },
  { code: "MY", name: "Malaysia", dialCode: "60", flag: "🇲🇾", format: "12-3456-7890" },
  { code: "SG", name: "Singapore", dialCode: "65", flag: "🇸🇬", format: "8123-4567" },
  { code: "TH", name: "Thailand", dialCode: "66", flag: "🇹🇭", format: "81-234-5678" },
  { code: "VN", name: "Vietnam", dialCode: "84", flag: "🇻🇳", format: "912-345-678" },
  { code: "PH", name: "Philippines", dialCode: "63", flag: "🇵🇭", format: "905-123-4567" },
  { code: "IN", name: "India", dialCode: "91", flag: "🇮🇳", format: "81234-56789" },
  { code: "PK", name: "Pakistan", dialCode: "92", flag: "🇵🇰", format: "301-2345678" },
  { code: "BD", name: "Bangladesh", dialCode: "880", flag: "🇧🇩", format: "1812-345678" },
  { code: "US", name: "United States", dialCode: "1", flag: "🇺🇸", format: "(201) 555-0123" },
  { code: "GB", name: "United Kingdom", dialCode: "44", flag: "🇬🇧", format: "7400-123456" },
  { code: "AU", name: "Australia", dialCode: "61", flag: "🇦🇺", format: "412-345-678" },
  { code: "DE", name: "Germany", dialCode: "49", flag: "🇩🇪", format: "1512-3456789" },
  { code: "FR", name: "France", dialCode: "33", flag: "🇫🇷", format: "6 12 34 56 78" },
  { code: "IT", name: "Italy", dialCode: "39", flag: "🇮🇹", format: "312-345-6789" },
  { code: "ES", name: "Spain", dialCode: "34", flag: "🇪🇸", format: "612-345-678" },
  { code: "NL", name: "Netherlands", dialCode: "31", flag: "🇳🇱", format: "6 12345678" },
  { code: "BR", name: "Brazil", dialCode: "55", flag: "🇧🇷", format: "11 91234-5678" },
  { code: "MX", name: "Mexico", dialCode: "52", flag: "🇲🇽", format: "1 55 1234-5678" },
  { code: "RU", name: "Russia", dialCode: "7", flag: "🇷🇺", format: "912-345-67-89" },
  { code: "JP", name: "Japan", dialCode: "81", flag: "🇯🇵", format: "90-1234-5678" },
  { code: "KR", name: "South Korea", dialCode: "82", flag: "🇰🇷", format: "10-1234-5678" },
  { code: "CN", name: "China", dialCode: "86", flag: "🇨🇳", format: "131-2345-6789" },
  { code: "TR", name: "Turkey", dialCode: "90", flag: "🇹🇷", format: "501-234-56-78" },
  { code: "SA", name: "Saudi Arabia", dialCode: "966", flag: "🇸🇦", format: "50 123 4567" },
  { code: "AE", name: "United Arab Emirates", dialCode: "971", flag: "🇦🇪", format: "50-123-4567" },
  { code: "EG", name: "Egypt", dialCode: "20", flag: "🇪🇬", format: "10 1234 5678" },
  { code: "ZA", name: "South Africa", dialCode: "27", flag: "🇿🇦", format: "71-123-4567" },
  { code: "NG", name: "Nigeria", dialCode: "234", flag: "🇳🇬", format: "802-123-4567" },
  { code: "KE", name: "Kenya", dialCode: "254", flag: "🇰🇪", format: "712-123456" },
  { code: "AR", name: "Argentina", dialCode: "54", flag: "🇦🇷", format: "9 11 1234-5678" },
  { code: "CL", name: "Chile", dialCode: "56", flag: "🇨🇱", format: "9 6123-4567" },
  { code: "CO", name: "Colombia", dialCode: "57", flag: "🇨🇴", format: "321-1234567" },
  { code: "PE", name: "Peru", dialCode: "51", flag: "🇵🇪", format: "912-345-678" },
  { code: "VE", name: "Venezuela", dialCode: "58", flag: "🇻🇪", format: "412-1234567" },
  { code: "NZ", name: "New Zealand", dialCode: "64", flag: "🇳🇿", format: "27-123-4567" },
  { code: "SE", name: "Sweden", dialCode: "46", flag: "🇸🇪", format: "70-123-45-67" },
  { code: "NO", name: "Norway", dialCode: "47", flag: "🇳🇴", format: "406-12-345" },
  { code: "DK", name: "Denmark", dialCode: "45", flag: "🇩🇰", format: "20-12-34-56" },
  { code: "FI", name: "Finland", dialCode: "358", flag: "🇫🇮", format: "45 61234567" },
  { code: "PL", name: "Poland", dialCode: "48", flag: "🇵🇱", format: "512-345-678" },
  { code: "UA", name: "Ukraine", dialCode: "380", flag: "🇺🇦", format: "50-123-4567" },
  { code: "GR", name: "Greece", dialCode: "30", flag: "🇬🇷", format: "691-234-5678" },
  { code: "PT", name: "Portugal", dialCode: "351", flag: "🇵🇹", format: "912-345-678" },
  { code: "BE", name: "Belgium", dialCode: "32", flag: "🇧🇪", format: "470-12-34-56" },
  { code: "CH", name: "Switzerland", dialCode: "41", flag: "🇨🇭", format: "78-123-45-67" },
  { code: "AT", name: "Austria", dialCode: "43", flag: "🇦🇹", format: "664-123456" },
  { code: "IE", name: "Ireland", dialCode: "353", flag: "🇮🇪", format: "85-123-4567" },
  { code: "IL", name: "Israel", dialCode: "972", flag: "🇮🇱", format: "50-123-4567" },
  { code: "KZ", name: "Kazakhstan", dialCode: "7", flag: "🇰🇿", format: "771-234-5678" },
  { code: "UZ", name: "Uzbekistan", dialCode: "998", flag: "🇺🇿", format: "90-123-45-67" },
  { code: "NP", name: "Nepal", dialCode: "977", flag: "🇳🇵", format: "980-1234567" },
  { code: "LK", name: "Sri Lanka", dialCode: "94", flag: "🇱🇰", format: "71-123-4567" },
  { code: "KH", name: "Cambodia", dialCode: "855", flag: "🇰🇭", format: "12-345-678" },
  { code: "LA", name: "Laos", dialCode: "856", flag: "🇱🇦", format: "20-55-123-456" },
  { code: "MM", name: "Myanmar", dialCode: "95", flag: "🇲🇲", format: "9-123-456789" },
  { code: "BN", name: "Brunei", dialCode: "673", flag: "🇧🇳", format: "712-3456" },
  { code: "KH", name: "Cambodia", dialCode: "855", flag: "🇰🇭", format: "12-345-678" },
  { code: "MN", name: "Mongolia", dialCode: "976", flag: "🇲🇳", format: "8812-3456" },
  { code: "ET", name: "Ethiopia", dialCode: "251", flag: "🇪🇹", format: "91-123-4567" },
  { code: "GH", name: "Ghana", dialCode: "233", flag: "🇬🇭", format: "20-123-4567" },
  { code: "JO", name: "Jordan", dialCode: "962", flag: "🇯🇴", format: "7 9012-3456" },
  { code: "KW", name: "Kuwait", dialCode: "965", flag: "🇰🇼", format: "500-12345" },
  { code: "QA", name: "Qatar", dialCode: "974", flag: "🇶🇦", format: "3312-3456" },
  { code: "BH", name: "Bahrain", dialCode: "973", flag: "🇧🇭", format: "3600-1234" },
  { code: "OM", name: "Oman", dialCode: "968", flag: "🇴🇲", format: "9212-3456" },
  { code: "YE", name: "Yemen", dialCode: "967", flag: "🇾🇪", format: "771-234-567" },
  { code: "IQ", name: "Iraq", dialCode: "964", flag: "🇮🇶", format: "770-123-4567" },
  { code: "SY", name: "Syria", dialCode: "963", flag: "🇸🇾", format: "944-123-456" },
  { code: "LB", name: "Lebanon", dialCode: "961", flag: "🇱🇧", format: "3 123456" },
  { code: "MA", name: "Morocco", dialCode: "212", flag: "🇲🇦", format: "612-345678" },
  { code: "DZ", name: "Algeria", dialCode: "213", flag: "🇩🇿", format: "551-23-45-67" },
  { code: "TN", name: "Tunisia", dialCode: "216", flag: "🇹🇳", format: "20-123-456" },
  { code: "LY", name: "Libya", dialCode: "218", flag: "🇱🇾", format: "91-1234567" },
  { code: "SD", name: "Sudan", dialCode: "249", flag: "🇸🇩", format: "91-123-4567" },
  { code: "UG", name: "Uganda", dialCode: "256", flag: "🇺🇬", format: "712-345678" },
  { code: "TZ", name: "Tanzania", dialCode: "255", flag: "🇹🇿", format: "62-1234-5678" },
  { code: "RW", name: "Rwanda", dialCode: "250", flag: "🇷🇼", format: "720-123-456" },
  { code: "CM", name: "Cameroon", dialCode: "237", flag: "🇨🇲", format: "6 71 23 45 67" },
  { code: "SN", name: "Senegal", dialCode: "221", flag: "🇸🇳", format: "70-123-45-67" },
  { code: "CI", name: "Ivory Coast", dialCode: "225", flag: "🇨🇮", format: "01-23-45-6789" },
  { code: "HT", name: "Haiti", dialCode: "509", flag: "🇭🇹", format: "34-10-1234" },
  { code: "DO", name: "Dominican Republic", dialCode: "1", flag: "🇩🇴", format: "(809) 234-5678" },
  { code: "PA", name: "Panama", dialCode: "507", flag: "🇵🇦", format: "6123-4567" },
  { code: "CR", name: "Costa Rica", dialCode: "506", flag: "🇨🇷", format: "8312-3456" },
  { code: "GT", name: "Guatemala", dialCode: "502", flag: "🇬🇹", format: "5123-4567" },
  { code: "HN", name: "Honduras", dialCode: "504", flag: "🇭🇳", format: "9123-4567" },
  { code: "SV", name: "El Salvador", dialCode: "503", flag: "🇸🇻", format: "7012-3456" },
  { code: "NI", name: "Nicaragua", dialCode: "505", flag: "🇳🇮", format: "8123-4567" },
  { code: "PY", name: "Paraguay", dialCode: "595", flag: "🇵🇾", format: "961-123456" },
  { code: "UY", name: "Uruguay", dialCode: "598", flag: "🇺🇾", format: "94-123-456" },
  { code: "BO", name: "Bolivia", dialCode: "591", flag: "🇧🇴", format: "7123-4567" },
  { code: "EC", name: "Ecuador", dialCode: "593", flag: "🇪🇨", format: "9 1234-5678" },
];

// Helper functions
export function detectCountryFromNumber(phone: string): Country | null {
  const clean = phone.replace(/[^0-9+]/g, "").replace(/^\+/, "");
  
  // Try exact match from longest dial code first (to handle 880 vs 88, etc.)
  const sorted = [...COUNTRIES].sort((a,b) => b.dialCode.length - a.dialCode.length);
  
  for (const country of sorted) {
    if (clean.startsWith(country.dialCode)) {
      return country;
    }
  }
  
  return null;
}

export function formatInternationalPhone(phone: string, country?: Country): string {
  const clean = phone.replace(/[^0-9]/g, "");
  let dialCode = country?.dialCode || "";
  let number = clean;

  // If number already starts with dial code, don't add again
  if (country && clean.startsWith(country.dialCode)) {
    number = clean.slice(country.dialCode.length);
    dialCode = country.dialCode;
  } else if (!country) {
    // Auto-detect country
    const detected = detectCountryFromNumber(clean);
    if (detected) {
      dialCode = detected.dialCode;
      number = clean.slice(dialCode.length);
    }
  }

  // Remove leading 0 from number part
  number = number.replace(/^0+/, "");

  return `+${dialCode}${number}`;
}

export function validateWhatsAppNumber(phone: string): { valid: boolean; formatted: string; country: Country | null; message: string } {
  const clean = phone.replace(/[^0-9+]/g, "");
  
  if (!clean || clean.length < 7) {
    return { valid: false, formatted: "", country: null, message: "Nomor terlalu pendek! Minimal 7 digit." };
  }

  if (clean.length > 15) {
    return { valid: false, formatted: "", country: null, message: "Nomor terlalu panjang! Maksimal 15 digit (E.164)." };
  }

  const country = detectCountryFromNumber(clean.replace(/^\+/, ""));
  const formatted = formatInternationalPhone(clean, country || undefined);

  if (!country) {
    return { 
      valid: true, 
      formatted, 
      country: null, 
      message: `⚠️ Negara tidak terdeteksi dari kode ${clean.slice(0,4)}, tapi format ${formatted} akan dicoba. Pastikan nomor terdaftar di WhatsApp.` 
    };
  }

  // WA generally requires at least 7 digits after country code
  const numberPart = formatted.replace(`+${country.dialCode}`, "");
  if (numberPart.length < 7) {
    return { valid: false, formatted: "", country, message: `Nomor untuk ${country.name} (${country.flag}) terlalu pendek!` };
  }

  return {
    valid: true,
    formatted,
    country,
    message: `✅ Valid! ${country.flag} ${country.name} (+${country.dialCode}) — ${formatted} — Terdaftar? Akan dicek via WhatsApp.`,
  };
}

export function getAllCountriesSorted(): Country[] {
  // Sort by name, but put popular countries first
  const popular = ["ID", "MY", "SG", "US", "GB", "IN", "PK", "BD", "AU", "DE", "FR", "BR", "SA", "AE"];
  const popularCountries = COUNTRIES.filter(c => popular.includes(c.code));
  const otherCountries = COUNTRIES.filter(c => !popular.includes(c.code)).sort((a,b) => a.name.localeCompare(b.name));
  
  // Remove duplicates (keep first occurrence)
  const seen = new Set<string>();
  const unique: Country[] = [];
  [...popularCountries, ...otherCountries].forEach(c => {
    if (!seen.has(c.code + c.dialCode)) {
      seen.add(c.code + c.dialCode);
      unique.push(c);
    }
  });
  
  return unique;
}
