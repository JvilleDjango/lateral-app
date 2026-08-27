import type { Booking, Review, Stay } from "../../shared/domain.ts";

// Mutable in-memory fixtures keep the assessment self-contained and reset on server restart.
export const stays: Stay[] = [
  {
    id: "desert-glass-house",
    name: "The Glass House",
    location: "Joshua Tree, California",
    description:
      "A quiet desert retreat with open views, an outdoor soaking tub, and room to slow down.",
    imageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Modern glass-walled desert house at sunset",
    pricePerNight: 289,
    rating: 4.92,
    reviewCount: 128,
    maxGuests: 4,
    amenities: ["Desert view", "Hot tub", "Full kitchen", "Fast Wi-Fi"],
    available: true,
  },
  {
    id: "pacific-a-frame",
    name: "Pacific A-Frame",
    location: "Mendocino, California",
    description:
      "A redwood-framed cabin minutes from the coast, made for fireside evenings and forest walks.",
    imageUrl:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Warmly lit A-frame cabin surrounded by trees",
    pricePerNight: 244,
    rating: 4.86,
    reviewCount: 94,
    maxGuests: 3,
    amenities: ["Forest view", "Fireplace", "Record player", "EV charger"],
    available: true,
  },
  {
    id: "sonoran-casita",
    name: "Sonoran Casita",
    location: "Tucson, Arizona",
    description:
      "An adobe guesthouse with a shaded courtyard, mountain views, and the best of Tucson nearby.",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Adobe-style casita with a landscaped courtyard",
    pricePerNight: 178,
    rating: 4.79,
    reviewCount: 73,
    maxGuests: 2,
    amenities: ["Mountain view", "Pool", "Patio", "Workspace"],
    available: true,
  },
  {
    id: "alpine-lookout",
    name: "Alpine Lookout",
    location: "Whitefish, Montana",
    description:
      "A modern mountain cabin with trail access and broad views toward Glacier National Park.",
    imageUrl:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Wood cabin beneath snow-covered mountains",
    pricePerNight: 326,
    rating: 4.95,
    reviewCount: 156,
    maxGuests: 6,
    amenities: ["Mountain view", "Sauna", "Fireplace", "Trail access"],
    available: false,
  },
  {
    id: "hudson-loft",
    name: "Warren Street Loft",
    location: "Hudson, New York",
    description:
      "A light-filled loft above Warren Street, close to galleries, restaurants, and the train station.",
    imageUrl:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Bright loft living room with large windows",
    pricePerNight: 215,
    rating: 4.83,
    reviewCount: 61,
    maxGuests: 2,
    amenities: ["Walkable location", "King bed", "Full kitchen", "Fast Wi-Fi"],
    available: true,
  },
];

export const reviews: Review[] = [
  {
    id: "review-1",
    stayId: "desert-glass-house",
    author: "Maya",
    rating: 5,
    comment:
      "The sunset views were remarkable and the house was even calmer than it looked in the photos.",
    createdAt: "2026-07-18T15:30:00.000Z",
  },
  {
    id: "review-2",
    stayId: "desert-glass-house",
    author: "Theo",
    rating: 5,
    comment: "Thoughtful details throughout, reliable Wi-Fi, and an easy drive into town.",
    createdAt: "2026-06-29T18:10:00.000Z",
  },
  {
    id: "review-3",
    stayId: "sonoran-casita",
    author: "Lena",
    rating: 5,
    comment: "A beautiful courtyard and a genuinely useful local guide from the hosts.",
    createdAt: "2026-08-02T21:45:00.000Z",
  },
];

export const bookings: Booking[] = [];
