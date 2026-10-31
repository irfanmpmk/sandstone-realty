// Fictional demo listings in real Dubai areas. Prices are realistic for 2026 but invented.
// Photos: free stock photos in public/photos/p-NN.jpg (cover first, then interiors).

export interface SeedProperty {
  slug: string;
  title: string;
  purpose: "sale" | "rent";
  type: "apartment" | "villa" | "townhouse" | "penthouse";
  area: string;
  price: number; // AED; yearly for rentals
  beds: number; // 0 = studio
  baths: number;
  sizeSqft: number;
  furnished: boolean;
  completion: string | null; // off-plan handover, null when ready
  lat: number;
  lng: number;
  description: string;
  amenities: string[];
  images: string[];
  agent: string;
  featured: boolean;
}

const photos = (...n: number[]) => n.map((i) => `/photos/p-${String(i).padStart(2, "0")}.jpg`);

export const seedProperties: SeedProperty[] = [
  {
    slug: "marina-view-2-bed-apartment",
    title: "2-bed apartment with full marina view",
    purpose: "sale", type: "apartment", area: "Dubai Marina",
    price: 2_350_000, beds: 2, baths: 3, sizeSqft: 1_320, furnished: false, completion: null,
    lat: 25.0812, lng: 55.1398,
    description:
      "Bright corner unit on a high floor with floor-to-ceiling windows over the marina. Open kitchen, a balcony off the living room, and a master suite with a walk-in wardrobe. A short walk to the tram, the beach and Marina Walk.",
    amenities: ["Marina view", "Balcony", "Pool", "Gym", "Covered parking", "Concierge"],
    images: photos(16, 9, 23), agent: "Sara Haddad", featured: true,
  },
  {
    slug: "palm-signature-5-bed-villa",
    title: "5-bed beachfront villa on the Palm",
    purpose: "sale", type: "villa", area: "Palm Jumeirah",
    price: 18_500_000, beds: 5, baths: 6, sizeSqft: 7_100, furnished: true, completion: null,
    lat: 25.1162, lng: 55.1335,
    description:
      "Private beach access, an infinity pool and views back to the skyline. Double-height living room, a chef's kitchen, cinema room and staff quarters. Upgraded and fully furnished; ready to move in.",
    amenities: ["Private beach", "Private pool", "Garden", "Maid's room", "Cinema room", "Smart home"],
    images: photos(34, 14, 25), agent: "Omar Khalil", featured: true,
  },
  {
    slug: "downtown-1-bed-boulevard",
    title: "1-bed apartment on the Boulevard",
    purpose: "sale", type: "apartment", area: "Downtown Dubai",
    price: 1_850_000, beds: 1, baths: 2, sizeSqft: 860, furnished: false, completion: null,
    lat: 25.1955, lng: 55.2758,
    description:
      "Well-kept one-bedroom steps from the mall and the fountain. Study nook, built-in wardrobes and a balcony facing the Boulevard. Currently vacant, suitable for living or holiday letting.",
    amenities: ["City view", "Balcony", "Pool", "Gym", "Kids' play area", "24h security"],
    images: photos(7, 15, 24), agent: "Sara Haddad", featured: false,
  },
  {
    slug: "business-bay-1-bed-canal-rent",
    title: "Furnished 1-bed by the canal",
    purpose: "rent", type: "apartment", area: "Business Bay",
    price: 95_000, beds: 1, baths: 1, sizeSqft: 780, furnished: true, completion: null,
    lat: 25.1862, lng: 55.2631,
    description:
      "Modern furnished apartment overlooking the Dubai Water Canal, ten minutes from DIFC. Chiller-free, with a large balcony and access to the rooftop pool. Available now; up to four cheques.",
    amenities: ["Canal view", "Furnished", "Chiller free", "Rooftop pool", "Gym", "Covered parking"],
    images: photos(26, 25, 12), agent: "Rahul Menon", featured: true,
  },
  {
    slug: "jvc-studio-rent",
    title: "Studio with balcony in JVC",
    purpose: "rent", type: "apartment", area: "Jumeirah Village Circle",
    price: 55_000, beds: 0, baths: 1, sizeSqft: 450, furnished: false, completion: null,
    lat: 25.0603, lng: 55.2068,
    description:
      "Efficient studio in a new building with a fitted kitchen and a private balcony. Pool, gym and parking included. Easy access to Al Khail Road.",
    amenities: ["Balcony", "Pool", "Gym", "Parking", "Pets allowed"],
    images: photos(2, 18, 33), agent: "Aisha Rahman", featured: false,
  },
  {
    slug: "arabian-ranches-4-bed-villa-rent",
    title: "4-bed family villa backing the park",
    purpose: "rent", type: "villa", area: "Arabian Ranches",
    price: 320_000, beds: 4, baths: 5, sizeSqft: 3_900, furnished: false, completion: null,
    lat: 25.0548, lng: 55.2673,
    description:
      "Single-row villa backing onto the community park. Landscaped garden, upgraded kitchen, maid's room and a two-car garage. Walking distance to schools and the community centre.",
    amenities: ["Garden", "Park backing", "Maid's room", "Garage", "Community pool", "Near schools"],
    images: photos(19, 32, 27), agent: "Omar Khalil", featured: true,
  },
  {
    slug: "dubai-hills-3-bed-townhouse-offplan",
    title: "3-bed townhouse, handover 2027",
    purpose: "sale", type: "townhouse", area: "Dubai Hills Estate",
    price: 3_900_000, beds: 3, baths: 4, sizeSqft: 2_450, furnished: false, completion: "Q4 2027",
    lat: 25.1138, lng: 55.2462,
    description:
      "Off-plan townhouse in a new cluster next to the central park, with a 60/40 payment plan. Rooftop terrace, private garden and a shared pool. Ten minutes to Downtown.",
    amenities: ["Payment plan", "Roof terrace", "Private garden", "Park view", "Shared pool"],
    images: photos(11, 13, 28), agent: "Aisha Rahman", featured: true,
  },
  {
    slug: "jlt-2-bed-lake-view-rent",
    title: "2-bed with lake view in JLT",
    purpose: "rent", type: "apartment", area: "Jumeirah Lake Towers",
    price: 120_000, beds: 2, baths: 2, sizeSqft: 1_150, furnished: false, completion: null,
    lat: 25.0693, lng: 55.1428,
    description:
      "Spacious two-bedroom overlooking the lakes, two minutes from the metro. Laundry room, built-in wardrobes and a large living area. Restaurants and cafés at the doorstep.",
    amenities: ["Lake view", "Near metro", "Pool", "Gym", "Covered parking"],
    images: photos(21, 29, 12), agent: "Rahul Menon", featured: false,
  },
  {
    slug: "creek-harbour-2-bed-offplan",
    title: "2-bed waterfront apartment, handover 2028",
    purpose: "sale", type: "apartment", area: "Dubai Creek Harbour",
    price: 2_600_000, beds: 2, baths: 2, sizeSqft: 1_210, furnished: false, completion: "Q2 2028",
    lat: 25.2031, lng: 55.3462,
    description:
      "Off-plan waterfront apartment with views of the creek and the skyline. 70/30 payment plan with 10% on booking. Access to the boardwalk, retail promenade and a large park.",
    amenities: ["Payment plan", "Creek view", "Boardwalk", "Pool", "Gym"],
    images: photos(22, 23, 9), agent: "Sara Haddad", featured: false,
  },
  {
    slug: "downtown-4-bed-penthouse",
    title: "4-bed penthouse with skyline terrace",
    purpose: "sale", type: "penthouse", area: "Downtown Dubai",
    price: 12_900_000, beds: 4, baths: 5, sizeSqft: 5_200, furnished: true, completion: null,
    lat: 25.1931, lng: 55.2789,
    description:
      "Duplex penthouse with a wraparound terrace and plunge pool facing the skyline. Private lift lobby, designer interiors and four parking spaces.",
    amenities: ["Plunge pool", "Terrace", "Private lift", "Skyline view", "Furnished", "4 parking spaces"],
    images: photos(31, 30, 13), agent: "Omar Khalil", featured: true,
  },
  {
    slug: "jvc-1-bed-investor",
    title: "1-bed investor unit, tenanted",
    purpose: "sale", type: "apartment", area: "Jumeirah Village Circle",
    price: 850_000, beds: 1, baths: 2, sizeSqft: 720, furnished: false, completion: null,
    lat: 25.0571, lng: 55.2112,
    description:
      "Tenanted until March 2027 at AED 72,000 a year, an 8.5% gross yield. Good layout with a balcony and a guest washroom. Sold with the tenant in place.",
    amenities: ["Tenanted", "Balcony", "Pool", "Gym", "Parking"],
    images: photos(8, 24, 18), agent: "Aisha Rahman", featured: false,
  },
  {
    slug: "dubai-hills-5-bed-villa",
    title: "5-bed villa on the golf course",
    purpose: "sale", type: "villa", area: "Dubai Hills Estate",
    price: 9_750_000, beds: 5, baths: 6, sizeSqft: 6_300, furnished: false, completion: null,
    lat: 25.1094, lng: 55.2511,
    description:
      "Contemporary villa with direct golf course views, a private pool and a landscaped garden. Five en-suite bedrooms, a family room upstairs and a separate maid's room.",
    amenities: ["Golf view", "Private pool", "Garden", "Maid's room", "Garage", "Smart home"],
    images: photos(20, 29, 27), agent: "Rahul Menon", featured: false,
  },
];

