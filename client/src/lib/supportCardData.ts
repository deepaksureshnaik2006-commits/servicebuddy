// Real company support contact details
export interface CompanySupport {
  companyName: string;
  phone: string;
  website: string;
  email?: string;
}

const supportDirectory: Record<string, CompanySupport> = {
  samsung: {
    companyName: "Samsung",
    phone: "1800-40-7267864",
    website: "https://www.samsung.com/in/support",
    email: "support@samsung.com",
  },
  lg: {
    companyName: "LG",
    phone: "1800-315-9999",
    website: "https://www.lg.com/in/support",
    email: "helpline@lgindia.com",
  },
  whirlpool: {
    companyName: "Whirlpool",
    phone: "1800-208-1800",
    website: "https://www.whirlpoolindia.com",
    email: "customercare@whirlpool.com",
  },
  godrej: {
    companyName: "Godrej",
    phone: "1800-209-5511",
    website: "https://www.godrej.com",
    email: "contactus@godrej.com",
  },
  voltas: {
    companyName: "Voltas",
    phone: "1800-266-4555",
    website: "https://www.voltas.com",
    email: "customercare@voltas.com",
  },
  daikin: {
    companyName: "Daikin",
    phone: "1800-209-5516",
    website: "https://www.daikinindia.com",
    email: "servicecall@daikinindia.com",
  },
  "blue star": {
    companyName: "Blue Star",
    phone: "1800-209-1177",
    website: "https://www.bluestarindia.com",
    email: "customercare@bluestarindia.com",
  },
  bluestar: {
    companyName: "Blue Star",
    phone: "1800-209-1177",
    website: "https://www.bluestarindia.com",
    email: "customercare@bluestarindia.com",
  },
  hitachi: {
    companyName: "Hitachi",
    phone: "1800-102-4747",
    website: "https://www.hitachi.co.in",
    email: "hitachicare@hitachi.co.in",
  },
  bosch: {
    companyName: "Bosch",
    phone: "1800-266-0011",
    website: "https://www.bosch-home.in",
    email: "bshc.in.customercare@bosch.com",
  },
  haier: {
    companyName: "Haier",
    phone: "1800-102-9999",
    website: "https://www.haier.com/in",
    email: "haiercare@haier.com",
  },
  panasonic: {
    companyName: "Panasonic",
    phone: "1800-103-1333",
    website: "https://www.panasonic.com/in",
    email: "customercare.in@panasonic.com",
  },
  sony: {
    companyName: "Sony",
    phone: "1800-103-7799",
    website: "https://www.sony.co.in",
    email: "contactus@sony.co.in",
  },
  apple: {
    companyName: "Apple",
    phone: "000-800-040-1966",
    website: "https://support.apple.com/en-in",
  },
  dell: {
    companyName: "Dell",
    phone: "1800-425-4026",
    website: "https://www.dell.com/support",
    email: "support.in@dell.com",
  },
  hp: {
    companyName: "HP",
    phone: "1800-108-4747",
    website: "https://support.hp.com/in-en",
    email: "indiahpsupport@hp.com",
  },
  lenovo: {
    companyName: "Lenovo",
    phone: "1800-419-7555",
    website: "https://www.lenovo.com/in",
    email: "support@lenovo.com",
  },
  ifb: {
    companyName: "IFB",
    phone: "1860-425-5678",
    website: "https://www.ifbappliances.com",
    email: "helpdesk@ifbappliances.com",
  },
  kent: {
    companyName: "Kent",
    phone: "1800-100-1000",
    website: "https://www.kent.co.in",
    email: "helpline@kent.co.in",
  },
  aquaguard: {
    companyName: "Aquaguard",
    phone: "1860-180-0345",
    website: "https://www.aquaguard.com",
    email: "support@aquaguard.com",
  },
  havells: {
    companyName: "Havells",
    phone: "1800-11-0303",
    website: "https://www.havells.com",
    email: "havellscare@havells.com",
  },
  bajaj: {
    companyName: "Bajaj",
    phone: "1800-209-5858",
    website: "https://www.bajajelectricals.com",
    email: "care@bajajelectricals.com",
  },
  racold: {
    companyName: "Racold",
    phone: "1860-425-2345",
    website: "https://www.racold.com",
    email: "racoldcare@ariston.com",
  },
  oneplus: {
    companyName: "OnePlus",
    phone: "1800-102-8411",
    website: "https://www.oneplus.in",
    email: "support@oneplus.in",
  },
  xiaomi: {
    companyName: "Xiaomi",
    phone: "1800-103-6286",
    website: "https://www.mi.com/in",
    email: "support@mi.com",
  },
  pureit: {
    companyName: "Pureit",
    phone: "1860-210-1000",
    website: "https://www.pureitwater.com",
    email: "pureit@hul.net",
  },
  livpure: {
    companyName: "Livpure",
    phone: "1800-419-4448",
    website: "https://www.livpure.in",
    email: "customercare@livpure.in",
  },
  "v-guard": {
    companyName: "V-Guard",
    phone: "1800-103-0103",
    website: "https://www.vguard.in",
    email: "customercare@vguard.in",
  },
  vguard: {
    companyName: "V-Guard",
    phone: "1800-103-0103",
    website: "https://www.vguard.in",
    email: "customercare@vguard.in",
  },
  jaquar: {
    companyName: "Jaquar",
    phone: "1800-102-2345",
    website: "https://www.jaquar.com",
    email: "customercare@jaquar.com",
  },
  hindware: {
    companyName: "Hindware",
    phone: "1800-103-2222",
    website: "https://www.hindwarehomes.com",
    email: "customercare@hindware.com",
  },
  cera: {
    companyName: "Cera",
    phone: "1800-233-2372",
    website: "https://www.cera-india.com",
    email: "care@cera-india.com",
  },
  parryware: {
    companyName: "Parryware",
    phone: "1800-425-5678",
    website: "https://www.parryware.in",
    email: "customercare@parryware.in",
  },
  anchor: {
    companyName: "Anchor",
    phone: "1800-102-0202",
    website: "https://www.anchorelectrical.com",
    email: "support@anchorelectrical.com",
  },
  polycab: {
    companyName: "Polycab",
    phone: "1800-266-7522",
    website: "https://www.polycab.com",
    email: "customercare@polycab.com",
  },
  finolex: {
    companyName: "Finolex",
    phone: "1800-209-0990",
    website: "https://www.finolexcables.com",
    email: "care@finolexcables.com",
  },
};

