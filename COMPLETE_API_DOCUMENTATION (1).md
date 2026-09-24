# 📚 TrustSpace API Documentation - Complete Reference

**Base URL:** `https://trustspace-backend.onrender.com/api`  
**Version:** 1.0.0  
**Last Updated:** January 2024

---

## 📋 Table of Contents

1. [Authentication APIs](#1-authentication-apis)
2. [User Management APIs](#2-user-management-apis)
3. [City APIs](#3-city-apis)
4. [Amenity APIs](#4-amenity-apis)
5. [Property Management APIs](#5-property-management-apis)
6. [Booking Management APIs](#6-booking-management-apis)
7. [Review & Rating APIs](#7-review--rating-apis)
8. [Wishlist APIs](#8-wishlist-apis)
9. [Chat & Messaging APIs](#9-chat--messaging-apis)
10. [Notification APIs](#10-notification-apis)
11. [Error Responses](#11-error-responses)
12. [Status Codes](#12-status-codes)

---

## 1. Authentication APIs

### 1.1 Register User

**Endpoint:** `POST /auth/register`  
**Authentication:** Not required  
**Description:** Register a new user account

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123",
  "phone": "9876543210",
  "cityId": 1
}
```

**Validation Rules:**
- `fullName`: Required, 2-100 characters
- `email`: Required, valid email format
- `password`: Required, min 8 characters, must contain uppercase, lowercase, and digit
- `phone`: Optional, 10-15 digits
- `cityId`: Optional

**Success Response (201 Created):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTcwNTg0MDAwMCwiZXhwIjoxNzA1OTI2NDAwfQ.signature",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTcwNTg0MDAwMCwiZXhwIjoxNzA2NDQ0ODAwfQ.signature",
  "tokenType": "Bearer",
  "userId": 1,
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "role": "USER",
  "isVerified": false
}
```

**Error Response (400 Bad Request):**
```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "email": "Email already exists",
    "password": "Password must contain at least one uppercase letter, one lowercase letter, and one digit"
  },
  "timestamp": "2024-01-20T10:30:00"
}
```

---

### 1.2 Login User

**Endpoint:** `POST /auth/login`  
**Authentication:** Not required  
**Description:** Authenticate user and receive JWT tokens

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "userId": 1,
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "role": "OWNER",
  "isVerified": true
}
```

**Error Response (401 Unauthorized):**
```json
{
  "status": 401,
  "message": "Invalid email or password",
  "timestamp": "2024-01-20T10:30:00"
}
```

---

### 1.3 Refresh Access Token

**Endpoint:** `POST /auth/refresh-token`  
**Authentication:** Not required  
**Description:** Get new access token using refresh token

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "userId": 1,
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "role": "OWNER",
  "isVerified": true
}
```

---

### 1.4 Verify Email

**Endpoint:** `GET /auth/verify-email?token={verificationToken}`  
**Authentication:** Not required  
**Description:** Verify user email address using token from email

**Query Parameters:**
- `token` (required): Email verification token

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": null
}
```

**Error Response (400 Bad Request):**
```json
{
  "status": 400,
  "message": "Invalid verification token",
  "timestamp": "2024-01-20T10:30:00"
}
```

---

### 1.5 Forgot Password

**Endpoint:** `POST /auth/forgot-password`  
**Authentication:** Not required  
**Description:** Request password reset email

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset email sent",
  "data": null
}
```

---

### 1.6 Reset Password

**Endpoint:** `POST /auth/reset-password`  
**Authentication:** Not required  
**Description:** Reset password using token from email

**Request Body:**
```json
{
  "token": "password-reset-token-from-email",
  "newPassword": "NewSecurePass123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": null
}
```

---

## 2. User Management APIs

### 2.1 Get Current User Profile

**Endpoint:** `GET /users/me`  
**Authentication:** Required (Bearer Token)  
**Description:** Get currently authenticated user's profile

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "phone": "9876543210",
  "profileImage": "https://res.cloudinary.com/trustspace/image/upload/v1705840000/profiles/user1.jpg",
  "bio": "Property owner and real estate enthusiast",
  "city": {
    "id": 1,
    "name": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "imageUrl": "https://res.cloudinary.com/trustspace/image/upload/v1705840000/cities/mumbai.jpg",
    "isTrending": true,
    "propertyCount": 45
  },
  "role": "OWNER",
  "isVerified": true,
  "createdAt": "2024-01-15T10:30:00"
}
```

---

### 2.2 Get User By ID

**Endpoint:** `GET /users/{userId}`  
**Authentication:** Not required  
**Description:** Get public profile of any user by their ID

**Path Parameters:**
- `userId` (required): User ID

**Success Response (200 OK):**
```json
{
  "id": 2,
  "fullName": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": null,
  "profileImage": "https://res.cloudinary.com/trustspace/image/upload/v1705840000/profiles/user2.jpg",
  "bio": "Looking for event spaces in Mumbai",
  "city": {
    "id": 1,
    "name": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "imageUrl": "https://res.cloudinary.com/trustspace/image/upload/v1705840000/cities/mumbai.jpg",
    "isTrending": true,
    "propertyCount": 45
  },
  "role": "USER",
  "isVerified": true,
  "createdAt": "2024-01-10T08:20:00"
}
```

---

### 2.3 Update User Profile

**Endpoint:** `PUT /users/profile`  
**Authentication:** Required (Bearer Token)  
**Description:** Update current user's profile information

**Request Body:**
```json
{
  "fullName": "John Doe Updated",
  "phone": "9876543211",
  "bio": "Experienced property owner with 10+ years in real estate",
  "cityId": 2,
  "profileImage": "https://res.cloudinary.com/trustspace/image/upload/v1705850000/profiles/user1-new.jpg"
}
```

**All fields are optional**

**Success Response (200 OK):**
```json
{
  "id": 1,
  "fullName": "John Doe Updated",
  "email": "john.doe@example.com",
  "phone": "9876543211",
  "profileImage": "https://res.cloudinary.com/trustspace/image/upload/v1705850000/profiles/user1-new.jpg",
  "bio": "Experienced property owner with 10+ years in real estate",
  "city": {
    "id": 2,
    "name": "Delhi",
    "state": "Delhi",
    "country": "India",
    "imageUrl": "https://res.cloudinary.com/trustspace/image/upload/v1705840000/cities/delhi.jpg",
    "isTrending": true,
    "propertyCount": 38
  },
  "role": "OWNER",
  "isVerified": true,
  "createdAt": "2024-01-15T10:30:00"
}
```

---

### 2.4 Upload Profile Image

**Endpoint:** `POST /users/profile/image`  
**Authentication:** Required (Bearer Token)  
**Description:** Upload/update user profile image to Cloudinary

**Request:**
- Content-Type: `multipart/form-data`
- Form field: `file` (image file)

**cURL Example:**
```bash
curl -X POST https://trustspace-backend.onrender.com/api/users/profile/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/profile.jpg"
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "phone": "9876543210",
  "profileImage": "https://res.cloudinary.com/trustspace/image/upload/v1705851234/profiles/abc123.jpg",
  "bio": "Property owner and real estate enthusiast",
  "city": { ... },
  "role": "OWNER",
  "isVerified": true,
  "createdAt": "2024-01-15T10:30:00"
}
```

---

### 2.5 Change Password

**Endpoint:** `PUT /users/change-password`  
**Authentication:** Required (Bearer Token)  
**Description:** Change current user's password

**Request Body:**
```json
{
  "currentPassword": "OldSecurePass123",
  "newPassword": "NewSecurePass456"
}
```

**Validation:**
- `newPassword`: Min 8 characters, must contain uppercase, lowercase, and digit

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": null
}
```

**Error Response (400 Bad Request):**
```json
{
  "status": 400,
  "message": "Current password is incorrect",
  "timestamp": "2024-01-20T10:30:00"
}
```

---

### 2.6 Delete Account

**Endpoint:** `DELETE /users/account`  
**Authentication:** Required (Bearer Token)  
**Description:** Permanently delete current user's account

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Account deleted successfully",
  "data": null
}
```

---

### 2.7 Get All Users (Admin Only)

**Endpoint:** `GET /users`  
**Authentication:** Required (Bearer Token - ADMIN role)  
**Description:** Get list of all users

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "9876543210",
    "profileImage": "https://...",
    "bio": "Property owner...",
    "city": { ... },
    "role": "OWNER",
    "isVerified": true,
    "createdAt": "2024-01-15T10:30:00"
  },
  {
    "id": 2,
    "fullName": "Jane Smith",
    "email": "jane.smith@example.com",
    ...
  }
]
```

---

## 3. City APIs

### 3.1 Get All Cities

**Endpoint:** `GET /cities`  
**Authentication:** Not required  
**Description:** Get list of all available cities

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "imageUrl": "https://res.cloudinary.com/trustspace/image/upload/v1705840000/cities/mumbai.jpg",
    "isTrending": true,
    "propertyCount": 45
  },
  {
    "id": 2,
    "name": "Delhi",
    "state": "Delhi",
    "country": "India",
    "imageUrl": "https://res.cloudinary.com/trustspace/image/upload/v1705840000/cities/delhi.jpg",
    "isTrending": true,
    "propertyCount": 38
  },
  {
    "id": 3,
    "name": "Bangalore",
    "state": "Karnataka",
    "country": "India",
    "imageUrl": "https://res.cloudinary.com/trustspace/image/upload/v1705840000/cities/bangalore.jpg",
    "isTrending": true,
    "propertyCount": 52
  },
  {
    "id": 4,
    "name": "Gwalior",
    "state": "Madhya Pradesh",
    "country": "India",
    "imageUrl": "https://res.cloudinary.com/trustspace/image/upload/v1705840000/cities/gwalior.jpg",
    "isTrending": false,
    "propertyCount": 12
  }
]
```

---

### 3.2 Get Trending Cities

**Endpoint:** `GET /cities/trending`  
**Authentication:** Not required  
**Description:** Get list of trending cities only

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "imageUrl": "https://res.cloudinary.com/trustspace/image/upload/v1705840000/cities/mumbai.jpg",
    "isTrending": true,
    "propertyCount": 45
  },
  {
    "id": 2,
    "name": "Delhi",
    "state": "Delhi",
    "country": "India",
    "imageUrl": "https://res.cloudinary.com/trustspace/image/upload/v1705840000/cities/delhi.jpg",
    "isTrending": true,
    "propertyCount": 38
  }
]
```

---

### 3.3 Get City By ID

**Endpoint:** `GET /cities/{cityId}`  
**Authentication:** Not required  
**Description:** Get details of a specific city

**Path Parameters:**
- `cityId` (required): City ID

**Success Response (200 OK):**
```json
{
  "id": 1,
  "name": "Mumbai",
  "state": "Maharashtra",
  "country": "India",
  "imageUrl": "https://res.cloudinary.com/trustspace/image/upload/v1705840000/cities/mumbai.jpg",
  "isTrending": true,
  "propertyCount": 45
}
```

---

### 3.4 Get City By Name

**Endpoint:** `GET /cities/name/{cityName}`  
**Authentication:** Not required  
**Description:** Get city details by name

**Path Parameters:**
- `cityName` (required): City name (e.g., "Mumbai")

**Success Response (200 OK):**
```json
{
  "id": 1,
  "name": "Mumbai",
  "state": "Maharashtra",
  "country": "India",
  "imageUrl": "https://res.cloudinary.com/trustspace/image/upload/v1705840000/cities/mumbai.jpg",
  "isTrending": true,
  "propertyCount": 45
}
```

---

## 4. Amenity APIs

### 4.1 Get All Amenities

**Endpoint:** `GET /amenities`  
**Authentication:** Not required  
**Description:** Get list of all available amenities

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "WiFi",
    "icon": "wifi",
    "description": "High-speed internet connection"
  },
  {
    "id": 2,
    "name": "AC",
    "icon": "ac",
    "description": "Air conditioning"
  },
  {
    "id": 3,
    "name": "Parking",
    "icon": "parking",
    "description": "Vehicle parking space"
  },
  {
    "id": 4,
    "name": "Sound System",
    "icon": "sound",
    "description": "Professional audio system"
  },
  {
    "id": 5,
    "name": "Kitchen",
    "icon": "kitchen",
    "description": "Full kitchen facilities"
  },
  {
    "id": 6,
    "name": "Decoration",
    "icon": "decoration",
    "description": "Event decoration services"
  },
  {
    "id": 7,
    "name": "Swimming Pool",
    "icon": "pool",
    "description": "Swimming pool access"
  },
  {
    "id": 8,
    "name": "CCTV",
    "icon": "security",
    "description": "CCTV surveillance"
  },
  {
    "id": 9,
    "name": "Stage",
    "icon": "stage",
    "description": "Event stage/platform"
  },
  {
    "id": 10,
    "name": "Furniture",
    "icon": "furniture",
    "description": "Furnished space"
  },
  {
    "id": 11,
    "name": "Power Backup",
    "icon": "power",
    "description": "Generator backup"
  }
]
```

---

## 5. Property Management APIs

### 5.1 Create Property

**Endpoint:** `POST /properties`  
**Authentication:** Required (Bearer Token)  
**Description:** Create a new property listing (User becomes OWNER automatically)

**Request Body:**
```json
{
  "title": "Luxury Banquet Hall - Perfect for Weddings",
  "description": "Spacious 10,000 sq ft banquet hall with state-of-the-art facilities. Perfect for weddings, corporate events, and large gatherings. Features include professional sound system, LED lighting, elegant décor, and dedicated parking space for 100+ vehicles.",
  "propertyType": "BANQUET",
  "cityId": 1,
  "address": "123 MG Road, Andheri West, Mumbai, Maharashtra 400053",
  "latitude": 19.1334,
  "longitude": 72.8297,
  "hourlyPrice": 5000.00,
  "dailyPrice": 80000.00,
  "bedrooms": 0,
  "bathrooms": 4,
  "parkingAvailable": true,
  "furnished": true,
  "guestCapacity": 500,
  "size": 10000.0,
  "amenityIds": [1, 2, 3, 4, 6, 8, 9, 10, 11]
}
```

**Property Types:**
- `HALL`
- `HOUSE`
- `FARMHOUSE`
- `ROOFTOP`
- `BANQUET`
- `STUDIO`
- `MEETING_ROOM`
- `OPEN_AREA`
- `CAFE_SPACE`
- `PARTY_LAWN`

**Success Response (201 Created):**
```json
{
  "id": 1,
  "title": "Luxury Banquet Hall - Perfect for Weddings",
  "description": "Spacious 10,000 sq ft banquet hall...",
  "propertyType": "BANQUET",
  "city": {
    "id": 1,
    "name": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "imageUrl": "https://...",
    "isTrending": true,
    "propertyCount": 45
  },
  "address": "123 MG Road, Andheri West, Mumbai, Maharashtra 400053",
  "latitude": 19.1334,
  "longitude": 72.8297,
  "hourlyPrice": 5000.00,
  "dailyPrice": 80000.00,
  "bedrooms": 0,
  "bathrooms": 4,
  "parkingAvailable": true,
  "furnished": true,
  "guestCapacity": 500,
  "size": 10000.0,
  "status": "ACTIVE",
  "owner": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "9876543210",
    "profileImage": "https://...",
    "bio": "Property owner...",
    "city": { ... },
    "role": "OWNER",
    "isVerified": true,
    "createdAt": "2024-01-15T10:30:00"
  },
  "images": [],
  "amenities": [
    {
      "id": 1,
      "name": "WiFi",
      "icon": "wifi",
      "description": "High-speed internet connection"
    },
    {
      "id": 2,
      "name": "AC",
      "icon": "ac",
      "description": "Air conditioning"
    },
    ...
  ],
  "averageRating": 0.0,
  "totalReviews": 0,
  "isWishlisted": false,
  "createdAt": "2024-01-20T14:30:00",
  "updatedAt": "2024-01-20T14:30:00"
}
```

---

### 5.2 Update Property

**Endpoint:** `PUT /properties/{propertyId}`  
**Authentication:** Required (Bearer Token - OWNER/ADMIN)  
**Description:** Update existing property

**Path Parameters:**
- `propertyId` (required): Property ID

**Request Body:** Same as Create Property (all fields optional)

**Success Response (200 OK):** Same structure as Create Property

---

### 5.3 Get Property By ID

**Endpoint:** `GET /properties/public/{propertyId}`  
**Authentication:** Not required  
**Description:** Get detailed information about a specific property

**Path Parameters:**
- `propertyId` (required): Property ID

**Success Response (200 OK):**
```json
{
  "id": 1,
  "title": "Luxury Banquet Hall - Perfect for Weddings",
  "description": "Spacious 10,000 sq ft banquet hall...",
  "propertyType": "BANQUET",
  "city": {
    "id": 1,
    "name": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "imageUrl": "https://...",
    "isTrending": true,
    "propertyCount": 45
  },
  "address": "123 MG Road, Andheri West, Mumbai, Maharashtra 400053",
  "latitude": 19.1334,
  "longitude": 72.8297,
  "hourlyPrice": 5000.00,
  "dailyPrice": 80000.00,
  "bedrooms": 0,
  "bathrooms": 4,
  "parkingAvailable": true,
  "furnished": true,
  "guestCapacity": 500,
  "size": 10000.0,
  "status": "ACTIVE",
  "owner": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    ...
  },
  "images": [
    {
      "id": 1,
      "imageUrl": "https://res.cloudinary.com/trustspace/image/upload/v1705840000/properties/prop1-img1.jpg",
      "publicId": "trustspace/properties/prop1-img1",
      "isPrimary": true,
      "displayOrder": 0
    },
    {
      "id": 2,
      "imageUrl": "https://res.cloudinary.com/trustspace/image/upload/v1705840000/properties/prop1-img2.jpg",
      "publicId": "trustspace/properties/prop1-img2",
      "isPrimary": false,
      "displayOrder": 1
    }
  ],
  "amenities": [
    {
      "id": 1,
      "name": "WiFi",
      "icon": "wifi",
      "description": "High-speed internet connection"
    },
    ...
  ],
  "averageRating": 4.8,
  "totalReviews": 24,
  "isWishlisted": true,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-20T14:30:00"
}
```

---

### 5.4 Get Properties By City (with Filters)

**Endpoint:** `GET /properties/public/city/{cityId}`  
**Authentication:** Not required  
**Description:** Get all properties in a city with advanced filtering and pagination

**Path Parameters:**
- `cityId` (required): City ID

**Query Parameters:**
- `propertyType` (optional): HALL, HOUSE, FARMHOUSE, ROOFTOP, BANQUET, STUDIO, MEETING_ROOM, OPEN_AREA, CAFE_SPACE, PARTY_LAWN
- `minPrice` (optional): Minimum hourly price (e.g., 1000.00)
- `maxPrice` (optional): Maximum hourly price (e.g., 10000.00)
- `minCapacity` (optional): Minimum guest capacity (e.g., 100)
- `parkingAvailable` (optional): true/false
- `furnished` (optional): true/false
- `sortBy` (optional): newest (default), price_low, price_high, rating
- `page` (optional): Page number, starts from 0 (default: 0)
- `size` (optional): Number of items per page (default: 12)

**Example Request:**
```
GET /api/properties/public/city/1?propertyType=BANQUET&minPrice=3000&maxPrice=8000&minCapacity=200&parkingAvailable=true&furnished=true&sortBy=price_low&page=0&size=12
```

**Success Response (200 OK):**
```json
{
  "content": [
    {
      "id": 3,
      "title": "Elegant Banquet Hall",
      "description": "Beautiful space for events",
      "propertyType": "BANQUET",
      "city": { ... },
      "address": "456 Link Road, Mumbai",
      "latitude": 19.1234,
      "longitude": 72.8456,
      "hourlyPrice": 3500.00,
      "dailyPrice": 55000.00,
      "bedrooms": 0,
      "bathrooms": 3,
      "parkingAvailable": true,
      "furnished": true,
      "guestCapacity": 300,
      "size": 7500.0,
      "status": "ACTIVE",
      "owner": { ... },
      "images": [ ... ],
      "amenities": [ ... ],
      "averageRating": 4.5,
      "totalReviews": 18,
      "isWishlisted": false,
      "createdAt": "2024-01-18T09:15:00",
      "updatedAt": "2024-01-18T09:15:00"
    },
    {
      "id": 5,
      "title": "Premium Event Space",
      ...
    }
  ],
  "pageable": {
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "pageNumber": 0,
    "pageSize": 12,
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalPages": 2,
  "totalElements": 18,
  "last": false,
  "numberOfElements": 12,
  "first": true,
  "size": 12,
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "empty": false
}
```

---

### 5.5 Search Properties

**Endpoint:** `GET /properties/public/search`  
**Authentication:** Not required  
**Description:** Search properties by keyword

**Query Parameters:**
- `keyword` (optional): Search term
- `cityId` (required): City ID
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 12)

**Example:**
```
GET /api/properties/public/search?keyword=wedding&cityId=1&page=0&size=12
```

**Success Response (200 OK):** Same paginated structure as Get Properties By City

---

### 5.6 Get My Properties (Owner)

**Endpoint:** `GET /properties/my-properties`  
**Authentication:** Required (Bearer Token - OWNER/ADMIN)  
**Description:** Get all properties owned by current user

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Luxury Banquet Hall - Perfect for Weddings",
    "description": "Spacious 10,000 sq ft banquet hall...",
    "propertyType": "BANQUET",
    "city": { ... },
    "address": "123 MG Road, Andheri West, Mumbai",
    "latitude": 19.1334,
    "longitude": 72.8297,
    "hourlyPrice": 5000.00,
    "dailyPrice": 80000.00,
    "bedrooms": 0,
    "bathrooms": 4,
    "parkingAvailable": true,
    "furnished": true,
    "guestCapacity": 500,
    "size": 10000.0,
    "status": "ACTIVE",
    "owner": { ... },
    "images": [ ... ],
    "amenities": [ ... ],
    "averageRating": 4.8,
    "totalReviews": 24,
    "isWishlisted": false,
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-20T14:30:00"
  },
  {
    "id": 7,
    "title": "Modern Meeting Space",
    ...
  }
]
```

---

### 5.7 Upload Property Images

**Endpoint:** `POST /properties/{propertyId}/images`  
**Authentication:** Required (Bearer Token - OWNER/ADMIN)  
**Description:** Upload multiple images for a property

**Path Parameters:**
- `propertyId` (required): Property ID

**Request:**
- Content-Type: `multipart/form-data`
- Form field: `files` (multiple image files)

**cURL Example:**
```bash
curl -X POST https://trustspace-backend.onrender.com/api/properties/1/images \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.jpg" \
  -F "files=@/path/to/image3.jpg"
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "title": "Luxury Banquet Hall",
  ...
  "images": [
    {
      "id": 1,
      "imageUrl": "https://res.cloudinary.com/trustspace/image/upload/v1705840000/properties/prop1-img1.jpg",
      "publicId": "trustspace/properties/prop1-img1",
      "isPrimary": true,
      "displayOrder": 0
    },
    {
      "id": 2,
      "imageUrl": "https://res.cloudinary.com/trustspace/image/upload/v1705840001/properties/prop1-img2.jpg",
      "publicId": "trustspace/properties/prop1-img2",
      "isPrimary": false,
      "displayOrder": 1
    },
    {
      "id": 3,
      "imageUrl": "https://res.cloudinary.com/trustspace/image/upload/v1705840002/properties/prop1-img3.jpg",
      "publicId": "trustspace/properties/prop1-img3",
      "isPrimary": false,
      "displayOrder": 2
    }
  ],
  ...
}
```

---

### 5.8 Delete Property Image

**Endpoint:** `DELETE /properties/{propertyId}/images/{imageId}`  
**Authentication:** Required (Bearer Token - OWNER/ADMIN)  
**Description:** Delete a specific image from property

**Path Parameters:**
- `propertyId` (required): Property ID
- `imageId` (required): Image ID

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Image deleted successfully",
  "data": null
}
```

---

### 5.9 Delete Property

**Endpoint:** `DELETE /properties/{propertyId}`  
**Authentication:** Required (Bearer Token - OWNER/ADMIN)  
**Description:** Delete a property and all its images

**Path Parameters:**
- `propertyId` (required): Property ID

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Property deleted successfully",
  "data": null
}
```

