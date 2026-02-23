# 📄 Product Requirements Document (PRD)

## 🧩 Product Name

**PulsePost**

---

# 1. 🎯 Product Overview

**PulsePost** is a lightweight Twitter-style microblogging platform where users can create, view, edit, and delete short posts ("tweets") with optional images.

The system uses:

* **Frontend:** Next.js (UI layer)
* **Backend:** Django + Django REST Framework (API layer)
* **Auth:** Django Authentication
* **Database:** PostgreSQL (recommended) or SQLite (dev)

The goal of Phase 1 is to build a clean, scalable CRUD foundation before adding advanced features.

---

# 2. 🚀 Goals

## Primary Goals

* Allow users to view public tweets
* Allow authenticated users to create tweets
* Support image upload with tweets
* Allow users to edit/delete their own tweets
* Provide admin dashboard for moderation
* Maintain clean API architecture

## Secondary Goals (Later Phases)

* Likes
* Comments
* AI tweet suggestions
* Infinite scroll
* User profiles
* Follow system

---

# 3. 👥 User Roles

## 3.1 Guest User

Can:

* View public tweets

Cannot:

* Create tweets
* Edit/delete tweets

---

## 3.2 Authenticated User

Can:

* View tweets
* Create tweets
* Edit own tweets
* Delete own tweets

---

## 3.3 Admin (Superuser)

Can:

* Manage users
* Manage tweets
* Access Django admin panel
* Moderate content

---

# 4. 🗺️ User Flow

## Main Flow

User opens site
→ Next.js loads feed
→ Next.js calls Django API
→ Tweets displayed

---

## Create Tweet Flow

User clicks **Create Tweet**
→ Form opens
→ User enters text + optional image
→ Next.js sends POST to Django
→ Tweet saved
→ Redirect to feed
→ New tweet visible

---

## Edit Tweet Flow

User clicks Edit
→ Form prefilled
→ User updates
→ PUT request to API
→ Redirect to feed

---

## Delete Tweet Flow

User clicks Delete
→ Confirmation
→ DELETE request
→ Tweet removed
→ Feed refreshed

---

# 5. 🧱 System Architecture

## Frontend (Next.js)

Responsibilities:

* UI rendering
* Form handling
* API calls
* Client routing
* Image preview (optional)

---

## Backend (Django + DRF)

Responsibilities:

* Business logic
* Database operations
* Authentication
* Media storage
* API responses

---

## Communication

Protocol: **REST API (JSON)**

Flow:

Next.js → HTTP → Django API → Database → JSON → Next.js

---

# 6. 🔌 API Design (Phase 1)

## Base URL

```
/api/
```

---

## 6.1 Get All Tweets

**GET** `/api/tweets/`

Purpose: Fetch public tweets

Response:

* id
* text
* image
* author
* created_at

---

## 6.2 Create Tweet

**POST** `/api/tweets/`

Auth required: ✅

Payload:

* text
* image (optional)

---

## 6.3 Update Tweet

**PUT/PATCH** `/api/tweets/{id}/`

Auth required: ✅
Permission: owner only

---

## 6.4 Delete Tweet

**DELETE** `/api/tweets/{id}/`

Auth required: ✅
Permission: owner only

---

# 7. 🗃️ Data Models

## Tweet Model

Fields:

* id
* user (ForeignKey)
* text (TextField)
* image (ImageField, optional)
* created_at (DateTime)
* updated_at (DateTime)

---

## User Model

Using Django default user model (Phase 1).

---

# 8. 🔐 Authentication Strategy

Phase 1:

* Django session auth
* Login required for create/edit/delete
* Public read access

Future:

* JWT or Clerk (optional upgrade)

---

# 9. 📁 Media Handling

Requirements:

* Store uploaded images
* Serve media to Next.js
* Support multipart uploads

Key Django concepts:

* MEDIA_ROOT
* MEDIA_URL
* ImageField

---

# 10. 🛡️ Permissions

## Public

* Read tweets

## Authenticated user

* Create tweet
* Edit own tweet
* Delete own tweet

## Admin

* Full control

---

# 11. 🎨 Frontend Routes (Next.js)

* `/` → Tweet feed
* `/create` → Create tweet page
* `/edit/[id]` → Edit tweet
* `/login` → Login page (later)
* `/register` → Register page (later)

---

# 12. ⚙️ Non-Functional Requirements

* Clean REST structure
* Mobile responsive UI
* Proper error handling
* Secure file upload
* CSRF protection
* CORS enabled
* Fast load time

---

# 13. 🚧 Phase Roadmap

## Phase 1 (Current)

* Core tweet CRUD
* Image upload
* Public feed
* Django auth
* Admin panel

## Phase 2

* Likes
* Comments
* Pagination
* User profiles

## Phase 3

* AI tweet assist (your “prompt + antigravity” phase 😎)
* Realtime updates
* Notifications
* Follow system

---

# 14. ✅ Definition of Done

Phase 1 is complete when:

* Tweets can be created with image
* Feed shows tweets correctly
* Edit/delete restricted to owner
* Admin panel functional
* Next.js fully integrated with Django API
* No console errors
* Media loads correctly

---

# 🧠 Senior Note

You are building the **correct foundation**.

If Phase 1 is clean:

➡️ Scaling becomes easy
➡️ AI features plug in smoothly
➡️ Real startup patterns unlocked

---

**Next step (when you say go):**

I will give you the **exact Django backend build order** — step-by-step like a senior dev playbook.

Just say:

> **"Start backend build"** 🚀
