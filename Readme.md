# 🏺 Basho - Handcrafted Pottery Studio Platform

> "Where clay meets poetry. A place for mindful creation."
## 📖 Overview

**Basho** is a full-stack web application designed for a boutique pottery studio in Surat, India. It serves as a digital storefront and community hub, allowing users to purchase handcrafted ceramics, book workshops, request custom pieces, and explore the studio's story.

Built with the **MERN Stack** (MongoDB, Express, React, Node.js), it features a premium "Wabi-Sabi" aesthetic, secure authentication, payment gateway integration, and admin management.

## ✨ Key Features

### 🛍️ E-Commerce
- **Browse Collections:** View handcrafted products with detailed descriptions and imagery.
- **Secure Checkout:** Integrated **Razorpay** payment gateway for seamless transactions.
- **Order History:** Users can track standard and custom orders in their profile.

### 🎨 Custom Requests
- **Bespoke Orders:** Users can upload reference images and describe their vision for custom pottery.
- **Approval System:** Admin can view and manage custom requests.

### 🛠️ Workshop Management
- **Book Classes:** Users can register for One-on-One or Group pottery workshops.
- **Real-time Availability:** Seat counters update automatically upon booking.
- **Waitlist/Cancellation:** Users can cancel registrations if plans change.

### 🔐 Authentication & Security
- **JWT Authentication:** Secure login and signup flows.
- **OTP Verification:** Email-based OTP verification for sensitive actions (Sign up, Custom Orders).
- **Role-Based Access:** Distinct routes for Users and Admins.

### 🌟 UI/UX Design
- **Artisanal Theme:** Custom color palette (Ember, Clay, Sand) and typography (Playfair Display).
- **Responsive Design:** Fully mobile-optimized navigation and layout.
- **Animations:** Smooth transitions, glassmorphism effects, and loading states.

---

## 💻 Tech Stack

| Area | Technology |
| :--- | :--- |
| **Frontend** | React.js, React Router v6, Axios, Lucide React (Icons) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Atlas) |
| **Authentication** | JSON Web Tokens (JWT), Nodemailer (OTP) |
| **Payments** | Razorpay SDK |
| **File Storage** | Cloudnary |

---

## 🚀 Getting Started Locally

Follow these steps to run the project on your machine.

### Prerequisites
* Node.js (v14+)
* MongoDB (Local or Atlas Connection String)

### 1. Clone the Repository
```bash

To Start the Project

=>For backend
cd server
npm install
node index.js

=>For Frontend
cd client
npm install
npm start