---

## 6. Booking Management APIs

### 6.1 Create Booking

**Endpoint:** `POST /bookings`  
**Authentication:** Required (Bearer Token)  
**Description:** Create a new booking for a property

**Request Body:**
```json
{
  "propertyId": 1,
  "bookingDate": "2024-02-15",
  "startTime": "18:00:00",
  "endTime": "23:00:00",
  "numberOfGuests": 250,
  "specialRequests": "Need extra chairs and tables. Please arrange for valet parking service."
}
```

**Validation:**
- Cannot book own property
- `bookingDate` must be in future
- `endTime` must be after `startTime`
- No overlapping bookings allowed

**Success Response (201 Created):**
```json
{
  "id": 1,
  "user": {
    "id": 2,
    "fullName": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "9876543211",
    "profileImage": "https://...",
    "bio": "Event planner",
    "city": { ... },
    "role": "USER",
    "isVerified": true,
    "createdAt": "2024-01-10T08:20:00"
  },
  "property": {
    "id": 1,
    "title": "Luxury Banquet Hall - Perfect for Weddings",
    "description": "Spacious 10,000 sq ft banquet hall...",
    "propertyType": "BANQUET",
    "city": { ... },
    "address": "123 MG Road, Andheri West, Mumbai",
    "hourlyPrice": 5000.00,
    "dailyPrice": 80000.00,
    ...
  },
  "bookingDate": "2024-02-15",
  "startTime": "18:00:00",
  "endTime": "23:00:00",
  "totalPrice": 25000.00,
  "status": "PENDING",
  "paymentStatus": "PENDING",
  "paymentId": null,
  "specialRequests": "Need extra chairs and tables. Please arrange for valet parking service.",
  "numberOfGuests": 250,
  "cancellationReason": null,
  "createdAt": "2024-01-20T15:30:00"
}
```

