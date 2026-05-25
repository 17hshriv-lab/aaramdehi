# Aaramdehi Project Report

## Cover Page
Aaramdehi: Design and Implementation of a Secure and User-Friendly E-commerce Web Application

Course: B. Tech (CSE)

Project Team:
- [Student Name 1] - [Roll Number 1]
- [Student Name 2] - [Roll Number 2]
- [Student Name 3] - [Roll Number 3]

Internal Guide: [Guide Name]

College: [Your College Name]

Year: 2026


## Certificate
This is to certify that the project report entitled "Aaramdehi: Design and Implementation of a Secure and User-Friendly E-commerce Web Application" is an original work carried out by the student(s) mentioned above under my supervision. The project has not been copied from any other source and has not been submitted earlier for the award of any degree or diploma.

Guide Name: _________________________

Signature: __________________________

Date: ______________________________


## Declaration
I/We hereby declare that the work presented in this project report is original and has been carried out by me/us under the supervision of the guide named above. The report has not been copied or plagiarized from any source.

Project Team:
- [Student Name 1] - [Roll Number 1]
- [Student Name 2] - [Roll Number 2]
- [Student Name 3] - [Roll Number 3]

Signature of Student(s): __________________________

Date: ______________________________


## Acknowledgement
I/We would like to express our sincere gratitude to our internal guide [Guide Name] for their guidance and support throughout the completion of this project. We also thank the department faculty, colleagues, and our family for their encouragement and help.


## Abstract
Aaramdehi is an e-commerce web application developed using React, Vite, and Express. The platform supports product browsing, search, comparison, wishlist, cart management, checkout, and a basic admin section. The backend uses Firebase Realtime Database with Firebase Admin SDK, while the frontend uses modern UI libraries and state management. This report highlights the objectives, methodology, design, implementation, testing, and future enhancements of the project.


## Table of Contents
1. Introduction
2. Literature Survey / Review of Literature
3. Methodology
3.1 Software and Hardware Requirements
3.2 Problem Definition
3.3 Module Definitions and Functionalities
4. Software/Hardware Design
4.1 System Architecture
4.2 UI and UX Design
4.3 Database Design
4.4 UML and Flow Diagrams
5. Implementation
5.1 Frontend Implementation
5.2 Backend Implementation
5.3 API and Integration
6. Results and Discussion
6.1 Test Cases
6.2 Output Screens and Validation
7. Conclusions
8. Future Work
9. References
10. Appendices


## 1. Introduction
Aaramdehi is an e-commerce application created to offer a secure and user-friendly shopping experience. The platform is designed for small and medium-sized businesses and includes features such as product listings, search, wishlist, shopping cart, checkout, and order history. The application also includes a configurable admin section for product and order management.


## 2. Literature Survey / Review of Literature
E-commerce applications commonly use modern web frameworks such as React for frontend and Node.js for backend development. Firebase is widely adopted for backend services due to its realtime database, authentication, and managed infrastructure. Previous studies emphasize responsive UI design, secure authentication, and efficient state management as key elements in successful online stores.


## 3. Methodology
This section describes the approach used to develop the Aaramdehi project.

### 3.1 Software and Hardware Requirements
Software Requirements:
- Operating System: Windows 10/11 or Linux
- Frontend: React, Vite, TailwindCSS, Material UI
- Backend: Node.js, Express
- Database: Firebase Realtime Database
- Authentication: JWT, Firebase Admin SDK
- Development tools: VS Code, Git, npm

Hardware Requirements:
- Processor: Intel i3 or better
- RAM: 8 GB or higher
- Storage: 50 GB available disk space
- Internet connectivity for Firebase and API calls

### 3.2 Problem Definition
Online shopping platforms can be complex and difficult to use for small businesses and customers. The goal of Aaramdehi is to create a simple, responsive, and secure web application that streamlines product discovery, checkout, and order management.

### 3.3 Module Definitions and Functionalities
- User Interface Module: Displays products, search, categories, and navigation.
- Authentication Module: Handles login, signup, and secured access.
- Product Module: Shows product list, product details, and comparison.
- Cart Module: Manages cart items, wishlist, and checkout flow.
- Order Module: Creates orders, shows order history, and completes payments.
- Admin Module: Provides management pages for products, coupons, orders, and analytics.


## 4. Software/Hardware Design
This chapter describes the design of the system and its components.

### 4.1 System Architecture
The system consists of three main layers:
- Frontend client built with React and Vite
- API layer and shared state in the frontend
- Express backend server connected to Firebase Realtime Database

The frontend uses React Router for navigation and Context API for cart and wishlist state. The backend exposes authenticated routes for products, orders, coupons, and admin actions.

