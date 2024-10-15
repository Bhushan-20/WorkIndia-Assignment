# Train Booking System (Backend Only)

This project is a backend application that provides a set of APIs for a train booking system. Users can register, log in, search for trains by source and destination, and book seats. Admin have the ability to add new trains to the system.

## Features

- **User Registration & Login**: Users can register and log in to the system.
- **Admin Features**: Admins can add new trains with details such as train number, departure time, source, destination, and available seats.
- **Search Trains**: Users can search for trains based on source and destination.
- **Seat Booking**: Users can book seats on available trains and view their booking details.

## API Endpoints

- **POST /api/auth/register**: Allows users to register.
- **POST /api/auth/login**: Allows users to log in and receive an authentication token.
- **POST /api/auth/add-train**: Admin-protected route where admins can add a new train.
- **GET /api/auth/trains**: Users can search for trains by providing source and destination.
- **POST /api/auth/book-seat**: Allows users to book seats on available trains and view details after booking (requires authentication).

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Token)
- **Other Tools**: Postman for API testing

## Installation

### 1. Clone the repository:
```bash
git clone https://github.com/Bhushan-20/train-booking-system.git
cd train-booking-system
npm install

.env
DB_USER='root'
DB_PASSWORD='your_password'
DB_NAME='train_booking'
PORT=3000
JWT_SECRET='your_jwt_secret'

npm start