**Booking Status Values:**
- `PENDING` - Awaiting owner approval
- `APPROVED` - Confirmed by owner
- `REJECTED` - Declined by owner
- `COMPLETED` - Event finished
- `CANCELLED` - Cancelled by user

**Payment Status Values:**
- `PENDING` - Payment not completed
- `COMPLETED` - Payment successful
- `FAILED` - Payment failed
- `REFUNDED` - Payment refunded

---

### 6.2 Get My Bookings

**Endpoint:** `GET /bookings/my-bookings`  
**Authentication:** Required (Bearer Token)  
**Description:** Get all bookings made by current user

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "user": { ... },
    "property": {
      "id": 1,
      "title": "Luxury Banquet Hall",
      ...
    },
    "bookingDate": "2024-02-15",
    "startTime": "18:00:00",
    "endTime": "23:00:00",
    "totalPrice": 25000.00,
    "status": "APPROVED",
    "paymentStatus": "COMPLETED",
    "paymentId": "pay_abc123xyz",
    "specialRequests": "Need extra chairs and tables...",
    "numberOfGuests": 250,
    "cancellationReason": null,
    "createdAt": "2024-01-20T15:30:00"
  },
  {
    "id": 5,
    "user": { ... },
    "property": {
      "id": 3,
      "title": "Rooftop Party Space",
      ...
    },
    "bookingDate": "2024-03-10",
    "startTime": "19:00:00",
    "endTime": "01:00:00",
    "totalPrice": 18000.00,
    "status": "PENDING",
    "paymentStatus": "PENDING",
    ...
  }
]
```

---

### 6.3 Get Owner Bookings

**Endpoint:** `GET /bookings/owner`  
**Authentication:** Required (Bearer Token - OWNER/ADMIN)  
**Description:** Get all bookings for properties owned by current user

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "user": {
      "id": 2,
      "fullName": "Jane Smith",
      "email": "jane.smith@example.com",
      ...
    },
    "property": {
      "id": 1,
      "title": "Luxury Banquet Hall",
      ...
    },
    "bookingDate": "2024-02-15",
    "startTime": "18:00:00",
    "endTime": "23:00:00",
    "totalPrice": 25000.00,
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "specialRequests": "Need extra chairs and tables...",
    "numberOfGuests": 250,
    "createdAt": "2024-01-20T15:30:00"
  },
  {
    "id": 8,
    "user": {
      "id": 4,
      "fullName": "Mike Johnson",
      ...
    },
    "property": {
      "id": 1,
      "title": "Luxury Banquet Hall",
      ...
    },
    "bookingDate": "2024-03-05",
    "startTime": "10:00:00",
    "endTime": "17:00:00",
    "totalPrice": 35000.00,
    "status": "APPROVED",
    "paymentStatus": "COMPLETED",
    ...
  }
]
```