// Example leads so the admin panel has something to show. Names and numbers are made up.
export const seedEnquiries = [
  { property: "marina-view-2-bed-apartment", name: "Daniel Fischer", phone: "+971 50 000 0101", email: "daniel@example.com", message: "Is the price negotiable? Looking to buy within a month.", viewingInDays: 2, status: "viewing", notes: "Viewing booked with Sara.", hoursAgo: 30 },
  { property: "business-bay-1-bed-canal-rent", name: "Priya Sharma", phone: "+971 55 000 0202", email: "priya@example.com", message: "Can I pay in 2 cheques? Moving from Abu Dhabi.", viewingInDays: null, status: "contacted", notes: "Called, owner accepts 2 cheques.", hoursAgo: 52 },
  { property: "palm-signature-5-bed-villa", name: "Ahmed Al Mansoori", phone: "+971 52 000 0303", email: null, message: "Please share the floor plan and service charges.", viewingInDays: null, status: "new", notes: "", hoursAgo: 3 },
  { property: "dubai-hills-3-bed-townhouse-offplan", name: "Elena Petrova", phone: "+971 58 000 0404", email: "elena@example.com", message: "What is the payment plan after handover?", viewingInDays: null, status: "negotiating", notes: "Sent payment plan PDF. Waiting on mortgage pre-approval.", hoursAgo: 96 },
  { property: "jvc-studio-rent", name: "Kevin Joseph", phone: "+971 56 000 0505", email: null, message: "Available from next week?", viewingInDays: 1, status: "new", notes: "", hoursAgo: 8 },
  { property: "jvc-1-bed-investor", name: "Martin Clarke", phone: "+44 7700 900123", email: "martin@example.com", message: "Investor from the UK. Can you share the tenancy contract?", viewingInDays: null, status: "won", notes: "MOU signed.", hoursAgo: 240 },
  { property: null, name: "Fatima Noor", phone: "+971 50 000 0707", email: "fatima@example.com", message: "Looking for a 3-bed villa to rent in Arabian Ranches or Dubai Hills, budget 300k.", viewingInDays: null, status: "new", notes: "", hoursAgo: 14 },
  { property: "arabian-ranches-4-bed-villa-rent", name: "Tom Becker", phone: "+971 54 000 0808", email: null, message: "Is the garden maintained by the landlord?", viewingInDays: null, status: "lost", notes: "Chose another community.", hoursAgo: 300 },
];
