export type BookingStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus =
  | 'PENDING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED';

export interface City {
  id: number;
  name: string;
  state?: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'USER' | 'OWNER' | string;
  profileImage?: string;
  city?: City;
}

export interface PropertyImage {
  id?: number;
  imageUrl: string;
  isPrimary?: boolean;
}

export interface Amenity {
  id: number;
  name: string;
  icon?: string;
  description?: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  images: { id: number; imageUrl: string }[];
  user: { id: number; fullName: string; profileImage: string | null };
  property: { id: number; title: string; images: any[] };
  createdAt: string;
}

export interface Property {
  id: number;
  title: string;
  description?: string;
  propertyType?: string;
  city?: City;
  address?: string;
  latitude?: number;
  longitude?: number;
  hourlyPrice?: number;
  dailyPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingAvailable?: boolean;
  furnished?: boolean;
  guestCapacity?: number;
  size?: number;
  amenityIds?: number[];
  amenities?: { id: number; name: string }[];
  status?: string;
  images?: PropertyImage[];
  bookingCount?: number;
  pendingRequests?: number;
  owner?: User;
}

export interface Booking {
  id: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  bookingDate: string;
  startTime: string;
  endTime: string;
  numberOfGuests: number;
  totalAmount?: number;
  specialRequests?: string;
  cancellationReason?: string;
  property?: Property;
  user?: User;
}

export interface PropertyCreatePayload {
  title: string;
  description: string;
  propertyType: string;
  cityId: number;
  address: string;
  latitude: number;
  longitude: number;
  hourlyPrice: number;
  dailyPrice: number;
  bedrooms: number;
  bathrooms: number;
  parkingAvailable: boolean;
  furnished: boolean;
  guestCapacity: number;
  size: number;
  amenityIds: number[];
}