---

### 6.4 Get Property Bookings

**Endpoint:** `GET /bookings/property/{propertyId}`  
**Authentication:** Required (Bearer Token - OWNER/ADMIN)  
**Description:** Get all bookings for a specific property (owner only)

**Path Parameters:**
- `propertyId` (required): Property ID

**Success Response (200 OK):** Array of booking objects

---

### 6.5 Get Booking By ID

**Endpoint:** `GET /bookings/{bookingId}`  
**Authentication:** Required (Bearer Token)  
**Description:** Get details of a specific booking (user who booked or property owner)

**Path Parameters:**
- `bookingId` (required): Booking ID

**Success Response (200 OK):** Single booking object

---

### 6.6 Approve Booking (Owner)

**Endpoint:** `PUT /bookings/{bookingId}/approve`  
**Authentication:** Required (Bearer Token - OWNER/ADMIN)  
**Description:** Approve a pending booking

**Path Parameters:**
- `bookingId` (required): Booking ID

**Success Response (200 OK):**
```json
{
  "id": 1,
  "user": { ... },
  "property": { ... },
  "bookingDate": "2024-02-15",
  "startTime": "18:00:00",
  "endTime": "23:00:00",
  "totalPrice": 25000.00,
  "status": "APPROVED",
  "paymentStatus": "PENDING",
  "specialRequests": "Need extra chairs and tables...",
  "numberOfGuests": 250,
  "createdAt": "2024-01-20T15:30:00"
}
```

