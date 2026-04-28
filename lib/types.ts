export type UserRole = 'superadmin' | 'admin' | 'professional'

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'noshow'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  organizationId?: string
  createdAt: Date
}

export interface Organization {
  id: string
  name: string
  slug: string
  email: string
  phone: string
  logo?: string
  plan: 'basic' | 'pro' | 'clinic'
  status: 'active' | 'suspended'
  createdAt: Date
}

export interface Professional {
  id: string
  name: string
  email: string
  phone: string
  specialty: string
  appointmentDuration: number // in minutes
  requiresPayment: boolean
  price?: number
  organizationId: string
  publicToken: string
  rating?: number
  status: 'active' | 'inactive'
  createdAt: Date
}

export interface Patient {
  id: string
  name: string
  phone: string
  email?: string
  notes?: string
  professionalId: string
  appointmentCount: number
  lastVisit?: Date
  createdAt: Date
}

export interface Appointment {
  id: string
  professionalId: string
  patientId: string
  patient?: Patient
  professional?: Professional
  date: Date
  time: string
  duration: number
  status: AppointmentStatus
  reason: string
  notes?: string
  cancelReason?: string
  token: string
  createdAt: Date
}

export interface Schedule {
  id: string
  professionalId: string
  dayOfWeek: number // 0-6 (Sunday-Saturday)
  isActive: boolean
  startTime: string
  endTime: string
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  highlighted?: boolean
}
