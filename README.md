# 🏗️ BE Construction & Welding Works - Official Website

[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-11-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?logo=cloudinary)](https://cloudinary.com/)

A modern, fully functional **business website** for **BE Construction & Welding Works** built with **React + Vite + Tailwind CSS** for frontend and **Firebase** for backend/database/authentication. Images and media are managed via **Cloudinary**.

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Pages Overview](#-pages-overview)
- [Admin Dashboard](#-admin-dashboard)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Firebase Collections](#-firebase-collections)
- [Firebase Security Rules](#-firebase-security-rules)
- [API Routes](#-api-routes)
- [Deployment](#-deployment)
- [Color Theme](#-color-theme)
- [Troubleshooting](#-troubleshooting)
- [Support](#-support)

---

## 🚀 Features

### 🌐 Public Website
| Feature | Description |
|---------|-------------|
| **Home Page** | Modern hero section with CTA buttons, company overview, featured services/projects, testimonials, statistics counter, partner logos |
| **About Us** | Company story, mission & vision, team members, experience timeline, certifications, safety standards |
| **Services** | 9 service categories with detailed descriptions, benefits, features |
| **Projects** | Dynamic portfolio with filtering by category, search functionality, status badges |
| **Gallery** | Beautiful masonry layout with lightbox, category filters, zoom preview |
| **Testimonials** | Client reviews with star ratings, submission form |
| **Contact** | Contact form with Firebase storage, Google Maps integration, WhatsApp button, business hours |
| **Quote Request** | Multi-step form with service selection, budget range, file upload, project details |

### 🔒 Admin Dashboard
| Feature | Description |
|---------|-------------|
| **Dashboard Overview** | Statistics cards, recent inquiries/quotes, quick actions |
| **Project Management** | Add/Edit/Delete projects with CRUD operations |
| **Service Management** | Manage service categories and details |
| **Gallery Management** | Upload/manage images by URL |
| **Inquiry Management** | View, filter, mark as read, delete contact inquiries |
| **Quote Management** | Approve/reject/view quote requests |
| **Testimonial Management** | Approve/reject client reviews |
| **Team Management** | Add/Edit/Delete team members |
| **Settings** | Company info, contact details, social media links |

### ⚡ Technical Features
- ✅ **Responsive Design** - Mobile, tablet, desktop optimized
- ✅ **Dark/Light Theme** - Black + Yellow + White color scheme
- ✅ **Animations** - Smooth Framer Motion animations throughout
- ✅ **SEO Optimized** - Meta tags, Open Graph, Twitter cards, structured data (JSON-LD)
- ✅ **Firebase Integration** - Authentication, Firestore Database, Security Rules
- ✅ **Cloudinary Integration** - Image management configuration
- ✅ **Form Validation** - React Hook Form with real-time validation
- ✅ **Protected Routes** - Admin authentication with Firebase Auth
- ✅ **WhatsApp Button** - Floating button with quick message
- ✅ **Scroll to Top** - Automatic scroll-to-top button
- ✅ **Lazy Loading** - Images and components lazy loaded
- ✅ **Fast Loading** - Optimized Vite build

---

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 18.x |
| **Vite** | Build Tool | 8.x |
| **Tailwind CSS** | CSS Framework | 4.x |
| **Framer Motion** | Animations | 11.x |
| **React Router** | Routing | 6.x |
| **Firebase** | Backend/Auth/Database | 11.x |
| **Cloudinary** | Image Storage | Latest |
| **React Hook Form** | Form Validation | 7.x |
| **React Icons** | Icon Library | 5.x |

---

## 📄 Pages Overview

### Public Pages

#### Home Page (`/`)
- Hero section with background image and overlay
- Welcome message with company tagline
- CTA buttons: "Get Free Quote" and "View Projects"
- Quick contact bar (Phone, Email, Hours)
- About section with company highlights
- Featured services grid (6 services)
- Statistics counter (Years, Projects, Clients, Workers)
- Featured projects showcase
- Testimonials carousel
- Call-to-action section

#### About Us (`/about`)
- Page header with parallax effect
- Company overview with images
- Mission & Vision cards
- Core values (Excellence, Safety, Customer Focus, Integrity)
- Company timeline (2008-2024)
- Team members section
- Certifications showcase
- Call-to-action

#### Services (`/services`)
- Full list of 9 services with cards
- Service details: Welding, Steel Fabrication, Industrial Construction, Residential Construction, Metal Works, Roofing, Gates, Machine Welding, Civil Construction
- "Why Choose Us" section
- Process steps (Consultation → Planning → Execution → Delivery)
- Quick contact section

#### Projects (`/projects`)
- Filter by category (All, Industrial, Residential, Commercial, Fabrication)
- Search functionality
- 12+ sample projects with images
- Status badges (Completed/Ongoing)
- Location and date information
- Project detail links

#### Gallery (`/gallery`)
- Masonry grid layout
- Category filters (Welding, Construction, Fabrication, Industrial)
- Lightbox with navigation
- Keyboard navigation (Arrow keys, Escape)
- Image hover effects

#### Testimonials (`/testimonials`)
- Client reviews with star ratings
- Quote cards with author info
- Submit review form with validation
- Rating input (1-5 stars)

#### Contact (`/contact`)
- Contact info cards (Phone, Email, Address, Hours)
- Contact form with Firebase storage
- Google Maps integration
- Social media links
- Business hours display

#### Quote Request (`/quote`)
- Multi-step form: Personal Info → Project Details → Location → Description → Files
- Service selection dropdown
- Budget range selector
- File upload with preview
- Sidebar with quick info

### Admin Pages

#### Admin Login (`/admin/login`)
- Email/Password authentication
- Form validation
- Show/hide password toggle
- Remember me option
- Demo credentials display

#### Dashboard (`/admin`)
- 4 stats cards (Projects, Inquiries, Testimonials, Quotes)
- Recent inquiries list with status
- Recent quote requests with status
- Quick action buttons

#### Project Management (`/admin/projects`)
- Table view with project thumbnails
- Search projects
- Add/Edit modal form
- Delete with confirmation
- Category and status management

#### Service Management (`/admin/services`)
- Card view of all services
- Add/Edit modal form
- Delete custom services
- Combined default + custom services

#### Gallery Management (`/admin/gallery`)
- Grid view of gallery images
- Add image with URL
- Category selection
- Delete with hover overlay

#### Inquiry Management (`/admin/inquiries`)
- Table with name, email, subject, status
- View full inquiry details in modal
- Mark as read/unread
- Filter by status
- Search functionality

#### Quote Management (`/admin/quotes`)
- Filter by status (Pending, Approved, Rejected, All)
- View full quote details
- Approve/Reject actions
- Budget display

#### Testimonial Management (`/admin/testimonials`)
- Client name, rating, review display
- Approve/Pending status badges
- Approve/Reject actions
- Delete testimonials

#### Team Management (`/admin/team`)
- Team member cards with photos
- Add/Edit modal form
- Delete team members
- Photo URL upload

#### Settings (`/admin/settings`)
- Company Information (Name, Tagline, Description)
- Contact Information (Email, Phone, WhatsApp, Address, City, State)
- Social Media Links (Facebook, Instagram, Twitter, LinkedIn, YouTube)

---

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Firebase Account** (free tier works)
- **Cloudinary Account** (free tier works)

---

## 🚀 Getting Started

### 1. Clone and Install

```bash
# Navigate to project directory
cd be-construction-welding

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
VITE_CLOUDINARY_API_KEY=your-api-key

# Application Settings
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME="BE Construction & Welding Works"
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. **Enable Authentication** (Email/Password sign-in method)
4. **Create Firestore Database** (Start in test mode)
5. **Create this admin user in Authentication**:
   - Email: `admin@beconstruction.com`
   - Password: `admin123`
6. Copy your Firebase config to `.env`

### 4. Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Create a free account
3. Get your **Cloud Name** from Dashboard
4. Create an **Upload Preset** (Settings → Upload → Unsigned)
5. Copy credentials to `.env`

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

### 6. Build for Production

```bash
npm run build
# Output is in the /dist directory
```

---

## 📁 Project Structure

```
be-construction-welding/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   └── AdminSidebar.jsx        # Admin sidebar navigation
│   │   ├── layout/
│   │   │   ├── Header.jsx              # Public site header
│   │   │   └── Footer.jsx              # Public site footer
│   │   ├── shared/
│   │   │   ├── LoadingSpinner.jsx      # Loading animation
│   │   │   ├── ScrollToTop.jsx        # Scroll to top button
│   │   │   └── WhatsAppButton.jsx     # Floating WhatsApp button
│   │   └── ui/
│   │       ├── ServiceCard.jsx        # Service display card
│   │       ├── ProjectCard.jsx        # Project display card
│   │       ├── TestimonialCard.jsx    # Testimonial display card
│   │       └── SectionTitle.jsx       # Section header with animations
│   ├── config/
│   │   ├── firebase.js                # Firebase initialization
│   │   └── cloudinary.js             # Cloudinary configuration
│   ├── constants/
│   │   └── index.js                   # Static data (company info, services, etc.)
│   ├── contexts/
│   │   └── AuthContext.jsx            # Firebase Auth context provider
│   ├── hooks/
│   │   └── useFirestore.js           # Firestore CRUD hooks
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminLogin.jsx        # Admin login page
│   │   │   ├── Dashboard.jsx         # Admin dashboard
│   │   │   ├── AdminProjects.jsx     # Project management
│   │   │   ├── AdminServices.jsx     # Service management
│   │   │   ├── AdminGallery.jsx      # Gallery management
│   │   │   ├── AdminInquiries.jsx    # Inquiry management
│   │   │   ├── AdminQuotes.jsx       # Quote management
│   │   │   ├── AdminTestimonials.jsx # Testimonial management
│   │   │   ├── AdminTeam.jsx         # Team management
│   │   │   └── AdminSettings.jsx     # Website settings
│   │   ├── home/
│   │   │   └── HomePage.jsx          # Home page
│   │   ├── about/
│   │   │   └── AboutPage.jsx         # About page
│   │   ├── services/
│   │   │   └── ServicesPage.jsx      # Services page
│   │   ├── projects/
│   │   │   └── ProjectsPage.jsx      # Projects page
│   │   ├── gallery/
│   │   │   └── GalleryPage.jsx       # Gallery page
│   │   ├── testimonials/
│   │   │   └── TestimonialsPage.jsx  # Testimonials page
│   │   ├── contact/
│   │   │   └── ContactPage.jsx       # Contact page
│   │   └── quote/
│   │       └── QuotePage.jsx         # Quote request page
│   ├── App.jsx                       # Main app with routes
│   ├── main.jsx                      # Entry point
│   └── index.css                     # Global styles + Tailwind
├── .env.example                      # Environment template
├── index.html                        # HTML entry (SEO meta tags)
├── package.json                      # Dependencies
├── tailwind.config.js                # Tailwind configuration
├── vite.config.js                    # Vite configuration
└── README.md                         # This file
```

---

## 🔥 Firebase Collections

| Collection | Description | Read | Write |
|------------|-------------|------|-------|
| `users` | Admin users with roles | Auth required | Auth + Admin |
| `projects` | Project portfolio items | Public | Admin only |
| `services` | Service offerings | Public | Admin only |
| `gallery` | Gallery images | Public | Admin only |
| `testimonials` | Client reviews | Public (approved only) | Public (create) + Admin (manage) |
| `inquiries` | Contact form submissions | Admin only | Public (create) |
| `quoteRequests` | Quote request submissions | Admin only | Public (create) |
| `teamMembers` | Team member profiles | Public | Admin only |
| `websiteSettings` | Website configuration | Public | Admin only |

---

## 🔐 Firebase Security Rules

Two comprehensive rule files are included in the project root:

### `firestore.rules` - Firestore Database Rules
- Covers all 9 collections with granular access control
- Input validation on all public submissions
- Admin verified via Firestore lookup
- Rate limiting helpers
- Global deny-all fallback

### `storage.rules` - Storage Rules  
- Controls image/document upload access
- File type validation (images, PDFs, DOCX)
- 10 MB file size limit
- Organized into project/gallery/team/temp folders

### How to Deploy

**Option 1: Firebase Console**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Copy `firestore.rules` → Firestore → Rules → Paste → Publish
4. Copy `storage.rules` → Storage → Rules → Paste → Publish

**Option 2: Firebase CLI**
```bash
npm install -g firebase-tools
firebase login
firebase init firestore storage
firebase deploy --only firestore:rules,storage:rules
```

---

## 🗺️ API Routes

### Public Routes
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Home page |
| GET | `/about` | About page |
| GET | `/services` | Services page |
| GET | `/projects` | Projects page |
| GET | `/gallery` | Gallery page |
| GET | `/testimonials` | Testimonials page |
| GET | `/contact` | Contact page |
| GET | `/quote` | Quote request page |

### Admin Routes (Protected)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/login` | Admin login (public) |
| GET | `/admin` | Dashboard |
| GET | `/admin/projects` | Manage projects |
| GET | `/admin/services` | Manage services |
| GET | `/admin/gallery` | Manage gallery |
| GET | `/admin/inquiries` | Manage inquiries |
| GET | `/admin/quotes` | Manage quotes |
| GET | `/admin/testimonials` | Manage testimonials |
| GET | `/admin/team` | Manage team |
| GET | `/admin/settings` | Website settings |

---

## 🚀 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase init hosting
npm run build
firebase deploy --only hosting
```

### Manual Deployment

1. Run `npm run build`
2. Upload the `dist/` folder to any web server
3. Configure environment variables on hosting platform

---

## 🎨 Color Theme

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Yellow | `#f59e0b` | Buttons, highlights, accents |
| Primary Dark | `#d97706` | Hover states |
| Construction Black | `#1a1a1a` | Header, footer, dark sections |
| Construction Dark | `#2d2d2d` | Secondary dark backgrounds |
| Construction Gray | `#4a4a4a` | Text, borders |
| White | `#ffffff` | Backgrounds, text on dark |

### Tailwind Classes
- `bg-primary-500` → Yellow background
- `text-construction-black` → Black text
- `border-primary-500` → Yellow border
- `hover:bg-primary-600` → Darker yellow on hover

---

## 📱 Mobile Responsiveness

| Breakpoint | Width | Target |
|------------|-------|--------|
| `sm` | 640px+ | Large phones |
| `md` | 768px+ | Tablets |
| `lg` | 1024px+ | Laptops |
| `xl` | 1280px+ | Desktops |
| `2xl` | 1536px+ | Large screens |

---

## ❗ Troubleshooting

### Common Issues

**Issue: "Cannot find module"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Issue: Build fails with Tailwind errors**
The project uses Tailwind CSS v4 via the Vite plugin. Ensure `@tailwindcss/vite` is in `vite.config.js` plugins array.

**Issue: Firebase not connecting**
- Check `.env` file has correct Firebase credentials
- Ensure Firebase project has Authentication and Firestore enabled
- Check browser console for CORS errors

**Issue: Admin login not working**
- Create the user manually in Firebase Authentication
- Ensure the user document exists in Firestore `users/{uid}` with `role: "admin"`
- Or use the demo credentials: `admin@beconstruction.com` / `admin123`

---

## 📄 License

This project is proprietary and confidential. All rights reserved.

---

## 📞 Support

For support, queries, or customization requests:

- **Email:** info@beconstruction.com
- **Phone:** +91 98765 43210
- **WhatsApp:** +91 98765 43210

---

Built with ❤️ by **BE Construction Team** | © 2024 BE Construction & Welding Works