**Note:** User receives email and notification when booking is approved

---

### 6.7 Reject Booking (Owner)

**Endpoint:** `PUT /bookings/{bookingId}/reject`  
**Authentication:** Required (Bearer Token - OWNER/ADMIN)  
**Description:** Reject a pending booking

**Path Parameters:**
- `bookingId` (required): Booking ID

**Success Response (200 OK):**
```json
{
  "id": 1,
  "user": { ... },
  "property": { ... },
  "bookingDate": "2024-02-15",
  "startTime": "18:00:00",
  "endTime": "23:00:00",
  "totalPrice": 25000.00,
  "status": "REJECTED",
  "paymentStatus": "PENDING",
  "specialRequests": "Need extra chairs and tables...",
  "numberOfGuests": 250,
  "createdAt": "2024-01-20T15:30:00"
}
```

---

### 6.8 Cancel Booking (User)

**Endpoint:** `PUT /bookings/{bookingId}/cancel`  
**Authentication:** Required (Bearer Token)  
**Description:** Cancel a booking

**Path Parameters:**
- `bookingId` (required): Booking ID

**Query Parameters:**
- `reason` (optional): Cancellation reason

**Example:**
```
PUT /api/bookings/1/cancel?reason=Date%20changed
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "user": { ... },
  "property": { ... },
  "bookingDate": "2024-02-15",
  "startTime": "18:00:00",
  "endTime": "23:00:00",
  "totalPrice": 25000.00,
  "status": "CANCELLED",
  "paymentStatus": "REFUNDED",
  "specialRequests": "Need extra chairs and tables...",
  "numberOfGuests": 250,
  "cancellationReason": "Date changed",
  "createdAt": "2024-01-20T15:30:00"
}
```

---

## 7. Review & Rating APIs

### 7.1 Create Review

**Endpoint:** `POST /reviews`  
**Authentication:** Required (Bearer Token)  
**Description:** Create a review for a property

