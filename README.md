# 🏛️ Chikoti Real Estate — Full Stack Platform

A complete real estate platform with **5 separate folders**, one shared database, and a clear approval workflow.

---

## 📁 Project Structure

```
chikoti/
├── buyer-portal/      → www.chikotirealestate.com    (React, port 3001)
├── seller-portal/     → seller.chikotirealestate.com (React, port 3002)
├── admin-portal/      → admin.chikotirealestate.com  (React, port 3003)
├── backend/           → api.chikotirealestate.com    (Node.js, port 5000)
└── shared/            → Constants, utils, schema (shared across all)
```

---

## 🗄️ Database Schema

**One MySQL database — 6 tables:**

| Table             | Purpose                              |
|-------------------|--------------------------------------|
| `users`           | All users (admin, seller, buyer)     |
| `properties`      | All property listings with status    |
| `property_images` | Multiple images per property         |
| `inquiries`       | Buyer inquiries to sellers           |
| `favorites`       | Buyer saved properties               |
| `sessions`        | JWT session tracking                 |

---

## ✅ Complete Flow

```
Seller Portal          Backend API           Admin Portal
     │                     │                      │
     │  POST /properties   │                      │
     │──────────────────►  │  status = 'pending'  │
     │                     │◄─────────────────────│
     │                     │  PATCH /status=approved
     │                     │                      │
     │                     │  status = 'approved' │
     │                     │                      │
Buyer Portal               │
     │  GET /properties    │
     │──────────────────►  │  (only approved)
     │◄──────────────────  │
```

---

## 🚀 Quick Start

### 1. Setup Database

```bash
mysql -u root -p < shared/src/constants/schema.sql
```

### 2. Start Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
npm install
npm run dev
# Runs on http://localhost:5000
```

### 3. Start Buyer Portal

```bash
cd buyer-portal
npm install
npm run dev
# Runs on http://localhost:3001
```

### 4. Start Seller Portal

```bash
cd seller-portal
npm install
npm run dev
# Runs on http://localhost:3002
```

### 5. Start Admin Portal

```bash
cd admin-portal
npm install
npm run dev
# Runs on http://localhost:3003
```

---

## 🔑 Demo Credentials

| Role   | Email                          | Password     |
|--------|--------------------------------|--------------|
| Admin  | admin@chikotirealestate.com   | admin123     |
| Seller | seller@test.com               | seller123    |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint              | Description       |
|--------|-----------------------|-------------------|
| POST   | /api/auth/register    | Register user     |
| POST   | /api/auth/login       | Login             |
| GET    | /api/auth/me          | Current user info |

### Properties (Public)
| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| GET    | /api/properties                   | All approved properties  |
| GET    | /api/properties/featured          | Featured properties      |
| GET    | /api/properties/:id               | Single property + view++ |

### Properties (Seller — Auth Required)
| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| POST   | /api/properties                   | Create listing (pending) |
| GET    | /api/properties/seller/mine       | My listings              |
| DELETE | /api/properties/:id               | Delete listing           |

### Admin (Admin Role Required)
| Method | Endpoint                              | Description              |
|--------|---------------------------------------|--------------------------|
| GET    | /api/admin/stats                      | Platform stats           |
| GET    | /api/admin/properties?status=pending  | Filter by status         |
| PATCH  | /api/admin/properties/:id/status      | Approve / Reject         |
| GET    | /api/admin/users                      | All users                |
| PATCH  | /api/admin/users/:id                  | Toggle active/verified   |
| GET    | /api/admin/inquiries                  | All inquiries            |

### Inquiries
| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| POST   | /api/inquiries            | Send inquiry (public)    |
| GET    | /api/inquiries/seller     | My property inquiries    |

---

## 🏗️ Tech Stack

| Layer      | Technology                       |
|------------|----------------------------------|
| Frontend   | React 18 + Vite                  |
| Styling    | Pure CSS (no framework needed)   |
| Maps       | Leaflet.js + OpenStreetMap       |
| Backend    | Node.js + Express                |
| Database   | MySQL + mysql2                   |
| Auth       | JWT (jsonwebtoken + bcryptjs)    |
| Images     | Base64 → disk storage (multer)   |

---

## 🌍 Production Deployment

```
www.chikotirealestate.com      → buyer-portal/dist/
seller.chikotirealestate.com   → seller-portal/dist/
admin.chikotirealestate.com    → admin-portal/dist/
api.chikotirealestate.com      → backend/ (PM2 / systemd)
```

**Recommended hosting:** VPS (DigitalOcean / Hostinger / AWS EC2) + Nginx reverse proxy

```nginx
# /etc/nginx/sites-available/chikoti
server {
    server_name api.chikotirealestate.com;
    location / { proxy_pass http://localhost:5000; }
}
server {
    server_name www.chikotirealestate.com;
    root /var/www/buyer-portal/dist;
    try_files $uri $uri/ /index.html;
}
```

---

## 📦 Build for Production

```bash
# Build all portals
cd buyer-portal  && npm run build
cd seller-portal && npm run build
cd admin-portal  && npm run build
```

---

*© 2024 Chikoti Real Estate. All rights reserved.*
