export const langToCountry = {
    ja: "JP", // Japanese → Japan
    ms: "MY", // Malay → Malaysia
    uk: "UA", // Ukrainian → Ukraine
    ko: "KR", // Korean → South Korea
    en: "US", // English → United States
    zh: "CN", // Chinese (Simplified) → China
    fr: "FR", // French → France
    "ja-ro":"JP",
    
    "pt-br": "BR", // Portuguese (Brazilian) → Brazil
    id: "ID", // Indonesian → Indonesia
    vi: "VN", // Vietnamese → Vietnam
    "es-la": "MX", // Spanish (Latin America) → Mexico
    "zh-hk": "HK", // Chinese (Traditional) → Hong Kong
    it: "IT", // Italian → Italy
    tr: "TR", // Turkish → Turkey
    es: "ES", // Spanish → Spain
    ru: "RU", // Russian → Russia
    ro: "RO", // Romanian → Romania
    ar: "AE", // Arabic → United Arab Emirates
    af: "ZA", // Afrikaans → South Africa
    sq: "AL", // Albanian → Albania
    az: "AZ", // Azerbaijani → Azerbaijan
    eu: "ES", // Basque → Spain
    be: "BY", // Belarusian → Belarus
    bn: "BD", // Bengali → Bangladesh
    bg: "BG", // Bulgarian → Bulgaria
    my: "MM", // Burmese → Myanmar
    ca: "ES", // Catalan → Spain
    cv: "RU", // Chuvash → Russia
    hr: "HR", // Croatian → Croatia
    cs: "CZ", // Czech → Czech Republic
    da: "DK", // Danish → Denmark
    nl: "NL", // Dutch → Netherlands
    eo: "UN", // Esperanto → No specific country (using "UN" as a neutral placeholder)
    et: "EE", // Estonian → Estonia
    tl: "PH", // Filipino → Philippines
    fi: "FI", // Finnish → Finland
    ka: "GE", // Georgian → Georgia
    de: "DE", // German → Germany
    el: "GR", // Greek → Greece
    he: "IL", // Hebrew → Israel
    hi: "IN", // Hindi → India
    hu: "HU", // Hungarian → Hungary
    ga: "IE", // Irish → Ireland
    jv: "ID", // Javanese → Indonesia
    kk: "KZ", // Kazakh → Kazakhstan
    la: "VA", // Latin → Vatican City (historical association)
    lt: "LT", // Lithuanian → Lithuania
    mn: "MN", // Mongolian → Mongolia
    ne: "NP", // Nepali → Nepal
    no: "NO", // Norwegian → Norway
    fa: "IR", // Persian → Iran
    pl: "PL", // Polish → Poland
    pt: "PT", // Portuguese → Portugal
    sr: "RS", // Serbian → Serbia
    sk: "SK", // Slovak → Slovakia
    sl: "SI", // Slovenian → Slovenia
    sv: "SE", // Swedish → Sweden
    ta: "IN", // Tamil → India
    te: "IN", // Telugu → India
    th: "TH", // Thai → Thailand
    ur: "PK", // Urdu → Pakistan
    uz: "UZ", // Uzbek → Uzbekistan
  };

export const getRatingColor = (rating) => ({
    safe: "bg-green-600",
    suggestive: "bg-yellow-600",
    erotica: "bg-red-600",
    safeBorder:"border-green-600",
    suggestiveBorder: "border-yellow-600",
    eroticaBorder: "border-red-600",
    light:"bg-gray-300/40"
  }[rating] || "bg-gray-600/40");

export const allAvailableLanguages = [
    "en", // English
    "af", // Afrikaans
    "sq", // Albanian
    "ar", // Arabic
    "az", // Azerbaijani
    "eu", // Basque
    "be", // Belarusian
    "bn", // Bengali
    "bg", // Bulgarian
    "my", // Burmese
    "ca", // Catalan
    "zh", // Chinese (Simplified)
    "zh-hk", // Chinese (Traditional)
    "cv", // Chuvash
    "hr", // Croatian
    "cs", // Czech
    "da", // Danish
    "nl", // Dutch
    "eo", // Esperanto
    "et", // Estonian
    "tl", // Filipino
    "fi", // Finnish
    "fr", // French
    "ka", // Georgian
    "de", // German
    "el", // Greek
    "he", // Hebrew
    "hi", // Hindi
    "hu", // Hungarian
    "id", // Indonesian
    "ga", // Irish
    "it", // Italian
    "ja", // Japanese
    "jv", // Javanese
    "kk", // Kazakh
    "ko", // Korean
    "la", // Latin
    "lt", // Lithuanian
    "ms", // Malay
    "mn", // Mongolian
    "ne", // Nepali
    "no", // Norwegian
    "fa", // Persian
    "pl", // Polish
    "pt", // Portuguese
    "pt-br", // Portuguese (Brazil)
    "ro", // Romanian
    "ru", // Russian
    "sr", // Serbian
    "sk", // Slovak
    "sl", // Slovenian
    "es", // Spanish
    "es-la", // Spanish (Latin America)
    "sv", // Swedish
    "ta", // Tamil
    "te", // Telugu
    "th", // Thai
    "tr", // Turkish
    "uk", // Ukrainian
    "ur", // Urdu
    "uz", // Uzbek
    "vi", // Vietnamese
  ];
  export const langFullNames = {
    ja: "Japanese",
    ms: "Malay",
    uk: "Ukrainian",
    ko: "Korean",
    en: "English",
    zh: "Chinese (Simplified)",
    fr: "French",
    "pt-br": "Portuguese (Brazil)",
    id: "Indonesian",
    vi: "Vietnamese",
    "es-la": "Spanish (Latin America)",
    "zh-hk": "Chinese (Traditional)",
    it: "Italian",
    tr: "Turkish",
    es: "Spanish",
    ru: "Russian",
    ro: "Romanian",
    ar: "Arabic",
    af: "Afrikaans",
    sq: "Albanian",
    az: "Azerbaijani",
    eu: "Basque",
    be: "Belarusian",
    bn: "Bengali",
    bg: "Bulgarian",
    my: "Burmese",
    ca: "Catalan",
    cv: "Chuvash",
    hr: "Croatian",
    cs: "Czech",
    da: "Danish",
    nl: "Dutch",
    eo: "Esperanto",
    et: "Estonian",
    tl: "Filipino",
    fi: "Finnish",
    ka: "Georgian",
    de: "German",
    el: "Greek",
    he: "Hebrew",
    hi: "Hindi",
    hu: "Hungarian",
    ga: "Irish",
    jv: "Javanese",
    kk: "Kazakh",
    la: "Latin",
    lt: "Lithuanian",
    mn: "Mongolian",
    ne: "Nepali",
    no: "Norwegian",
    fa: "Persian",
    pl: "Polish",
    pt: "Portuguese",
    sr: "Serbian",
    sk: "Slovak",
    sl: "Slovenian",
    sv: "Swedish",
    ta: "Tamil",
    te: "Telugu",
    th: "Thai",
    ur: "Urdu",
    uz: "Uzbek",
  };