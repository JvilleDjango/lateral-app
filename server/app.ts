import express from 'express'
import { DateTime } from 'luxon'
import type { ApiError, Booking, Review } from '../shared/domain.ts'
import { bookingInputSchema, reviewInputSchema } from '../shared/schemas.ts'
import { bookings, reviews, stays } from './data/fixtures.ts'

const SERVICE_FEE_RATE = 0.12
export const app = express()

app.use(express.json())

app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))

app.get('/api/stays', (request, response) => {
  const destination = String(request.query.destination ?? '').trim().toLowerCase()
  const guests = Number(request.query.guests ?? 0)
  response.json(stays.filter((stay) => {
    const matchesDestination = !destination || stay.location.toLowerCase().includes(destination)
    const matchesGuests = !guests || stay.maxGuests >= guests
    return matchesDestination && matchesGuests
  }))
})

app.get('/api/stays/:stayId', (request, response) => {
  const stay = stays.find((candidate) => candidate.id === request.params.stayId)
  if (!stay) return respondNotFound(response, 'Stay')
  response.json(stay)
})

app.get('/api/stays/:stayId/reviews', (request, response) => {
  if (!stays.some((stay) => stay.id === request.params.stayId)) return respondNotFound(response, 'Stay')
  response.json(reviews.filter((review) => review.stayId === request.params.stayId))
})

app.post('/api/stays/:stayId/reviews', (request, response) => {
  if (!stays.some((stay) => stay.id === request.params.stayId)) return respondNotFound(response, 'Stay')
  const parsed = reviewInputSchema.safeParse(request.body)
  if (!parsed.success) return respondInvalid(response, parsed.error.flatten().fieldErrors)
  const review: Review = {
    id: crypto.randomUUID(),
    stayId: request.params.stayId,
    ...parsed.data,
    createdAt: new Date().toISOString(),
  }
  reviews.unshift(review)
  response.status(201).json(review)
})

app.post('/api/bookings', (request, response) => {
  const parsed = bookingInputSchema.safeParse(request.body)
  if (!parsed.success) return respondInvalid(response, parsed.error.flatten().fieldErrors)
  const stay = stays.find((candidate) => candidate.id === parsed.data.stayId)
  if (!stay) return respondNotFound(response, 'Stay')
  if (!stay.available || parsed.data.guests > stay.maxGuests) {
    const body: ApiError = { error: { code: 'STAY_UNAVAILABLE', message: 'This stay is not available for that party.' } }
    return response.status(409).json(body)
  }
  const checkIn = DateTime.fromISO(parsed.data.checkIn, { zone: 'utc' })
  const checkOut = DateTime.fromISO(parsed.data.checkOut, { zone: 'utc' })
  const nights = Math.round(checkOut.diff(checkIn, 'days').days)
  if (nights < 1) return respondInvalid(response, { checkOut: ['Check-out must be after check-in'] })

  const subtotal = nights * stay.pricePerNight
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE)
  const booking: Booking = {
    id: `WYF-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    stayId: stay.id,
    guestName: parsed.data.guestName,
    guestEmail: parsed.data.guestEmail,
    checkIn: parsed.data.checkIn,
    checkOut: parsed.data.checkOut,
    guests: parsed.data.guests,
    nights,
    subtotal,
    serviceFee,
    total: subtotal + serviceFee,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }
  bookings.push(booking)
  response.status(201).json(booking)
})

app.get('/api/bookings/:bookingId', (request, response) => {
  const booking = bookings.find((candidate) => candidate.id === request.params.bookingId)
  if (!booking) return respondNotFound(response, 'Booking')
  response.json(booking)
})

function respondNotFound(response: express.Response, resource: string) {
  const body: ApiError = { error: { code: 'NOT_FOUND', message: `${resource} not found.` } }
  return response.status(404).json(body)
}

function respondInvalid(response: express.Response, fields: Record<string, string[] | undefined>) {
  const normalizedFields = Object.fromEntries(
    Object.entries(fields).filter((entry): entry is [string, string[]] => Boolean(entry[1])),
  )
  const body: ApiError = {
    error: { code: 'VALIDATION_ERROR', message: 'Please correct the highlighted fields.', fields: normalizedFields },
  }
  return response.status(400).json(body)
}
