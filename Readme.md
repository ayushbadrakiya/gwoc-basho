📦 Project-Root
 ┣ 📂 client                 # Frontend (React)
 ┃ ┣ 📂 public
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 pages
 ┃ ┃ ┃ ┣ 📜 Admin.js          # Admin Dashboard
 ┃ ┃ ┃ ┣ 📜 Login.js          # Auth & OTP Entry
 ┃ ┃ ┃ ┣ 📜 Orders.js         # Product Listing
 ┃ ┃ ┃ ┣ 📜 ProductDetails.js # Single Product View
 ┃ ┃ ┃ ┣ 📜 MyOrders.js       # Customer Tracking
 ┃ ┃ ┃ ┗ 📜 CustomOrders.js   # Custom Request Form
 ┃ ┃ ┣ 📜 App.js              # Routing
 ┃ ┃ ┗ 📜 index.js
 ┃ ┗ 📜 package.json
 ┃
 ┗ 📂 server                 # Backend (Node/Express)
   ┣ 📂 models
   ┃ ┣ 📜 User.js
   ┃ ┣ 📜 Product.js
   ┃ ┗ 📜 Order.js
   ┣ 📂 routes
   ┃ ┣ 📜 auth.js             # Login/Register/OTP
   ┃ ┗ 📜 products.js         # Product CRUD
   ┣ 📂 uploads               # Stored Product Images
   ┣ 📜 index.js              # Main Server Entry
   ┗ 📜 package.json

Tech Stack

Frontend: React.js, React Router, Axios

Backend: Node.js, Express.js

Database: MongoDB

Authentication: JWT (JSON Web Tokens) + OTP (Nodemailer)

File Storage: Multer (Local storage)

Email Service: Nodemailer (Gmail SMTP)

