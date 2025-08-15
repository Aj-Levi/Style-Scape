# 🚀 StyleScape

**A Modern E‑commerce Platform for Fashion Retail**

**StyleScape** is a full‑featured e‑commerce web application built with **Next.js 15**. It offers a seamless shopping experience for customers and powerful management tools for administrators.

---

## ✨ Key Features

### 🛍️ For Customers

- **User Authentication**
  - Email/password login 🔑
  - Social login with Google & GitHub 👥
  - Secure session management 🔐
 
- **Product Browsing**
  - Browse by categories 📂
  - Featured collections & new arrivals 🌟
  - Filter & search products 🔍
    
- **Personalized Experience**
  - Detailed user profiles 🧑‍💻
  - Order history & tracking 🚞
  - Shopping cart with persistence 🛒
  - Address & payment info storage 💳
  - Toggle between light/dark themes 🌗
    
- **Reviews & Ratings**
  - Leave reviews with stars ⭐️
  - Read feedback from other customers 💬

### 🔧 For Administrators

- **User Management**
  - View & manage customer accounts 👀
  - Update roles & permissions 🛠️
    
- **Product Management**
  - Add, edit, or remove products ✏️
  - Organize categories & featured items 📋
    
- **Order Processing**
  - Track & update order statuses 🔄
  - Export order reports 📈
    
- **Content Management**
  - Update banners & promotional content 🎨
  - Manage brand showcases 🤝

---

## 🛠️ Tech Stack

| Layer            | Technologies                               |
| ---------------- | ------------------------------------------ |
| Frontend         | Next.js 15 (App Router), React, TypeScript |
| Styling          | Tailwind CSS, DaisyUI, Framer Motion       |
| State Management | Redux Toolkit (RTK Query), Zustand         |
| Backend          | Next.js API Routes, Server Actions         |
| Database         | MongoDB Atlas (Mongoose)                   |
| Auth             | NextAuth.js (Credentials, Google, GitHub)  |
| Payments         | Razorpay React SDK                         |
| Image Hosting    | ImageKit                                   |
| Notifications    | React Toastify                             |
| Security         | bcrypt.js, secure cookies                  |
| Deployment       | Vercel                                     |

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ v18
- npm or yarn
- MongoDB Atlas account
- GitHub & Google OAuth credentials
- Razorpay Test keys
- Vercel account

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/<your-username>/style-scape.git
   cd style-scape
   ```
2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Configure environment variables**
   - Copy `.env.example` → `.env.local`
   - Fill in your credentials:
     ```env
     MONGO_URI=
     AUTH_SECRET=
     AUTH_GITHUB_ID=
     AUTH_GITHUB_SECRET=
     AUTH_GOOGLE_ID=
     AUTH_GOOGLE_SECRET=
     IMAGEKIT_PUBLIC_KEY =
     IMAGEKIT_URL_ENDPOINT =
     IMAGEKIT_PRIVATE_KEY =
     NEXT_PUBLIC_RAZORPAY_KEY_ID=
     RAZORPAY_KEY_ID=
     RAZORPAY_KEY_SECRET=
     NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
     ```
4. **Run the dev server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── actions/        # Server Actions (form handlers)
├── app/            # App Router pages & layouts
│   ├── (auth)/     # Authentication routes
│   ├── (shop)/     # Shop pages
│   ├── admin/      # Admin dashboard
│   ├── api/        # API routes
│   └── services/   # RTK Query services
├── components/     # Reusable UI components
├── lib/            # Utilities & database models
│   ├── connectDB.ts
│   └── models/     # Mongoose schemas
├── styles/         # Global styles & theming
└── tests/          # Unit & integration tests
```

---

## 🔒 Authentication & Auth Flow

- **NextAuth.js** for secure auth
- **Credentials Provider** for email/password
- **OAuth Providers**: Google & GitHub
- Session data enriched with user role, name, and creation date

---

## 🤝 Contributing

1. Fork this repo
2. Create a branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m "feat: description"`)
4. Push (`git push origin feature/YourFeature`)
5. Open a PR and describe your changes

---

## 📢 Contact & Feedback

If you have any suggestions, feedback, or want to connect, feel free to reach out:

- 💼 LinkedIn: [LinkedIn](https://www.linkedin.com/in/abhijeet-jain-84486a313/)
- 💻 GitHub: [Github](https://github.com/Aj-Levi)

---

## 😁 Thanks for Visiting!

Thank you for checking out **StyleScape**! If you found this project helpful or inspiring, consider giving it a ⭐ on GitHub. Your support is appreciated! 😊

Feel free to explore, fork, and share. Happy coding! 🚀

