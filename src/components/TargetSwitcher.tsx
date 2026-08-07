"use client";
import { useState } from "react";
import CountryPicker from "./CountryPicker";
import { Country, formatInternationalPhone, validateWhatsAppNumber } from "@/lib/countries";

interface Props {
  currentTarget: string;
  onTargetChange: (newTarget: string, country: Country | null) => void;
  label?: string;
}

export default function TargetSwitcher({ currentTarget, onTargetChange, label }: Props) {
  const [show, setShow] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isValid, setIsValid] = useState(false);

  const handlePhoneChange = (phone: string, country: Country | null, valid: boolean) => {
    setNewNumber(phone);
    if (country) setSelectedCountry(country);
    setIsValid(valid);
  };

  const handleSave = () => {
    const validation = validateWhatsAppNumber(newNumber);
    if (!validation.valid) {
      alert(`Nomor tidak valid: ${validation.message}`);
      return;
    }

    const formatted = formatInternationalPhone(newNumber, selectedCountry || undefined);
    onTargetChange(newNumber.replace(/[^0-9+]/g, "").replace(/\+/g, ""), selectedCountry);
    setShow(false);
    setNewNumber("");

    // Show success toast
    const toast = document.createElement("div");
    toast.innerHTML = `✅ Nomor Target Diperbarui! Sekarang menargetkan: ${formatted} — Siap dikirim!`;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #000, #ff0040);
      color: white;
      padding: 12px 20px;
      border-radius: 10px;
      border: 1.5px solid #ff0040;
      box-shadow: 0 0 20px rgba(255,0,64,0.5);
      z-index: 9999;
      font-size: 12px;
      font-weight: 700;
      text-align: center;
      animation: slide-up 0.3s ease-out;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  };

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between gap-2 mb-2">
        <label className="digital-font text-white/70 text-[9px] tracking-[1px]">{label || "TARGET SAAT INI"}</label>
        <button
          onClick={() => setShow(!show)}
          className="digital-font bg-[rgba(255,0,64,0.1)] border border-[rgba(255,0,64,0.3)] rounded-md px-2.5 py-1 text-[#ff4466] text-[9px] font-bold hover:bg-[rgba(255,0,64,0.2)] transition-colors flex items-center gap-1"
        >
          🔄 Ganti Nomor Target
        </button>
      </div>

      {currentTarget && (
        <div className="bg-black/50 border border-[rgba(255,0,64,0.2)] rounded-lg px-3 py-2 flex items-center justify-between">
          <span className="text-white text-xs font-mono tracking-[1px]">+{currentTarget.replace(/[^0-9]/g, "")}</span>
          <span className="digital-font text-[#00ff88] text-[8px] bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.2)] rounded px-1.5 py-0.5">AKTIF</span>
        </div>
      )}

      {show && (
        <div className="mt-3 p-3 bg-black/70 border border-[rgba(255,0,64,0.3)] rounded-xl animate-fade-slide">
          <p className="digital-font text-[#ff0040] text-[9px] font-bold mb-2 tracking-[1px]">🌍 GANTI NOMOR TARGET — BEBAS KE SELURUH DUNIA</p>
          <p className="text-white/50 text-[10px] mb-3 leading-[1.4]">Pilih negara & masukkan nomor baru. Dari Indonesia pindah ke Malaysia, US, Eropa, dll — semua yang terdaftar di WhatsApp bisa langsung dipakai tanpa pairing ulang pengirim!</p>
          
          <CountryPicker
            value={newNumber}
            onChange={handlePhoneChange}
            label="NOMOR BARU WORLDWIDE"
            placeholder="812-3456-7890"
          />

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setShow(false)}
              className="flex-1 bg-white/5 border border-white/15 rounded-lg py-2.5 text-white/60 text-xs font-bold"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={!isValid || !newNumber.trim()}
              className="flex-1 bg-gradient-to-br from-black to-[#ff0040] border border-[#ff0040] rounded-lg py-2.5 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,0,64,0.3)]"
            >
              ✅ Simpan & Ganti Target
            </button>
          </div>

          <p className="digital-font text-white/30 text-[7px] mt-2 text-center">Otomatis validasi: nomor terdaftar di WhatsApp → langsung aktif jadi target baru</p>
        </div>
      )}
    </div>
  );
}
