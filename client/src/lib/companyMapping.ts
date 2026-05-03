// Skill → Supported Companies mapping (UI-only, no DB changes)
export const skillToCompanies: Record<string, string[]> = {
  "AC Repair": ["Samsung", "LG", "Voltas", "Daikin", "Blue Star", "Hitachi"],
  "AC Service": ["Samsung", "LG", "Voltas", "Daikin", "Blue Star", "Hitachi"],
  "Refrigerator Repair": ["Samsung", "LG", "Whirlpool", "Godrej", "Haier"],
  "Washing Machine Repair": ["LG", "Samsung", "IFB", "Whirlpool", "Bosch"],
  "TV Repair": ["Samsung", "LG", "Sony", "Panasonic"],
  "Microwave Repair": ["LG", "Samsung", "Panasonic", "Whirlpool"],
  "Laptop Repair": ["Dell", "HP", "Lenovo", "Apple"],
  "Mobile Repair": ["Samsung", "Apple", "OnePlus", "Xiaomi"],
  "Electrical": ["Havells", "Anchor", "Polycab", "Finolex"],
  "Plumbing": ["Jaquar", "Hindware", "Cera", "Parryware"],
  "Water Purifier": ["Kent", "Aquaguard", "Pureit", "Livpure"],
  "Geyser Repair": ["Havells", "Bajaj", "Racold", "V-Guard"],
};

// Known brands for the complaint form dropdown
export const COMPANY_BRANDS = [
  "Samsung", "LG", "Whirlpool", "Godrej", "Voltas", "Daikin",
  "Blue Star", "Hitachi", "Bosch", "Haier", "Panasonic", "Sony",
  "Apple", "Dell", "HP", "Lenovo", "IFB", "Kent", "Havells",
  "OnePlus", "Xiaomi", "Bajaj", "Racold", "Aquaguard",
];

/**
 * Get supported companies for a technician skill
 */
export function getCompaniesForSkill(skill: string | null): string[] {
  if (!skill) return [];
  const lower = skill.toLowerCase();
  for (const [key, companies] of Object.entries(skillToCompanies)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return companies;
    }
  }
  // Partial match
  for (const [key, companies] of Object.entries(skillToCompanies)) {
    const words = lower.split(/\s+/);
    if (words.some(w => key.toLowerCase().includes(w) && w.length > 2)) {
      return companies;
    }
  }
  return [];
}

/**
 * Extract company name from problem text (format: "[Company] problem text")
 */
export function extractCompanyFromProblem(problem: string): string | null {
  const match = problem.match(/^\[([^\]]+)\]\s*/);
  return match ? match[1] : null;
}

/**
 * Get clean problem text without company prefix
 */
export function getCleanProblem(problem: string): string {
  return problem.replace(/^\[([^\]]+)\]\s*/, "");
}
