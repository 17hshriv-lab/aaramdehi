# Aaramdehi App Features, User Flow, and Architecture

## 1. App Overview
Aaramdehi is a modern web-based e-commerce application built with React and Express. It targets both customers and administrators, offering product browsing, search, cart management, checkout, orders, and a dedicated admin control panel.

## 2. Real App Features

### 2.1 Public Customer Features
- Home page with featured products and promotional content.
- Product listing page (`/products`, `/product`) that shows product categories and filters.
- Product detail page (`/product/:id`) with rich information, images, and action buttons.
- Search support for products via a search engine utility.
- Compare page (`/compare`) for side-by-side product comparison.
- Wishlist support with add/remove and move-to-cart actions.
- Cart management and persistent cart state using `CartContext` and `localStorage`.
- Checkout flow (`/checkout`) supporting order creation.
- Payment page (`/payment`) and order success page (`/order-success`).
- Blog section (`/blog`, `/blog/:slug`) for content publishing.

### 2.2 Authenticated User Features
- Login and signup pages (`/login`, `/signup`) using authentication APIs.
- Account profile settings (`/account/profile`).
- Address management (`/account/addresses`).
- PAN card information page (`/account/pan`).
- My orders page (`/orders`) showing past purchases.
- Coupons and gift card pages (`/coupons`, `/payments/giftcards`).
- Saved payment management placeholder pages for UPI and saved cards.

### 2.3 Admin and Business Features
- Admin dashboard root at `/admin`.
- Admin analytics and dashboards for sales and performance.
- Product management (`/admin/AllProducts`, `/admin/add-product`, `/admin/edit-product/:id`).
- Product category management (`/admin/categories`).
- Inventory management (`/admin/inventory`).
- Orders management (`/admin/orders`).
- Payments and refunds administration (`/admin/payments`, `/admin/refunds`).
- Coupons management (`/admin/coupons`).
- Newsletter and marketing tools (`/admin/newsletter`).
- User management (`/admin/users`).
- Reviews management (`/admin/reviews`).
- Settings and global SEO modules (`/admin/settings`, `/admin/seo-optimizer`, `/admin/seo-global`).
- Team and staff pages (`/admin/team`).
- File manager page for assets and uploads (`/admin/files`).
- Appointment scheduling section (`/admin/appointments`).
- Banners and shop management pages.

## 3. User Flow

### 3.1 Guest Product Discovery Flow
1. User opens the home page `/`.
2. User browses featured products, categories, and banners.
3. User navigates to `/products` or `/product` to filter and review products.
4. User selects a product to view details on `/product/:id`.
5. User can add the product to the cart or wishlist.
6. User can compare products via `/compare`.

### 3.2 Authentication Flow
1. User clicks login or signup from the header.
2. User enters credentials on `/login` or account data on `/signup`.
3. App sends login/register request via `authAndAdminApi.js`.
4. On success, session is maintained and user can access account pages.
5. User can update profile, addresses, and PAN details in account routes.

### 3.3 Checkout and Order Flow
1. User opens the cart and proceeds to `/checkout`.
2. Checkout page confirms shipping data and order summary.
3. User submits the order and is redirected to `/payment`.
4. Payment page handles payment process or payment confirmation.
5. After successful payment, user sees `/order-success`.
6. The order is stored via backend order APIs and visible in `/orders`.

### 3.4 Wishlist and Cart Flow
1. User saves favorite items in the wishlist using product actions.
2. Wishlist state persists in browser `localStorage` via `CartContext`.
3. User can move items from wishlist to cart.
4. Cart state updates dynamically with quantity and total count.

### 3.5 Admin Workflow
1. Admin logs in and opens `/admin`.
2. Dashboard provides quick analytics summary.
3. Admin manages products, categories, banners, coupons and inventory.
4. Admin reviews orders, updates order status, and handles refunds.
5. Admin uses SEO tools and newsletter pages for marketing.
6. Admin manages team members and file assets.