**Request Body:**
```json
{
  "propertyId": 1,
  "bookingId": 5,
  "rating": 5,
  "comment": "Absolutely amazing venue! The banquet hall exceeded all our expectations. The staff was professional, the facilities were top-notch, and our wedding was a huge success. Highly recommended for large events!",
  "images": [
    "https://res.cloudinary.com/trustspace/image/upload/v1705860000/reviews/review1-img1.jpg",
    "https://res.cloudinary.com/trustspace/image/upload/v1705860001/reviews/review1-img2.jpg"
  ]
}
```

**Validation:**
- Rating: 1-5 (required)
- Cannot review same property twice
- Comment: Max 2000 characters

**Success Response (201 Created):**
```json
{
  "id": 1,
  "user": {
    "id": 2,
    "fullName": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "9876543211",
    "profileImage": "https://...",
    "bio": "Event planner",
    "city": { ... },
    "role": "USER",
    "isVerified": true,
    "createdAt": "2024-01-10T08:20:00"
  },
  "propertyId": 1,
  "rating": 5,
  "comment": "Absolutely amazing venue! The banquet hall exceeded all our expectations...",
  "images": [
    "https://res.cloudinary.com/trustspace/image/upload/v1705860000/reviews/review1-img1.jpg",
    "https://res.cloudinary.com/trustspace/image/upload/v1705860001/reviews/review1-img2.jpg"
  ],
  "createdAt": "2024-01-22T10:15:00"
}
```

---

### 7.2 Get Property Reviews

**Endpoint:** `GET /reviews/property/{propertyId}`  
**Authentication:** Not required  
**Description:** Get all reviews for a property

**Path Parameters:**
- `propertyId` (required): Property ID

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "user": {
      "id": 2,
      "fullName": "Jane Smith",
      "email": "jane.smith@example.com",
      "profileImage": "https://...",
      ...
    },
    "propertyId": 1,
    "rating": 5,
    "comment": "Absolutely amazing venue!...",
    "images": [
      "https://res.cloudinary.com/trustspace/image/upload/v1705860000/reviews/review1-img1.jpg"
    ],
    "createdAt": "2024-01-22T10:15:00"
  },
  {
    "id": 8,
    "user": {
      "id": 5,
      "fullName": "Mike Johnson",
      "profileImage": "https://...",
      ...
    },
    "propertyId": 1,
    "rating": 4,
    "comment": "Great place for events. Very professional service.",
    "images": [],
    "createdAt": "2024-01-18T14:30:00"
  }
]
```

---

### 7.3 Get Property Reviews (Paginated)

**Endpoint:** `GET /reviews/property/{propertyId}/paginated`  
**Authentication:** Not required  
**Description:** Get paginated reviews for a property

**Path Parameters:**
- `propertyId` (required): Property ID

**Query Parameters:**
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 10)

**Success Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "user": { ... },
      "propertyId": 1,
      "rating": 5,
      "comment": "Absolutely amazing venue!...",
      "images": [ ... ],
      "createdAt": "2024-01-22T10:15:00"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10
  },
  "totalElements": 24,
  "totalPages": 3,
  "last": false
}
```

---

### 7.4 Get My Reviews

**Endpoint:** `GET /reviews/my-reviews`  
**Authentication:** Required (Bearer Token)  
**Description:** Get all reviews created by current user

**Success Response (200 OK):** Array of review objects

---

### 7.5 Update Review

**Endpoint:** `PUT /reviews/{reviewId}`  
**Authentication:** Required (Bearer Token)  
**Description:** Update own review

**Path Parameters:**
- `reviewId` (required): Review ID

**Request Body:**
```json
{
  "propertyId": 1,
  "rating": 5,
  "comment": "Updated review comment...",
  "images": [
    "https://res.cloudinary.com/trustspace/image/upload/v1705870000/reviews/review1-updated.jpg"
  ]
}
```

**Success Response (200 OK):** Updated review object

---

### 7.6 Delete Review

**Endpoint:** `DELETE /reviews/{reviewId}`  
**Authentication:** Required (Bearer Token)  
**Description:** Delete own review

**Path Parameters:**
- `reviewId` (required): Review ID

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Review deleted successfully",
  "data": null
}
```

---

### 7.7 Get Average Rating

**Endpoint:** `GET /reviews/property/{propertyId}/average-rating`  
**Authentication:** Not required  
**Description:** Get average rating for a property

**Path Parameters:**
- `propertyId` (required): Property ID

**Success Response (200 OK):**
```json
4.8
```

---

## 8. Wishlist APIs

### 8.1 Add to Wishlist

**Endpoint:** `POST /wishlist/{propertyId}`  
**Authentication:** Required (Bearer Token)  
**Description:** Add a property to user's wishlist

**Path Parameters:**
- `propertyId` (required): Property ID

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Added to wishlist",
  "data": null
}
```

**Error Response (400 Bad Request):**
```json
{
  "status": 400,
  "message": "Property already in wishlist",
  "timestamp": "2024-01-20T10:30:00"
}
```

---

### 8.2 Remove from Wishlist

**Endpoint:** `DELETE /wishlist/{propertyId}`  
**Authentication:** Required (Bearer Token)  
**Description:** Remove a property from user's wishlist

**Path Parameters:**
- `propertyId` (required): Property ID

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Removed from wishlist",
  "data": null
}
```

---

### 8.3 Get My Wishlist

**Endpoint:** `GET /wishlist`  
**Authentication:** Required (Bearer Token)  
**Description:** Get all properties in user's wishlist

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Luxury Banquet Hall - Perfect for Weddings",
    "description": "Spacious 10,000 sq ft banquet hall...",
    "propertyType": "BANQUET",
    "city": { ... },
    "address": "123 MG Road, Andheri West, Mumbai",
    "hourlyPrice": 5000.00,
    "dailyPrice": 80000.00,
    "guestCapacity": 500,
    "images": [ ... ],
    "amenities": [ ... ],
    "averageRating": 4.8,
    "totalReviews": 24,
    "isWishlisted": true,
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-20T14:30:00"
  },
  {
    "id": 5,
    "title": "Elegant Rooftop Space",
    ...
  }
]
```

---

### 8.4 Check if in Wishlist

**Endpoint:** `GET /wishlist/{propertyId}/check`  
**Authentication:** Required (Bearer Token)  
**Description:** Check if a property is in user's wishlist

**Path Parameters:**
- `propertyId` (required): Property ID

**Success Response (200 OK):**
```json
true
```

or

```json
false
```

---

## 9. Chat & Messaging APIs

### 9.1 Send Message

**Endpoint:** `POST /chat/messages`  
**Authentication:** Required (Bearer Token)  
**Description:** Send a message to another user

