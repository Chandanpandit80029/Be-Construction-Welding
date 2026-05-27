# 🔥 Firebase Collections Setup Guide

This guide will walk you through setting up all Firestore collections, authentication, and storage for the BE Construction & Welding Works website.

---

## 📋 Table of Contents

1. [Prerequisites](#-prerequisites)
2. [Firebase Project Setup](#-firebase-project-setup)
3. [Authentication Setup](#-authentication-setup)
4. [Firestore Collections](#-firestore-collections)
5. [Seed Data Guide](#-seed-data-guide)
6. [Collection Indexes](#-collection-indexes)
7. [Security Rules Deployment](#-security-rules-deployment)
8. [Storage Setup](#-storage-setup)
9. [Verification Checklist](#-verification-checklist)

---

## 📋 Prerequisites

- Firebase account (free tier is sufficient)
- Firebase project created
- `.env` file configured with Firebase credentials

---

## 🚀 Firebase Project Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project**
3. Enter project name: `be-construction-welding`
4. Disable Google Analytics (optional)
5. Click **Create project**

### Step 2: Register Web App

1. In project dashboard, click **Web** icon `</>` to add web app
2. Register app nickname: `be-construction-web`
3. Copy the Firebase config object to your `.env` file:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=be-construction-welding.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=be-construction-welding
   VITE_FIREBASE_STORAGE_BUCKET=be-construction-welding.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXX
   ```

### Step 3: Enable Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose location (e.g., `asia-south1` for India)
3. Start in **test mode** (we'll apply rules later)
4. Click **Enable**

### Step 4: Enable Storage (Optional)

1. Go to **Storage** → **Get started**
2. Click **Next** → **Done**

---

## 🔐 Authentication Setup

### Enable Email/Password Sign-In

1. Go to **Authentication** → **Sign-in method**
2. Click **Email/Password**
3. Enable it → **Save**

### Create Admin User

1. Go to **Authentication** → **Users** → **Add user**
2. Enter:
   - **Email:** `admin@beconstruction.com`
   - **Password:** `Admin@123456` (use a strong password)
3. Click **Add user**
4. Note the User UID (you'll need it for the admin document)

### Create Admin Document in Firestore

After creating the user, create an admin document:

```
Collection: users
Document ID: <copy the User UID from Authentication>
```

```json
{
  "email": "admin@beconstruction.com",
  "name": "Admin User",
  "role": "admin",
  "permissions": ["all"],
  "createdAt": Timestamp(January 1, 2024),
  "updatedAt": Timestamp(January 1, 2024)
}
```

---

## 🔥 Firestore Collections

### Collection Structure Overview

```
/ (root)
├── users/                    # Admin user accounts
│   └── {userId}             # Document ID = Auth UID
├── projects/                 # Project portfolio
│   └── {projectId}          # Auto-generated
├── services/                 # Service offerings
│   └── {serviceId}          # Auto-generated
├── gallery/                  # Gallery images
│   └── {galleryId}          # Auto-generated
├── testimonials/             # Client reviews
│   └── {testimonialId}      # Auto-generated
├── inquiries/                # Contact form submissions
│   └── {inquiryId}          # Auto-generated
├── quoteRequests/            # Quote requests
│   └── {quoteRequestId}     # Auto-generated
├── teamMembers/              # Team profiles
│   └── {teamMemberId}       # Auto-generated
└── websiteSettings/          # Site configuration
    └── {settingId}          # Single document
```

---

## 📁 Collection Schemas

### 1. `users` Collection

**Document ID:** Firebase Auth UID (copy from Authentication tab)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | ✅ | Admin email address |
| `name` | string | ✅ | Admin display name |
| `role` | string | ✅ | Must be `"admin"` |
| `permissions` | array | ✅ | `["all"]` for full access |
| `createdAt` | timestamp | ✅ | Account creation date |
| `updatedAt` | timestamp | ✅ | Last update date |

**Sample Document:**
```json
{
  "email": "admin@beconstruction.com",
  "name": "Admin User",
  "role": "admin",
  "permissions": ["all"],
  "createdAt": Timestamp(January 1, 2024),
  "updatedAt": Timestamp(January 1, 2024)
}
```

---

### 2. `projects` Collection

**Document ID:** Auto-generated

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Project title |
| `description` | string | ✅ | Detailed description |
| `category` | string | ✅ | Industrial / Residential / Commercial / Fabrication |
| `status` | string | ✅ | Completed / Ongoing / Planned |
| `location` | string | ❌ | Project location |
| `completionDate` | date | ❌ | When project was completed |
| `image` | string | ❌ | Main image URL (Cloudinary) |
| `images` | array | ❌ | Additional image URLs |
| `featured` | boolean | ❌ | Show on homepage |
| `createdAt` | timestamp | auto | Auto-generated |

**Sample Document:**
```json
{
  "title": "Industrial Warehouse Complex",
  "description": "Complete construction of a 50,000 sq ft industrial warehouse with steel fabrication, roofing, and welding work. Project completed ahead of schedule.",
  "category": "Industrial",
  "status": "Completed",
  "location": "Noida, UP",
  "completionDate": "2024-03-15",
  "image": "https://res.cloudinary.com/your-cloud/image/upload/v1/projects/warehouse.jpg",
  "images": [
    "https://res.cloudinary.com/your-cloud/image/upload/v1/projects/warehouse-1.jpg",
    "https://res.cloudinary.com/your-cloud/image/upload/v1/projects/warehouse-2.jpg"
  ],
  "featured": true,
  "createdAt": Timestamp(January 15, 2024)
}
```

---

### 3. `services` Collection

**Document ID:** Auto-generated

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Service name |
| `slug` | string | ✅ | URL-friendly name |
| `description` | string | ✅ | Short description |
| `icon` | string | ❌ | FontAwesome icon name |
| `features` | array | ❌ | List of features |
| `benefits` | array | ❌ | List of benefits |
| `createdAt` | timestamp | auto | Auto-generated |

**Sample Document:**
```json
{
  "title": "Welding Work",
  "slug": "welding-work",
  "description": "Professional welding services for all types of metals including steel, aluminum, and stainless steel.",
  "icon": "FaFire",
  "features": ["MIG/TIG Welding", "Arc Welding", "Spot Welding", "Pipe Welding", "Structural Welding"],
  "benefits": ["Certified welders", "High-quality materials", "Precision work", "On-time delivery"],
  "createdAt": Timestamp(January 1, 2024)
}
```

---

### 4. `gallery` Collection

**Document ID:** Auto-generated

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `src` | string | ✅ | Image URL (Cloudinary) |
| `title` | string | ✅ | Image title |
| `category` | string | ❌ | Welding / Construction / Fabrication / Industrial |
| `createdAt` | timestamp | auto | Auto-generated |

**Sample Document:**
```json
{
  "src": "https://res.cloudinary.com/your-cloud/image/upload/v1/gallery/welding-1.jpg",
  "title": "Arc Welding in Progress",
  "category": "Welding",
  "createdAt": Timestamp(February 1, 2024)
}
```

---

### 5. `testimonials` Collection

**Document ID:** Auto-generated

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Client name |
| `company` | string | ❌ | Client company |
| `rating` | number | ✅ | 1-5 stars |
| `comment` | string | ✅ | Review text |
| `project` | string | ❌ | Project type |
| `approved` | boolean | auto | Admin approval status |
| `status` | string | auto | pending / approved / rejected |
| `createdAt` | timestamp | auto | Auto-generated |

**Sample Document:**
```json
{
  "name": "Rajesh Kumar",
  "company": "Kumar Industries",
  "rating": 5,
  "comment": "Excellent work on our factory construction. The team was professional and delivered on time.",
  "project": "Industrial Warehouse",
  "approved": true,
  "status": "approved",
  "createdAt": Timestamp(March 15, 2024)
}
```

---

### 6. `inquiries` Collection

**Document ID:** Auto-generated

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Sender name |
| `email` | string | ✅ | Sender email |
| `phone` | string | ❌ | Sender phone |
| `subject` | string | ✅ | Inquiry subject |
| `message` | string | ✅ | Message content |
| `status` | string | auto | new / read |
| `source` | string | auto | contact-form |
| `createdAt` | timestamp | auto | Auto-generated |

**Sample Document:**
```json
{
  "name": "Amit Patel",
  "email": "amit@example.com",
  "phone": "+91 9876543210",
  "subject": "general",
  "message": "I am interested in your welding services for my new factory. Please contact me.",
  "status": "new",
  "source": "contact-form",
  "createdAt": Timestamp(Now)
}
```

---

### 7. `quoteRequests` Collection

**Document ID:** Auto-generated

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Requester name |
| `phone` | string | ✅ | Contact phone |
| `email` | string | ✅ | Contact email |
| `company` | string | ❌ | Company name |
| `service` | string | ✅ | Service required |
| `projectType` | string | ❌ | new / renovation / repair / extension |
| `budget` | number | ❌ | Budget amount |
| `description` | string | ✅ | Project description |
| `city` | string | ❌ | Project city |
| `state` | string | ❌ | Project state |
| `address` | string | ❌ | Full address |
| `startDate` | date | ❌ | Preferred start |
| `files` | array | ❌ | Attached file names |
| `status` | string | auto | pending / approved / rejected |
| `createdAt` | timestamp | auto | Auto-generated |

**Sample Document:**
```json
{
  "name": "Priya Sharma",
  "phone": "+91 9876543210",
  "email": "priya@example.com",
  "company": "Sharma Constructions",
  "service": "steel-fabrication",
  "projectType": "new",
  "budget": 500000,
  "description": "Need steel fabrication for a 10,000 sq ft warehouse including beams, columns, and roofing structure.",
  "city": "Delhi",
  "state": "Delhi",
  "status": "pending",
  "createdAt": Timestamp(Now)
}
```

---

### 8. `teamMembers` Collection

**Document ID:** Auto-generated

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Member name |
| `role` | string | ✅ | Job title |
| `image` | string | ❌ | Photo URL (Cloudinary) |
| `bio` | string | ❌ | Short biography |
| `createdAt` | timestamp | auto | Auto-generated |

**Sample Document:**
```json
{
  "name": "Rajesh Verma",
  "role": "CEO & Founder",
  "image": "https://res.cloudinary.com/your-cloud/image/upload/v1/team/ceo.jpg",
  "bio": "15+ years of experience in construction and welding industry.",
  "createdAt": Timestamp(January 1, 2024)
}
```

---

### 9. `websiteSettings` Collection

**Document ID:** `settings` (single document, not auto-generated)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `companyName` | string | ✅ | Company name |
| `tagline` | string | ❌ | Company tagline |
| `description` | string | ❌ | Company description |
| `email` | string | ✅ | Contact email |
| `phone` | string | ✅ | Contact phone |
| `whatsapp` | string | ❌ | WhatsApp number |
| `address` | string | ✅ | Street address |
| `city` | string | ✅ | City |
| `state` | string | ✅ | State |
| `zipCode` | string | ❌ | ZIP code |
| `facebook` | string | ❌ | Facebook URL |
| `instagram` | string | ❌ | Instagram URL |
| `twitter` | string | ❌ | Twitter URL |
| `linkedin` | string | ❌ | LinkedIn URL |
| `youtube` | string | ❌ | YouTube URL |
| `primaryColor` | string | ❌ | Theme primary color |
| `logo` | string | ❌ | Logo image URL |
| `createdAt` | timestamp | auto | Auto-generated |
| `updatedAt` | timestamp | auto | Auto-generated |

---

## 🌱 Seed Data Guide

To quickly populate your Firebase with sample data, follow these steps:

### Option 1: Manual Entry (Recommended for First Setup)

Create documents manually in Firebase Console using the schemas above.

### Option 2: Seed Script

Create a file `scripts/seed-data.js`:

```javascript
// scripts/seed-data.js
// Run with: node scripts/seed-data.js
// Note: Requires Firebase Admin SDK setup

const admin = require('firebase-admin');
const serviceAccount = require('../service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Seed Projects
const projects = [
  {
    title: "Industrial Warehouse Complex",
    description: "Complete construction of a 50,000 sq ft industrial warehouse.",
    category: "Industrial",
    status: "Completed",
    location: "Noida, UP",
    completionDate: "2024-03-15",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
    featured: true
  },
  {
    title: "Residential Villa Project",
    description: "Luxury villa with modern architecture and premium finishes.",
    category: "Residential",
    status: "Completed",
    location: "Gurugram, Haryana",
    completionDate: "2024-01-20",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    featured: true
  }
];

async function seedProjects() {
  for (const project of projects) {
    await db.collection('projects').add({
      ...project,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
  console.log('✅ Projects seeded!');
}

// Seed Team Members
const teamMembers = [
  { name: "Rajesh Verma", role: "CEO & Founder", image: "" },
  { name: "Amit Singh", role: "Project Manager", image: "" },
  { name: "Vikram Patel", role: "Senior Welder", image: "" },
  { name: "Suresh Kumar", role: "Fabrication Expert", image: "" }
];

async function seedTeam() {
  for (const member of teamMembers) {
    await db.collection('teamMembers').add({
      ...member,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
  console.log('✅ Team seeded!');
}

// Run all seeds
async function seedAll() {
  await seedProjects();
  await seedTeam();
  console.log('🎉 All data seeded!');
}

seedAll();
```

### Option 3: Use Admin Dashboard

Once Firebase is connected, use the Admin Dashboard pages to:
1. `/admin/projects` - Add projects via the form
2. `/admin/team` - Add team members
3. `/admin/gallery` - Add gallery images
4. `/admin/services` - Add custom services

---

## 🔍 Collection Indexes

Create these composite indexes in **Firestore → Indexes** to support sorting and filtering:

### Required Indexes

| Collection | Fields | Purpose |
|-----------|--------|---------|
| `projects` | `createdAt` ↓ | Sorting projects by date |
| `projects` | `category` ↑, `createdAt` ↓ | Filtering by category |
| `projects` | `featured` ↑, `createdAt` ↓ | Featured projects |
| `inquiries` | `createdAt` ↓ | Sorting inquiries by date |
| `inquiries` | `status` ↑, `createdAt` ↓ | Filtering by status |
| `quoteRequests` | `createdAt` ↓ | Sorting quotes by date |
| `quoteRequests` | `status` ↑, `createdAt` ↓ | Filtering by status |
| `testimonials` | `createdAt` ↓ | Sorting testimonials |
| `testimonials` | `approved` ↑, `createdAt` ↓ | Filtering approved |
| `gallery` | `createdAt` ↓ | Sorting gallery |
| `gallery` | `category` ↑, `createdAt` ↓ | Filtering by category |

### How to Create Indexes

1. Go to **Firestore** → **Indexes** tab
2. Click **Add Index**
3. Enter Collection ID and Fields
4. Click **Create**

---

## 🔐 Security Rules Deployment

### Method 1: Firebase Console

1. Go to **Firestore** → **Rules**
2. Copy the content from `firestore.rules`
3. Paste and click **Publish**

### Method 2: Firebase CLI

```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

---

## 📦 Storage Setup

### Create Storage Folders

In Firebase Storage, create these folders:
```
/projects/
/gallery/
/team/
/uploads/
/temp/
```

### Deploy Storage Rules

1. Go to **Storage** → **Rules**
2. Copy content from `storage.rules`
3. Paste and click **Publish**

---

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Email/Password authentication enabled
- [ ] Admin user created in Authentication
- [ ] Admin document created in `users/{uid}` with `role: "admin"`
- [ ] Firestore database created
- [ ] Collections created (9 collections)
- [ ] Indexes created for sorting/filtering
- [ ] Firestore security rules deployed from `firestore.rules`
- [ ] Firebase Storage enabled (optional)
- [ ] Storage security rules deployed from `storage.rules`
- [ ] `.env` file populated with Firebase config
- [ ] Development server running: `npm run dev`
- [ ] Admin login works at `/admin/login`
- [ ] Admin dashboard loads at `/admin`

---

## 🎯 Quick Start Checklist

```markdown
# Firebase Setup Checklist

## Phase 1: Project Setup
- [ ] Create Firebase project
- [ ] Register web app
- [ ] Copy config to .env
- [ ] Enable Firestore Database
- [ ] Enable Authentication

## Phase 2: Authentication
- [ ] Enable Email/Password sign-in
- [ ] Create admin user (admin@beconstruction.com)
- [ ] Create admin document in Firestore

## Phase 3: Collections
- [ ] users/{uid} (admin document)
- [ ] projects/ (add 2-3 sample projects)
- [ ] services/ (pre-loaded from constants)
- [ ] gallery/ (add 3-4 sample images)
- [ ] teamMembers/ (add 3-4 team members)
- [ ] websiteSettings/settings (basic config)

## Phase 4: Security
- [ ] Deploy firestore.rules
- [ ] Deploy storage.rules
- [ ] Create required indexes

## Phase 5: Verification
- [ ] npm run dev works
- [ ] http://localhost:5173 loads
- [ ] Admin login works at /admin/login
- [ ] Can add/edit/delete projects in admin
- [ ] Contact form works on public site
- [ ] Quote request form works on public site
```

---

## ❗ Troubleshooting

### "Missing or insufficient permissions"
→ Deploy firestore.rules using the CLI (Console may have formatting issues)

### "Admin login redirects to /admin/login"
→ Check that the admin document exists in Firestore with correct `role: "admin"`

### "Cannot read properties of undefined"
→ Ensure all required fields are present in the document

### "Firebase config not found"
→ Check `.env` file has all required VITE_FIREBASE_* variables
→ Restart the dev server after adding .env

### "Indexes not found"
→ Create the required composite indexes from the Indexes tab
→ Wait 1-2 minutes for indexes to build

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Data Model](https://firebase.google.com/docs/firestore/data-model)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloudinary for React](https://cloudinary.com/documentation/react_integration)

---

Built with ❤️ by **BE Construction Team** | © 2024 BE Construction & Welding Works