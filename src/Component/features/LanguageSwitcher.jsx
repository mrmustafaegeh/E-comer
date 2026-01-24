"use client";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <select
      onChange={changeLanguage}
      value={i18n.language}
      className="p-2 rounded border bg-white text-gray-700 text-sm"
    >
      <option value="en">English</option>
      <option value="tr">Türkçe</option>
      <option value="ar">العربية</option>
      <option value="sm">Somali</option>
    </select>
  );
}