**Request Body:**
```json
{
  "receiverId": 3,
  "content": "Hi, I'm interested in booking your Luxury Banquet Hall for a wedding on Feb 15th. Is it available?",
  "propertyId": 1
}
```

**Success Response (201 Created):**
```json
{
  "id": 1,
  "chatRoomId": 1,
  "sender": {
    "id": 2,
    "fullName": "Jane Smith",
    "email": "jane.smith@example.com",
    "profileImage": "https://...",
    ...
  },
  "receiver": {
    "id": 3,
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "profileImage": "https://...",
    ...
  },
  "content": "Hi, I'm interested in booking your Luxury Banquet Hall for a wedding on Feb 15th. Is it available?",
  "isRead": false,
  "sentAt": "2024-01-20T16:45:00"
}
```

**Note:** Automatically creates a chat room if one doesn't exist between the users

---

### 9.2 Get My Chat Rooms

**Endpoint:** `GET /chat/rooms`  
**Authentication:** Required (Bearer Token)  
**Description:** Get all chat rooms for current user

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "user1": {
      "id": 2,
      "fullName": "Jane Smith",
      "email": "jane.smith@example.com",
      "profileImage": "https://...",
      ...
    },
    "user2": {
      "id": 3,
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "profileImage": "https://...",
      ...
    },
    "property": {
      "id": 1,
      "title": "Luxury Banquet Hall - Perfect for Weddings",
      "propertyType": "BANQUET",
      "city": { ... },
      "hourlyPrice": 5000.00,
      ...
    },
    "lastMessage": {
      "id": 5,
      "chatRoomId": 1,
      "sender": { ... },
      "receiver": { ... },
      "content": "Yes, it's available. Would you like to schedule a visit?",
      "isRead": true,
      "sentAt": "2024-01-20T17:15:00"
    },
    "unreadCount": 0,
    "createdAt": "2024-01-20T16:45:00",
    "updatedAt": "2024-01-20T17:15:00"
  },
  {
    "id": 3,
    "user1": { ... },
    "user2": { ... },
    "property": null,
    "lastMessage": { ... },
    "unreadCount": 2,
    "createdAt": "2024-01-19T14:30:00",
    "updatedAt": "2024-01-20T09:20:00"
  }
]
```

---

### 9.3 Get Chat Messages

**Endpoint:** `GET /chat/rooms/{chatRoomId}/messages`  
**Authentication:** Required (Bearer Token)  
**Description:** Get all messages in a chat room

**Path Parameters:**
- `chatRoomId` (required): Chat room ID

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "chatRoomId": 1,
    "sender": {
      "id": 2,
      "fullName": "Jane Smith",
      "email": "jane.smith@example.com",
      "profileImage": "https://...",
      ...
    },
    "receiver": {
      "id": 3,
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "profileImage": "https://...",
      ...
    },
    "content": "Hi, I'm interested in booking your Luxury Banquet Hall for a wedding on Feb 15th. Is it available?",
    "isRead": true,
    "sentAt": "2024-01-20T16:45:00"
  },
  {
    "id": 2,
    "chatRoomId": 1,
    "sender": {
      "id": 3,
      "fullName": "John Doe",
      ...
    },
    "receiver": {
      "id": 2,
      "fullName": "Jane Smith",
      ...
    },
    "content": "Hello! Yes, the banquet hall is available on Feb 15th. What time are you looking for?",
    "isRead": true,
    "sentAt": "2024-01-20T16:50:00"
  },
  {
    "id": 3,
    "chatRoomId": 1,
    "sender": {
      "id": 2,
      "fullName": "Jane Smith",
      ...
    },
    "receiver": {
      "id": 3,
      "fullName": "John Doe",
      ...
    },
    "content": "We need it from 6 PM to 11 PM. Can we schedule a site visit?",
    "isRead": true,
    "sentAt": "2024-01-20T16:55:00"
  }
]
```

---

### 9.4 Mark Message as Read

**Endpoint:** `PUT /chat/messages/{messageId}/read`  
**Authentication:** Required (Bearer Token)  
**Description:** Mark a message as read

**Path Parameters:**
- `messageId` (required): Message ID

**Success Response (200 OK):**
```json
{
  "id": 3,
  "chatRoomId": 1,
  "sender": { ... },
  "receiver": { ... },
  "content": "We need it from 6 PM to 11 PM. Can we schedule a site visit?",
  "isRead": true,
  "sentAt": "2024-01-20T16:55:00"
}
```

---

### 9.5 Get Unread Message Count

**Endpoint:** `GET /chat/unread-count`  
**Authentication:** Required (Bearer Token)  
**Description:** Get total number of unread messages for current user

**Success Response (200 OK):**
```json
5
```

---

## 10. Notification APIs

### 10.1 Get My Notifications

**Endpoint:** `GET /notifications`  
**Authentication:** Required (Bearer Token)  
**Description:** Get all notifications for current user

**Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "type": "NEW_BOOKING",
    "title": "New Booking Request",
    "message": "You have a new booking request for Luxury Banquet Hall - Perfect for Weddings",
    "link": "/bookings/1",
    "isRead": false,
    "createdAt": "2024-01-20T15:30:00"
  },
  {
    "id": 2,
    "type": "BOOKING_APPROVED",
    "title": "Booking Approved",
    "message": "Your booking for Elegant Rooftop Space has been approved",
    "link": "/bookings/5",
    "isRead": true,
    "createdAt": "2024-01-19T10:15:00"
  },
  {
    "id": 3,
    "type": "NEW_MESSAGE",
    "title": "New Message",
    "message": "You have a new message from Jane Smith",
    "link": "/chat/1",
    "isRead": false,
    "createdAt": "2024-01-20T16:45:00"
  },
  {
    "id": 4,
    "type": "NEW_REVIEW",
    "title": "New Review",
    "message": "Your property Luxury Banquet Hall received a new review",
    "link": "/properties/1#reviews",
    "isRead": true,
    "createdAt": "2024-01-22T10:15:00"
  }
]
```

**Notification Types:**
- `NEW_BOOKING` - New booking request received
- `BOOKING_APPROVED` - Booking approved by owner
- `BOOKING_REJECTED` - Booking rejected by owner
- `BOOKING_CANCELLED` - Booking cancelled
- `NEW_MESSAGE` - New chat message
- `NEW_REVIEW` - New review on property
- `PROPERTY_APPROVED` - Property listing approved
- `PROPERTY_REJECTED` - Property listing rejected
- `PAYMENT_SUCCESS` - Payment successful
- `PAYMENT_FAILED` - Payment failed

---

### 10.2 Get My Notifications (Paginated)

**Endpoint:** `GET /notifications/paginated`  
**Authentication:** Required (Bearer Token)  
**Description:** Get paginated notifications

**Query Parameters:**
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 20)

**Success Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "type": "NEW_BOOKING",
      "title": "New Booking Request",
      "message": "You have a new booking request for Luxury Banquet Hall",
      "link": "/bookings/1",
      "isRead": false,
      "createdAt": "2024-01-20T15:30:00"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20
  },
  "totalElements": 48,
  "totalPages": 3,
  "last": false
}
```