// Service type to company mapping for generic services
const serviceTypeMapping: Record<string, CompanySupport> = {
  "ac repair": {
    companyName: "Voltas",
    phone: "1800-266-4555",
    website: "https://www.voltas.com",
    email: "customercare@voltas.com",
  },
  "ac service": {
    companyName: "Voltas",
    phone: "1800-266-4555",
    website: "https://www.voltas.com",
    email: "customercare@voltas.com",
  },
  "refrigerator": {
    companyName: "Whirlpool",
    phone: "1800-208-1800",
    website: "https://www.whirlpoolindia.com",
    email: "customercare@whirlpool.com",
  },
  "fridge": {
    companyName: "Whirlpool",
    phone: "1800-208-1800",
    website: "https://www.whirlpoolindia.com",
    email: "customercare@whirlpool.com",
  },
  "washing machine": {
    companyName: "LG",
    phone: "1800-315-9999",
    website: "https://www.lg.com/in/support",
    email: "helpline@lgindia.com",
  },
  "tv repair": {
    companyName: "Samsung",
    phone: "1800-40-7267864",
    website: "https://www.samsung.com/in/support",
    email: "support@samsung.com",
  },
  "television": {
    companyName: "Samsung",
    phone: "1800-40-7267864",
    website: "https://www.samsung.com/in/support",
    email: "support@samsung.com",
  },
  "microwave": {
    companyName: "LG",
    phone: "1800-315-9999",
    website: "https://www.lg.com/in/support",
    email: "helpline@lgindia.com",
  },
  "laptop repair": {
    companyName: "Dell",
    phone: "1800-425-4026",
    website: "https://www.dell.com/support",
    email: "support.in@dell.com",
  },
  "mobile repair": {
    companyName: "Samsung",
    phone: "1800-40-7267864",
    website: "https://www.samsung.com/in/support",
    email: "support@samsung.com",
  },
  "plumbing": {
    companyName: "Jaquar",
    phone: "1800-102-2345",
    website: "https://www.jaquar.com",
    email: "customercare@jaquar.com",
  },
  "electrical": {
    companyName: "Havells",
    phone: "1800-11-0303",
    website: "https://www.havells.com",
    email: "havellscare@havells.com",
  },
  "water purifier": {
    companyName: "Kent",
    phone: "1800-100-1000",
    website: "https://www.kent.co.in",
    email: "helpline@kent.co.in",
  },
  "geyser": {
    companyName: "Havells",
    phone: "1800-11-0303",
    website: "https://www.havells.com",
    email: "havellscare@havells.com",
  },
};

/**
 * Detect company support info from service name or problem text
 */
export function detectCompanySupport(serviceName: string, problemText: string): CompanySupport {
  const combined = `${serviceName} ${problemText}`.toLowerCase();

  // First check brand names
  for (const [key, support] of Object.entries(supportDirectory)) {
    if (combined.includes(key)) {
      return support;
    }
  }

  // Then check service type mappings
  for (const [key, support] of Object.entries(serviceTypeMapping)) {
    if (combined.includes(key)) {
      return support;
    }
  }

  return {
    companyName: serviceName || "Service Provider",
    phone: "1800-11-0303",
    website: "https://www.havells.com",
    email: "havellscare@havells.com",
  };
}

export default supportDirectory;
