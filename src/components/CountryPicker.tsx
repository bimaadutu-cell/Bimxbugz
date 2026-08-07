"use client";
import { useState, useMemo } from "react";
import { COUNTRIES, Country, getAllCountriesSorted, validateWhatsAppNumber } from "@/lib/countries";

interface Props {
  value: string; // phone number
  onChange: (phone: string, country: Country | null, isValid: boolean) => void;
  placeholder?: string;
  label?: string;
}

export default function CountryPicker({ value, onChange, placeholder, label }: Props) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES.find(c => c.code === "ID") || COUNTRIES[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");

  const allCountries = useMemo(() => getAllCountriesSorted(), []);
  
  const filteredCountries = useMemo(() => {
    if (!search) return allCountries;
    const lower = search.toLowerCase();
    return allCountries.filter(c => 
      c.name.toLowerCase().includes(lower) ||
      c.dialCode.includes(lower) ||
      c.code.toLowerCase().includes(lower)
    );
  }, [search, allCountries]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setShowDropdown(false);
    setSearch("");
    // Re-validate with new country
    const validation = validateWhatsAppNumber(`+${country.dialCode}${value.replace(/[^0-9]/g, "").replace(new RegExp(`^${country.dialCode}`), "").replace(/^0+/, "")}`);
    // Actually keep raw number and let parent handle formatting
    const cleanNumber = value.replace(/[^0-9]/g, "");
    let numberPart = cleanNumber;
    // Remove old dial code if present
    const oldDetected = allCountries.find(c => cleanNumber.startsWith(c.dialCode));
    if (oldDetected) {
      numberPart = cleanNumber.slice(oldDetected.dialCode.length);
    }
    numberPart = numberPart.replace(/^0+/, "");
    const newPhone = `+${country.dialCode}${numberPart}`;
    onChange(newPhone, country, true);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Allow + and numbers
    const clean = input.replace(/[^0-9+]/g, "");
    
    // Try auto-detect country from input
    let detectedCountry = selectedCountry;
    const withoutPlus = clean.replace(/^\+/, "");
    // Find country that matches start of number
    const sorted = [...allCountries].sort((a,b) => b.dialCode.length - a.dialCode.length);
    for (const c of sorted) {
      if (withoutPlus.startsWith(c.dialCode) && withoutPlus.length > c.dialCode.length + 3) {
        detectedCountry = c;
        setSelectedCountry(c);
        break;
      }
    }

    const validation = validateWhatsAppNumber(clean);
    onChange(clean, validation.country || detectedCountry, validation.valid);
  };

  const displayValue = value.startsWith("+") ? value : value ? `+${selectedCountry.dialCode}${value.replace(/[^0-9]/g, "").replace(/^0+/, "").replace(new RegExp(`^${selectedCountry.dialCode}`), "")}` : "";

  return (
    <div className="relative w-full">
      {label && (
        <label className="digital-font text-white text-[10px] tracking-[1px] block mb-2">{label}</label>
      )}
      
      <div className="flex gap-0 rounded-lg overflow-hidden border border-[rgba(255,0,64,0.35)] bg-black/70 shadow-[inset_0_0_12px_rgba(0,0,0,0.6)] focus-within:border-[#ff0040] focus-within:shadow-[0_0_15px_rgba(255,0,64,0.25)] transition-all">
        {/* Country Selector Button */}
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-1.5 px-3 py-3 bg-[rgba(255,0,64,0.08)] border-r border-[rgba(255,0,64,0.25)] text-white text-sm font-bold hover:bg-[rgba(255,0,64,0.15)] transition-colors shrink-0 min-w-[85px] justify-between"
        >
          <span className="flex items-center gap-1.5">
            <span className="text-[16px]">{selectedCountry.flag}</span>
            <span className="text-[12px]">+{selectedCountry.dialCode}</span>
          </span>
          <span className="text-[10px] opacity-50">▼</span>
        </button>

        {/* Phone Input */}
        <input
          type="tel"
          value={value}
          onChange={handlePhoneChange}
          placeholder={placeholder || `${selectedCountry.format}`}
          className="flex-1 bg-transparent px-3 py-3 text-white text-[15px] tracking-[1px] outline-none placeholder:text-white/30"
        />
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full bg-black/95 backdrop-blur-xl border border-[rgba(255,0,64,0.35)] rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(255,0,64,0.2)] max-h-[280px] overflow-hidden flex flex-col">
          <div className="p-2 border-b border-white/10 shrink-0">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Cari negara / kode... (Indonesia, 62, US, 1)"
              className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-xs outline-none focus:border-[#ff0040]/50"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto scrollbar-hide flex-1">
            {filteredCountries.map((country) => (
              <button
                key={`${country.code}-${country.dialCode}`}
                onClick={() => handleCountrySelect(country)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-[rgba(255,0,64,0.1)] transition-colors border-b border-white/[0.03] last:border-0"
                style={{
                  background: selectedCountry.code === country.code && selectedCountry.dialCode === country.dialCode ? "rgba(255,0,64,0.15)" : "transparent",
                }}
              >
                <span className="text-[18px]">{country.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-bold m-0 truncate">{country.name}</p>
                  <p className="text-white/40 text-[10px] m-0">+{country.dialCode} • {country.format}</p>
                </div>
                <span className="text-[#ff0040] text-xs font-bold">+{country.dialCode}</span>
              </button>
            ))}
            {filteredCountries.length === 0 && (
              <p className="text-white/40 text-xs text-center py-4">Tidak ada negara ditemukan</p>
            )}
          </div>
          <div className="p-2 border-t border-white/10 shrink-0 bg-black/50">
            <p className="digital-font text-white/30 text-[8px] m-0 text-center">🌍 SEMUA NEGARA WHATSAPP • OTOMATIS DETEKSI • REAL PAIRING</p>
          </div>
        </div>
      )}

      {/* Validation message */}
      {value && (
        <div className="mt-1.5">
          {(() => {
            const validation = validateWhatsAppNumber(value);
            return (
              <p className="text-[10px] leading-[1.4]" style={{ color: validation.valid ? "#00ff88" : "#ff4466" }}>
                {validation.message}
              </p>
            );
          })()}
        </div>
      )}

      {/* Overlay to close dropdown */}
      {showDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
      )}
    </div>
  );
}
