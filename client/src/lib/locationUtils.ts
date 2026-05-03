/**
 * Extract city name from an address string.
 * Tries common Indian address patterns: last meaningful segment before pincode, or known city names.
 */

const knownCities = [
  "Mumbai", "Delhi", "Bangalore", "Bengaluru", "Chennai", "Hyderabad", "Kolkata",
  "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore",
  "Thane", "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad",
  "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Varanasi",
  "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad",
  "Ranchi", "Howrah", "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada",
  "Jodhpur", "Madurai", "Raipur", "Kota", "Chandigarh", "Guwahati", "Solapur",
  "Hubli", "Mysore", "Mysuru", "Tiruchirappalli", "Bareilly", "Aligarh",
  "Tiruppur", "Moradabad", "Jalandhar", "Bhubaneswar", "Salem", "Warangal",
  "Guntur", "Bhiwandi", "Saharanpur", "Gorakhpur", "Bikaner", "Amravati",
  "Noida", "Jamshedpur", "Bhilai", "Cuttack", "Firozabad", "Kochi",
  "Nellore", "Bhavnagar", "Dehradun", "Durgapur", "Asansol", "Rourkela",
  "Nanded", "Kolhapur", "Ajmer", "Akola", "Gulbarga", "Jamnagar", "Ujjain",
  "Loni", "Siliguri", "Jhansi", "Ulhasnagar", "Jammu", "Sangli", "Mangalore",
  "Erode", "Belgaum", "Kurnool", "Ambattur", "Rajahmundry", "Tirunelveli",
  "Malegaon", "Gaya", "Udaipur", "Kakinada", "Davanagere", "Kozhikode",
  "Maheshtala", "Rajpur Sonarpur", "Bokaro", "South Dumdum", "Bellary",
  "Patiala", "Gopalpur", "Agartala", "Bhagalpur", "Muzaffarnagar", "Bhatpara",
  "Panihati", "Latur", "Dhule", "Rohtak", "Sagar", "Korba", "Bhilwara",
  "Berhampur", "Muzaffarpur", "Ahmednagar", "Mathura", "Kollam", "Avadi",
  "Kadapa", "Kamarhati", "Sambalpur", "Bilaspur", "Shahjahanpur", "Satara",
  "Bijapur", "Rampur", "Shimoga", "Chandrapur", "Junagadh", "Thrissur",
  "Alwar", "Bardhaman", "Kulti", "Nizamabad", "Parbhani", "Tumkur",
  "Khammam", "Ozhukarai", "Bihar Sharif", "Panipat", "Darbhanga", "Bally",
  "Aizawl", "Dewas", "Ichalkaranji", "Karnal", "Bathinda", "Jalna",
  "Eluru", "Kirari Suleman Nagar", "Barasat",
];

export function extractCityFromAddress(address: string): string {
  if (!address) return "Unknown";

  const addressLower = address.toLowerCase();

  // Check known cities (longest match first)
  const sorted = [...knownCities].sort((a, b) => b.length - a.length);
  for (const city of sorted) {
    if (addressLower.includes(city.toLowerCase())) {
      return city;
    }
  }

  // Try to parse: split by comma, take second-to-last non-pincode segment
  const parts = address.split(",").map(p => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    // Skip last part if it looks like a state or pincode
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i].replace(/\d{6}/, "").trim();
      if (part.length > 2 && !/^\d+$/.test(part)) {
        return part;
      }
    }
  }

  return parts[0] || "Unknown";
}

/**
 * Check if a technician's area matches a customer's city
 */
export function isTechnicianNearby(techArea: string | null, customerCity: string): boolean {
  if (!techArea || !customerCity) return false;
  return techArea.toLowerCase().includes(customerCity.toLowerCase()) ||
    customerCity.toLowerCase().includes(techArea.toLowerCase());
}