### 4.2 UI and UX Design
The user interface focuses on ease of use and quick navigation. The application includes:
- A home page with featured products and banners
- Product listing and detail pages
- Search and compare functions
- Cart and checkout pages
- Account pages for profile and order history

### 4.3 Database Design
The backend uses Firebase Realtime Database as the main storage. Data entities include:
- Products
- Users
- Orders
- Coupons
- Banners

Each entity is stored in a collection-like structure in Firebase and managed by helper functions.

### 4.4 UML and Flow Diagrams
The system design includes the following diagrams:
- Use case diagram for customer and admin actions
- Sequence diagram for login and checkout flows
- Component diagram for frontend architecture
- Data flow diagram for request handling

**Block Diagram**
```text
            +------------------------+
            |    Browser / Client    |
            |   (React + Vite UI)    |
            +-----------+------------+
                        |
                        v
            +------------------------+
            |  Frontend Pages & UI   |
            |  - Home, Products      |
            |  - Product Details     |
            |  - Cart, Checkout      |
            |  - Auth Pages          |
            |  - Admin Section       |
            +-----------+------------+
                        |
                        v
            +------------------------+
            |   API Layer & State    |
            |  - CartContext         |
            |  - Wishlist Storage    |
            |  - authAndAdminApi.js  |
            |  - productApi.js       |
            +-----------+------------+
                        |
                        v
            +------------------------+
            |   Express Backend API  |
            |  - Auth Routes         |
            |  - Product Routes      |
            |  - Order Routes        |
            |  - Coupon Routes       |
            |  - Admin Routes        |
            +-----------+------------+
                        |
                        v
            +------------------------+
            | Firebase Realtime DB   |
            |  - Products            |
            |  - Users               |
            |  - Orders              |
            |  - Coupons             |
            +-----------+------------+
                        |
                        v
            +------------------------+
            |  Optional Services     |
            |  - Cloudinary          |
            |  - Email Notifications |
            |  - AI Search Sync      |
            +------------------------+
```


## 5. Implementation
This chapter describes the actual development and code implementation.

### 5.1 Frontend Implementation
The frontend uses React and Vite. Key implementation details:
- Routing in `Aaramdehi/src/src/App.jsx`
- Shared state in `src/context/CartContext.jsx`
- API helper files in `src/api/`
- UI components using TailwindCSS and Material UI

### 5.2 Backend Implementation
The backend uses Express and Firebase Admin SDK. Key features:
- REST API endpoints for products, auth, orders, coupons, and admin data
- Middleware for security and parsing requests
- Firebase helper functions for CRUD operations
- Admin routes protected by authentication

### 5.3 API and Integration
The frontend communicates with backend APIs for operations such as:
- Login and signup
- Fetching product lists and details
- Creating orders and processing checkout
- Managing coupons and user account data


## 6. Results and Discussion
This chapter presents testing outcomes and system validation.

### 6.1 Test Cases
Sample test cases include:
- User login and signup validation
- Product search and listing
- Add to cart, update quantity, and checkout
- Order placement and success flow
- Wishlist saving and moving items to cart

### 6.2 Output Screens and Validation
The application demonstrates:
- Responsive product browsing pages
- Working cart and checkout flows
- Authentication and protected pages
- Admin management pages for products and orders


## 7. Conclusions
Aaramdehi is a functioning e-commerce application built on modern web technologies. The system delivers an intuitive frontend experience and a backend architecture based on Firebase. It addresses the need for a secure and user-friendly shopping platform for small and medium-sized businesses.


## 8. Future Work
Future enhancements may include:
- Real payment gateway integration such as Razorpay or Stripe
- AI-based product recommendations and search personalization
- Mobile app support and progressive web app features
- Enhanced analytics and dashboard reporting


## 9. References
- React Documentation
- Vite Documentation
- Firebase Documentation
- Express.js Documentation
- JWT Authentication Best Practices


## 10. Appendices
### Appendix A. Project Files and Structure
- Frontend: `Aaramdehi/src/`
- Backend: `server/`
- API files: `src/api/`
- Context: `src/context/CartContext.jsx`
- Firebase helpers: `server/config/db.js`

### Appendix B. Notes on Database Usage
- The main backend uses Firebase Realtime Database.
- MongoDB code exists in the repository but is not initialized in the active server startup.

### Appendix C. Report Formatting Notes
- Use A4 paper size with margins: left 4 cm, top/bottom 3 cm, right 2 cm.
- Use Times New Roman, 12 pt font for body text.
- Use bold headings without underlines.
- Page numbers should appear at the bottom center.
