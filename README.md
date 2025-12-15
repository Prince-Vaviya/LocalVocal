## Project: LocalVocal (MERN)

## 1. Project Goal Build a **LocalVocal web application** where customers can discover, book, and communicate with local service providers (plumbing, cleaning, tutoring, electrician, painter, gardener). The system must support **location-based discovery, booking lifecycle, chat, reviews**.

## 2. Tech Stack (Mandatory) 
* **Frontend:** React 
* **Backend:** Node.js + Express 
* **Database:** MongoDB Atlas (Mongoose) 
* **Authentication:** JWT (role-based) 
* **State Management:** Context API 
* **Routing:** React Router 
* **Styling:** (TailwindCSS using Vite)

 ## 3. User Roles 
 * **Customer** 
 * **Service Provider** 
 * **Admin** 
 Each role must have **separate accessible routes and UI**.
 
 ## 4. Page-wise Application Flow & Functionality 
 ### 4.1 Authentication 
 #### Login 
 * Email + Password 
 * Backend returns JWT + role 
 * Redirect based on role: 
 * Customer → Home 
 * Provider → Provider Dashboard 
 * Admin → Admin Dashboard 
 
 #### Register 
 * Email + Password
 * Select role (Admin / Customer / Provider)
 
 ### 4.2 Customer Pages 
 #### Home 
 * Three fields : location, service category, service time 
 * Service Listing 
 - * Service cards showing: 
 - * Provider name 
 - * Rating 
 - * Price 
 - * Distance 
 * Filters: price ( asc and desc )
 
 #### Service Detail 
 * Service description 
 * Ratings & reviews 
 * Availability 
 * “Book Service” button 
 
 #### Booking Flow 
 1. Select date & time from availability of service provider
 2. Enter address single field
 3. Review booking summary 
 4. Confirm booking → Booking status created as pending 
 
 #### Booking Status 
 * Status display: pending / accepted / completed 
 * Provider details 
 * One-to-one chat with provider
 
 #### Customer Profile 
 * Booking history 
 * Submit review after completion 
 

## 5. MongoDB Schema (Required) 
### Users
js
{
  role, name, email, phone, passwordHash,
  isVerified, verificationStatus,
  location { city },
  createdAt, updatedAt
}
### Services
js
{
  providerId, title, description, category,
  price, durationMinutes, isActive,
  createdAt, updatedAt
}
### Bookings
js
{
  customerId, providerId, serviceId,
  scheduledAt, address,
  status, price,
  createdAt, updatedAt
}
### Reviews
js
{
  bookingId, customerId, providerId,
  rating, comment, isVisible,
  createdAt
}
### Chats
js
{
  bookingId, customerId, providerId,
  messages[{ senderId, message, timestamp }]
}
---