## 4. Technical Architecture

### 4.1 Frontend Architecture
- Built with React and Vite.
- Routing handled in `Aaramdehi/src/src/App.jsx` with `react-router-dom`.
- `Header`, `Footer`, and `Sidebar` provide app layout.
- Shared state for cart and wishlist managed in `src/context/CartContext.jsx`.
- API client and authentication helpers live in `src/api/axiosInstance.js`, `src/api/authAndAdminApi.js`, and `src/api/productApi.js`.
- Validation schemas use `zod`.
- UI components use Tailwind CSS, Material UI, and styled components.

### 4.2 Backend Architecture
- Backend server runs in `server/` using Express and Node.js.
- Uses Firebase Admin SDK and Firebase Realtime Database for storage and data access.
- A MongoDB/Mongoose codebase exists in the repository, but the main Express server startup path does not call `connectDB()` or initialize MongoDB.
- Routes are separated by feature modules: auth, products, orders, analytics, etc.
- Security middleware includes `helmet` and `cors`.
- Authentication is token-based, and admin-only routes are protected.
- Email notifications and order templates are supported by server utilities.

### 4.3 Integration Points
- Frontend calls backend REST APIs for products, auth, orders, coupons, and admin actions.
- Product APIs include listing, detail, search, create, update, and delete.
- Order APIs support create order, list user orders, and admin order management.
- Admin APIs require authorization headers.
- Cart and wishlist persist locally for quick client-side interaction.

## 5. Architecture Diagram (Text)

```text
                            +------------------------+
                            |      Browser Client    |
                            |  React + Vite Frontend  |
                            +------------------------+
                                       |
               +-----------------------+-------------------------+
               |                         |                       |
               |                         |                       |
     +-----------------+      +----------------------+    +------------------+
     |  Public Routes   |      |  Auth / Account      |    | Admin Routes     |
     |  /, /products,   |      |  /login, /signup,    |    | /admin/*         |
     |  /product/:id,   |      |  /account/profile,   |    |  Dashboard,      |
     |  /compare,       |      |  /orders, /wishlist  |    |  products, orders|
     |  /checkout,      |      |                      |    |  coupons, SEO    |
     |  /payment        |      +----------------------+    +------------------+
               |                         |                       |
               +-------------+-----------+-----------------------+
                             |  API Layer & State        |
                             |  - `src/api/*.js`         |
                             |  - `CartContext`          |
                             |  - `axiosInstance`        |
                             +---------------------------+
                                              |
                           +----------------------------------+
                           |      Express Backend Server      |
                           |  server/index.js + routes/*      |
                           +----------------------------------+
                                              |
                   +-------------------+------------------+
                   |                                      |
          +-------------------+                 +---------------------+
          |   Firebase Admin   |                 |   Firebase RTDB      |
          |   Authentication   |                 |  Business Data Store |
          +-------------------+                 +---------------------+
                                              |
                                 +-------------------------+
                                 |  Optional Services      |
                                 |  - Cloudinary           |
                                 |  - Email / Notifications|
                                 +-------------------------+
```

## 6. Key Technical Notes
- The app uses client-side routing with React Router and a protected admin area.
- Cart and wishlist are synchronized with browser storage for persistence.
- Admin and public APIs are split between `productApi.js` and `authAndAdminApi.js`.
- Backend order controller supports both user-specific orders and admin order management.
- The design supports future integration of payment gateways and coupon validation.

## 7. Recommended Diagram Use
For a visual diagram, use this conceptual layout:
- Browser client → React app → API layer → Express server → Database + Firebase
- Separate user-facing flows from admin flows
- Draw the shared state layer (`CartContext`) between UI and API calls

## 8. Summary
This document captures the real features, the user experience flows, and the architecture of the Aaramdehi app in English. It can be used as a basis for technical documentation, project planning, or a research paper section.