---

### 10.3 Mark Notification as Read

**Endpoint:** `PUT /notifications/{notificationId}/read`  
**Authentication:** Required (Bearer Token)  
**Description:** Mark a single notification as read

**Path Parameters:**
- `notificationId` (required): Notification ID

**Success Response (200 OK):**
```json
{
  "id": 1,
  "type": "NEW_BOOKING",
  "title": "New Booking Request",
  "message": "You have a new booking request for Luxury Banquet Hall",
  "link": "/bookings/1",
  "isRead": true,
  "createdAt": "2024-01-20T15:30:00"
}
```

---

### 10.4 Mark All Notifications as Read

**Endpoint:** `PUT /notifications/mark-all-read`  
**Authentication:** Required (Bearer Token)  
**Description:** Mark all notifications as read

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "data": null
}
```

---

### 10.5 Get Unread Notification Count

**Endpoint:** `GET /notifications/unread-count`  
**Authentication:** Required (Bearer Token)  
**Description:** Get total number of unread notifications

**Success Response (200 OK):**
```json
7
```

---

### 10.6 Delete Notification

**Endpoint:** `DELETE /notifications/{notificationId}`  
**Authentication:** Required (Bearer Token)  
**Description:** Delete a notification

**Path Parameters:**
- `notificationId` (required): Notification ID

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification deleted successfully",
  "data": null
}
```

---

## 11. Error Responses

All API endpoints may return the following error responses:

### 11.1 Validation Error (400 Bad Request)

**Response:**
```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters",
    "fullName": "Full name is required"
  },
  "timestamp": "2024-01-20T10:30:00"
}
```

---

### 11.2 Unauthorized (401)

**Response:**
```json
{
  "status": 401,
  "message": "Invalid email or password",
  "timestamp": "2024-01-20T10:30:00"
}
```

or

```json
{
  "status": 401,
  "message": "User not authenticated",
  "timestamp": "2024-01-20T10:30:00"
}
```

---

### 11.3 Forbidden (403)

**Response:**
```json
{
  "status": 403,
  "message": "Access denied",
  "timestamp": "2024-01-20T10:30:00"
}
```

---

### 11.4 Not Found (404)

**Response:**
```json
{
  "status": 404,
  "message": "Property not found with id: 999",
  "timestamp": "2024-01-20T10:30:00"
}
```

or

```json
{
  "status": 404,
  "message": "User not found with id: 123",
  "timestamp": "2024-01-20T10:30:00"
}
```

---

### 11.5 Internal Server Error (500)

**Response:**
```json
{
  "status": 500,
  "message": "An error occurred: Database connection failed",
  "timestamp": "2024-01-20T10:30:00"
}
```

---

## 12. Status Codes

| Status Code | Description |
|------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Authentication required or failed |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## 📌 Quick Reference

### Public Endpoints (No Authentication)
- POST /auth/register
- POST /auth/login
- POST /auth/refresh-token
- GET /auth/verify-email
- POST /auth/forgot-password
- POST /auth/reset-password
- GET /cities
- GET /cities/trending
- GET /cities/{cityId}
- GET /cities/name/{cityName}
- GET /amenities
- GET /properties/public/{propertyId}
- GET /properties/public/city/{cityId}
- GET /properties/public/search
- GET /reviews/property/{propertyId}
- GET /reviews/property/{propertyId}/paginated
- GET /reviews/property/{propertyId}/average-rating
- GET /users/{userId}

### Authenticated Endpoints (Requires Login)
- GET /users/me
- PUT /users/profile
- POST /users/profile/image
- PUT /users/change-password
- DELETE /users/account
- POST /properties
- GET /properties/my-properties
- POST /bookings
- GET /bookings/my-bookings
- GET /bookings/{bookingId}
- PUT /bookings/{bookingId}/cancel
- POST /reviews
- GET /reviews/my-reviews
- PUT /reviews/{reviewId}
- DELETE /reviews/{reviewId}
- POST /wishlist/{propertyId}
- DELETE /wishlist/{propertyId}
- GET /wishlist
- GET /wishlist/{propertyId}/check
- POST /chat/messages
- GET /chat/rooms
- GET /chat/rooms/{chatRoomId}/messages
- PUT /chat/messages/{messageId}/read
- GET /chat/unread-count
- GET /notifications
- GET /notifications/paginated
- PUT /notifications/{notificationId}/read
- PUT /notifications/mark-all-read
- GET /notifications/unread-count
- DELETE /notifications/{notificationId}

### Owner/Admin Only Endpoints
- PUT /properties/{propertyId}
- POST /properties/{propertyId}/images
- DELETE /properties/{propertyId}/images/{imageId}
- DELETE /properties/{propertyId}
- GET /bookings/owner
- GET /bookings/property/{propertyId}
- PUT /bookings/{bookingId}/approve
- PUT /bookings/{bookingId}/reject

### Admin Only Endpoints
- GET /users

---

## 🔐 Authentication Header Format

For all authenticated endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 Notes

1. **Pagination**: All paginated responses follow the same structure with `content`, `pageable`, `totalElements`, `totalPages`, etc.

2. **Image Upload**: All image uploads use `multipart/form-data` and return Cloudinary URLs

3. **Timestamps**: All timestamps are in ISO 8601 format (e.g., "2024-01-20T10:30:00")

4. **Prices**: All prices are in decimal format (e.g., 5000.00)

5. **IDs**: All IDs are Long integers

6. **Roles**: USER (can book), OWNER (can list properties), ADMIN (full access)

7. **WebSocket**: Real-time chat uses WebSocket endpoint at `/ws`

---

**API Version:** 1.0.0  
**Last Updated:** January 2024  
**Base URL:** https://trustspace-backend.onrender.com/api

---

For additional support, refer to:
- README.md
- SETUP_GUIDE.md
- BACKEND_COMPLETE.md


**Prompt to remove First Popup**
Remove the first-load popup that appears on website open and informs users that the backend is hosted on a free platform and may take 3–4 minutes to respond. Delete the modal UI, its state logic, and any localStorage check used to show it only once.