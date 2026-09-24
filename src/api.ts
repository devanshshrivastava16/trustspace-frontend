const API_URL = import.meta.env.VITE_API_URL;

// In development, use /api proxy path
// In production, use full URL from env if set, otherwise /api
export const API_BASE_URL = import.meta.env.DEV 
  ? '/api' 
  : (API_URL ? `${API_URL}/api` : '/api');

export async function request<T>(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API request failed');
  }

  return (await response.json()) as T;
}

export function getToken() {
  return localStorage.getItem('trustspace_access_token');
}

export function requestWithAuth<T>(path: string, options: RequestInit = {}) {
  const token = getToken();
  return request<T>(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });
}

// --- Auth APIs ---

export async function login(email: string, password: string) {
  return request<any>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function registerUser(payload: { fullName: string; email: string; password: string; phone?: string; cityId?: number }) {
  return request<any>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function logoutUser() {
  localStorage.removeItem('trustspace_access_token');
  localStorage.removeItem('trustspace_selected_city');
  window.location.href = '/login';
}

// --- Chat APIs ---
export function getChatRooms() {
  return requestWithAuth<any[]>('/chat/rooms');
}

export function getChatMessages(roomId: number | string) {
  return requestWithAuth<any[]>(`/chat/rooms/${roomId}/messages`);
}

export function sendMessage(payload: { receiverId: number; content: string; propertyId?: number }) {
  return requestWithAuth<any>('/chat/messages', { method: 'POST', body: JSON.stringify(payload) });
}

export function markMessageAsRead(messageId: number) {
  return requestWithAuth<any>(`/chat/messages/${messageId}/read`, { method: 'PUT' });
}

export function getUnreadChatCount() {
  return requestWithAuth<{ count: number }>('/chat/unread-count');
}

// --- User Management APIs ---

export function getCurrentUser() {
  return requestWithAuth<any>('/users/me');
}

export function updateUserProfile(payload: {
  fullName?: string;
  phone?: string;
  bio?: string;
  cityId?: number;
  profileImage?: string;
}) {
  return requestWithAuth<any>('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export async function uploadProfileImage(file: File) {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/users/profile/image`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` })
      // Browser automatically sets Content-Type to multipart/form-data with the correct boundary
    },
    body: formData
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Image upload failed');
  }

  return await response.json();
}

export function changePassword(payload: { currentPassword: string; newPassword: string }) {
  return requestWithAuth<any>('/users/change-password', {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function deleteAccount() {
  return requestWithAuth<any>('/users/account', {
    method: 'DELETE'
  });
}

// --- City APIs ---

export function getCities() {
  return request<any[]>('/cities');
}

export function getTrendingCities() {
  return request<any[]>('/cities/trending');
}

// --- Property APIs ---

export function getProperties(cityId?: number, query?: Record<string, string | number | boolean>) {
  const params = new URLSearchParams({ ...(query || {}) as Record<string, string> });
  return request<any>(`/properties/public/city/${cityId ?? ''}?${params.toString()}`);
}

export function getPropertyById(propertyId: string | number) {
  return request<any>(`/properties/public/${propertyId}`);
}

// --- Booking APIs ---

export async function createBooking(payload: {
  propertyId: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  numberOfGuests: number;
  specialRequests?: string;
}) {
  return requestWithAuth<any>('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getMyBookings() {
  return requestWithAuth<any[]>('/bookings/my-bookings');
}

export function getBookingById(bookingId: number) {
  return requestWithAuth<any>(`/bookings/${bookingId}`);
}

export function cancelBooking(bookingId: number, reason?: string) {
  const query = reason ? `?reason=${encodeURIComponent(reason)}` : '';
  return requestWithAuth<any>(`/bookings/${bookingId}/cancel${query}`, {
    method: 'PUT'
  });
}

export function getMyProperties() {
  return requestWithAuth<any[]>('/properties/my-properties');
}

export function getOwnerBookings() {
  return requestWithAuth<any[]>('/bookings/owner');
}

export function getPropertyBookings(propertyId: string | number) {
  return requestWithAuth<any[]>(`/bookings/property/${propertyId}`);
}

export function approveBooking(bookingId: number) {
  return requestWithAuth<any>(`/bookings/${bookingId}/approve`, {
    method: 'PUT'
  });
}

export function rejectBooking(bookingId: number) {
  return requestWithAuth<any>(`/bookings/${bookingId}/reject`, {
    method: 'PUT'
  });
}

// --- Wishlist APIs ---
export function getWishlist() {
  return requestWithAuth<any[]>('/wishlist');
}

export function checkWishlistStatus(propertyId: number | string) {
  return requestWithAuth<{ isWishlisted: boolean }>(`/wishlist/${propertyId}/check`);
}

export function addToWishlist(propertyId: number | string) {
  return requestWithAuth<any>(`/wishlist/${propertyId}`, { method: 'POST' });
}

export function removeFromWishlist(propertyId: number | string) {
  return requestWithAuth<any>(`/wishlist/${propertyId}`, { method: 'DELETE' });
}
// --- Review APIs ---
export function createReview(payload: { propertyId: number; bookingId: number; rating: number; comment?: string }) {
  return requestWithAuth<any>('/reviews', { method: 'POST', body: JSON.stringify(payload) });
}

export function updateReview(reviewId: number, payload: { rating: number; comment?: string }) {
  return requestWithAuth<any>(`/reviews/${reviewId}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export function deleteReview(reviewId: number) {
  return requestWithAuth<any>(`/reviews/${reviewId}`, { method: 'DELETE' });
}

export function getMyReviews() {
  return requestWithAuth<any[]>('/reviews/my-reviews');
}

export function getPaginatedPropertyReviews(propertyId: number | string, page: number = 0, size: number = 5) {
  return request<any>(`/reviews/property/${propertyId}/paginated?page=${page}&size=${size}`);
}

export function getAverageRating(propertyId: number | string) {
  return request<{ averageRating: number; totalReviews: number }>(`/reviews/property/${propertyId}/average-rating`);
}

// --- Amenity APIs ---
export function getAmenities() {
  return request<any[]>('/amenities');
}

export async function createProperty(payload: {
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
}) {
  return requestWithAuth<any>('/properties', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function uploadPropertyImages(propertyId: number, files: File[]) {
  const token = getToken();
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/images`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: formData
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Image upload failed');
  }

  return response.json();
}

export async function verifyEmail(token: string) {
  return request<any>(`/auth/verify-email?token=${encodeURIComponent(token)}`);
}

export async function forgotPassword(email: string) {
  return request<any>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

export async function resetPassword(token: string, newPassword: string) {
  return request<any>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword })
  });
}

// --- Review APIs ---
export function getPropertyReviews(propertyId: string | number) {
  return request<any[]>(`/reviews/property/${propertyId}`);
}

// --- Wishlist APIs ---
export function toggleWishlist(propertyId: string | number, isCurrentlyWishlisted: boolean) {
  if (isCurrentlyWishlisted) {
    return requestWithAuth<any>(`/wishlist/${propertyId}`, { method: 'DELETE' });
  } else {
    return requestWithAuth<any>(`/wishlist/${propertyId}`, { method: 'POST' });
  }
}