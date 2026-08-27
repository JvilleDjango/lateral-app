export interface Stay {
  id: string
  name: string
  location: string
  description: string
  imageUrl: string
  imageAlt: string
  pricePerNight: number
  rating: number
  reviewCount: number
  maxGuests: number
  amenities: string[]
  available: boolean
}

export interface Review {
  id: string
  stayId: string
  author: string
  rating: number
  comment: string
  createdAt: string
}

export interface Booking {
  id: string
  stayId: string
  guestName: string
  guestEmail: string
  checkIn: string
  checkOut: string
  guests: number
  nights: number
  subtotal: number
  serviceFee: number
  total: number
  status: 'confirmed'
  createdAt: string
}

export interface ApiError {
  error: {
    code: string
    message: string
    fields?: Record<string, string[]>
  }
}
