# Component Usage Guide

This document explains how to use the 4 new components created for Aaramdehi.

## 1. CategoriesBar Component
**Location:** `component/CategoriesBar/`

A horizontal navigation bar with circular category icons that turns red on hover.

### Usage:
```jsx
import CategoriesBar from '@/component/CategoriesBar';

export default function Home() {
  return (
    <div>
      <CategoriesBar />
      {/* Other components */}
    </div>
  );
}
```

### Features:
- Circular icons for Mattress, Pillows, Cushions, Bedsheets, Wellness
- Red hover effect on text and background
- Responsive design (scrollable on mobile)
- React Router integration for category navigation

### Customization:
Edit the `categories` array in CategoriesBar.jsx to add/remove categories:
```jsx
const categories = [
  { id: 1, name: 'Mattress', icon: IoBedOutline, path: '/category/mattress' },
  // Add more categories...
];
```

---

## 2. HeroSection Component
**Location:** `component/HeroSection/`

Main hero slider with promotional banner on the right side.

### Usage:
```jsx
import HeroSection from '@/component/HeroSection';

export default function Home() {
  return (
    <div>
      <HeroSection />
      {/* Other components */}
    </div>
  );
}
```

### Features:
- Swiper.js carousel with autoplay (3 seconds)
- Fade effect between slides
- Pagination bullets (red when active)
- Right-side static promotional banner
- Responsive layout (stacks on mobile, side-by-side on desktop)
- Hover scale effect on images
- "Shop Now" buttons with red background

### Customization:
Edit the `heroSlides` and `promotionalBanner` in HeroSection.jsx:
```jsx
const heroSlides = [
  {
    id: 1,
    title: 'Premium Cushions Collection',
    subtitle: 'Experience Ultimate Comfort',
    image: 'YOUR_IMAGE_URL',
    discount: 'Up to 50% OFF'
  },
  // Add more slides...
];

const promotionalBanner = {
  title: 'Exclusive Deal',
  subtitle: 'Summer Collection',
  description: 'Get the best home furnishing at unbeatable prices',
  image: 'YOUR_IMAGE_URL'
};
```

---

## 3. ProductRow Component
**Location:** `component/ProductRow/`

Horizontal scrolling product row with wishlist and discount percentage.

### Usage:
```jsx
import ProductRow from '@/component/ProductRow';
import { ALL_PRODUCTS_DATA } from '@/src/data/products';

export default function Home() {
  return (
    <div>
      <ProductRow 
        title="Best of Aaramdehi"
        products={ALL_PRODUCTS_DATA}
        categoryPath="/category/all"
      />
    </div>
  );
}
```

### Props:
- **title** (string): Title of the product row (e.g., "Best of Aaramdehi")
- **products** (array): Array of product objects
- **categoryPath** (string): Route path for the "View All" button

### Features:
- Horizontal scrolling container (scrollbar hidden)
- Wishlist toggle functionality
- Discount percentage badge
- Price with strikethrough for old price
- "View All" button with red background
- Rating display
- Hover scale effect on images
- LocalStorage integration for wishlist

### Product Object Format:
```jsx
{
  id: 1,
  name: "Product Name",
  brand: "Brand Name",
  price: 949,
  oldPrice: 1599,
  rating: 4.8,
  image: "https://image-url.jpg",
  category: "Pillows"
}
```

---

## 4. MainGrid Component
**Location:** `component/MainGrid/`

Responsive product grid with optional MERN backend integration.

### Usage - Local Data:
```jsx
import MainGrid from '@/component/MainGrid';

export default function ProductsPage() {
  return <MainGrid />;
}
```

### Usage - With API Endpoint:
```jsx
import MainGrid from '@/component/MainGrid';

export default function ProductsPage() {
  return (
    <MainGrid apiEndpoint="http://your-api.com/api/products" />
  );
}
```

### Props:
- **apiEndpoint** (string, optional): URL to your backend API
  - If provided, fetches from API
  - Falls back to local data on error

### Features:
- Responsive grid: 2 columns (mobile), 4 (tablet), 5 (desktop)
- Add to Cart functionality
- Wishlist toggle
- Discount percentage badge
- LocalStorage integration for cart and wishlist
- Skeleton loading animation
- API error handling with graceful fallback
- Button state: "In Cart" (green) when item is added
- Rating display

### API Response Format:
```jsx
// Your backend should return:
{
  products: [
    {
      id: 1,
      name: "Product Name",
      brand: "Brand Name",
      price: 949,
      oldPrice: 1599,
      rating: 4.8,
      image: "https://image-url.jpg"
    },
    // ... more products
  ]
}

// OR directly an array of products:
[
  { id: 1, name: "...", ... },
  { id: 2, name: "...", ... }
]
```

### MERN Backend Integration:
Setup your Express backend like this:

```javascript
// routes/products.js
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### LocalStorage Keys:
- **wishlist**: Array of wishlisted products
- **cart**: Array of items in cart with quantity

Custom events dispatched:
- `wishlistUpdated`: When wishlist changes
- `cartUpdated`: When cart changes

---

## Integrating All Components into Home Page

Here's an example of how to use all 4 components together:

```jsx
import React from 'react';
import CategoriesBar from '@/component/CategoriesBar';
import HeroSection from '@/component/HeroSection';
import ProductRow from '@/component/ProductRow';
import MainGrid from '@/component/MainGrid';
import { ALL_PRODUCTS_DATA } from '@/src/data/products';

export default function Home() {
  // Filter products by category for ProductRow
  const bestProducts = ALL_PRODUCTS_DATA.filter(p => p.rating >= 4.5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Categories */}
      <CategoriesBar />

      {/* Hero Slider with Banner */}
      <HeroSection />

      {/* Horizontal Product Row */}
      <ProductRow 
        title="Best of Aaramdehi"
        products={bestProducts}
        categoryPath="/category/bestsellers"
      />

      {/* Full Product Grid */}
      <MainGrid 
        apiEndpoint="http://localhost:5000/api/products"
      />
    </div>
  );
}
```

---

## Styling & Customization

All components use **Tailwind CSS** for styling. Here are key color classes used:

- **Primary Red:** `bg-red-500`, `text-red-500`, `hover:bg-red-600`
- **Background:** `bg-white`, `bg-gray-50`, `bg-gray-100`
- **Text:** `text-gray-900` (dark), `text-gray-400` (light)
- **Borders:** `border-gray-100`, `border-gray-200`

To customize colors globally, update your `tailwind.config.js` or override individual Tailwind classes in each component's `<style>` tag.

---

## Common Issues & Solutions

### 1. Wishlist not syncing?
- Make sure to dispatch `wishlistUpdated` event after localStorage update
- Already done in all components ✓

### 2. Cart not updating?
- Check that `localStorage.setItem()` is called
- Dispatch `cartUpdated` event
- Already done in MainGrid ✓

### 3. API not loading?
- MainGrid has automatic fallback to local data
- Check browser console for error messages
- Verify your API endpoint URL

### 4. Images not showing?
- Ensure image URLs are correct and accessible
- Check for CORS issues if loading from external domains
- Use absolute URLs, not relative paths

---

## Dependencies

Make sure these packages are installed:

```bash
npm install swiper react-router-dom react-icons axios
```

## File Structure

```
component/
├── CategoriesBar/
│   ├── CategoriesBar.jsx
│   └── index.jsx
├── HeroSection/
│   ├── HeroSection.jsx
│   └── index.jsx
├── ProductRow/
│   ├── ProductRow.jsx
│   └── index.jsx
├── MainGrid/
│   ├── MainGrid.jsx
│   └── index.jsx
├── checkout/
│   ├── CheckoutPage.jsx
│   └── index.jsx
├── payment/
│   ├── PaymentPage.jsx
│   └── index.jsx
└── auth/
    ├── AuthContainer.jsx
    └── index.jsx
```

---

# Additional Components (3 New)

## 5. CheckoutPage Component
**Location:** `component/checkout/`

A two-column checkout page with address management, order summary, and price details sidebar.

### Usage:
```jsx
import CheckoutPage from '@/component/checkout';

export default function Checkout() {
  return <CheckoutPage />;
}
```

### Features:
- Two-column layout (left: address & products, right: sticky price details)
- Address section with "Change" modal
- Product cards with quantity selector
- Wishlist toggle on each product
- Automatic price calculation (MRP, discount, delivery fee, total)
- Sticky price sidebar on desktop
- Modal for editing address with validation
- Responsive design (stacks on mobile)
- Orange "Continue" button navigation to payment page
- Empty cart state with "Continue Shopping" button

### State Management:
```jsx
// Loads from localStorage:
- cartItems: Array of products in cart
- userAddress: Object with name, address, phone, addressType
- quantities: Object tracking quantity per product
- wishlistItems: Array of wishlisted products
```

### LocalStorage Keys Used:
- `cart` - Current cart items
- `wishlist` - Wishlisted items
- Dispatches `cartUpdated` and `wishlistUpdated` events

### Navigation Integration:
Passes state to PaymentPage via `useNavigate`:
```jsx
navigate('/payment', {
  state: {
    cartItems,
    quantities,
    userAddress,
    prices
  }
});
```

---

## 6. PaymentPage Component
**Location:** `component/payment/`

Payment method selector with form validation and order placement.

### Usage:
```jsx
import PaymentPage from '@/component/payment';
import { useLocation } from 'react-router-dom';

export default function Payment() {
  return <PaymentPage />;
}
```

### Features:
- Left sidebar with 5 payment methods:
  - Credit / Debit / ATM Card
  - EMI (with 3, 6, 9 month options)
  - Net Banking (dropdown with 7 banks)
  - Cash on Delivery (COD)
  - UPI
- Active method shows green left border and white background
- Dynamic form based on selected method
- Input validation for each payment type:
  - **Card**: 16-digit number, cardholder name, MM/YY expiry, 3-4 digit CVV
  - **UPI**: Valid UPI ID format (username@bankname)
  - **Net Banking**: Bank selection dropdown
  - **EMI/COD**: No validation (proceed directly)
- Yellow "Place Order" action box with order total
- Loading state on button
- Form error messages for validation failures
- Auto-formatting for card number (4-digit groups) and expiry date

### Form Validation:
```jsx
// Card Validation
- Card Number: Must be 16 digits
- Cardholder: Required
- Expiry: Must be MM/YY format
- CVV: Must be 3-4 digits

// UPI Validation
- UPI ID: Must match pattern username@bankname

// Net Banking Validation
- Bank: Required selection
```

### Navigation Flow:
Receives state from CheckoutPage and navigates to success page:
```jsx
navigate('/order-success', {
  state: {
    orderId: 'ORD-XXXXX',
    amount: prices.total,
    method: selectedMethod,
    address: userAddress
  }
});
```

### Features:
- Responsive grid layout (1 col on mobile, 3 cols on desktop)
- Auto-focus next input on card number entry
- Backspace handling for OTP inputs
- Real-time validation
- Clear error messages

---

## 7. AuthContainer Component
**Location:** `component/auth/`

Comprehensive authentication system with Login, Forgot Password, and OTP Verification flows.

### Usage:
```jsx
import AuthContainer from '@/component/auth';

export default function AuthPage() {
  return <AuthContainer />;
}
```

### Three Authentication States:

#### 1. **Login State**
- Email/Phone number input with validation
- Password input with show/hide toggle
- "Forgot Password?" link (red text)
- "Sign In" button (red background)
- "Create Account" link for registration
- Input validation with error messages

Validation Rules:
```jsx
- Email/Phone: Valid email or 10-digit phone number
- Password: At least 6 characters
```

#### 2. **Forgot Password State**
- Email/Phone input
- "Send OTP" button
- Back to login link
- Same validation as login

#### 3. **OTP Verification State**
- 6 individual digit input boxes
- Auto-focus to next input on digit entry
- Backspace handling to previous input
- "Verify & Proceed" button
- Demo OTP indicator: **123456**
- "Resend OTP" link
- Error message display

#### 4. **Password Reset State** (after OTP verification)
- Success checkmark icon
- New password input with show/hide toggle
- Confirm password input
- "Reset Password" button
- Password validation:
  ```jsx
  - Must be at least 6 characters
  - Passwords must match
  ```

### Features:
- Toggle between states without page refresh using `setView()`
- Email validation (accepts email or 10-digit phone)
- Password field show/hide toggle with eye icon
- Real-time error validation
- Loading states on all buttons
- Responsive design (mobile-friendly)
- Clean white card styling with subtle shadow
- Gradient background (from gray-100 to white)
- Smooth transitions between screens
- LocalStorage integration:
  ```jsx
  - Saves authToken
  - Saves userEmail
  - Dispatches userLoggedIn event
  ```

### State Management:
```jsx
const [view, setView] = useState('login');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);
const [userEmail, setUserEmail] = useState('');
```

### Navigation:
- On successful login: navigates to `/`
- On successful password reset: navigates to `/`
- "Create Account" button: navigates to `/register`

### Demo Credentials:
- **OTP for Testing**: 123456

### Input Validation Examples:
```jsx
// Email Validation
validateEmail('user@example.com') // ✓ Valid
validateEmail('9876543210') // ✓ Valid
validateEmail('invalid') // ✗ Invalid

// OTP Input
- Only accepts digits 0-9
- Max 6 digits
- Auto-focus on entry
- Backspace handling
```

---

## Complete Flow: Home → Checkout → Payment → Success

Here's how to integrate all 7 components:

```jsx
// App.jsx or routing setup
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import CheckoutPage from '@/component/checkout';
import PaymentPage from '@/component/payment';
import AuthContainer from '@/component/auth';
import OrderSuccess from '@/pages/OrderSuccess';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthContainer />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
    </Router>
  );
}
```

### Flow Diagram:
```
Home (CategoriesBar + HeroSection + ProductRow + MainGrid)
  ↓
Add to Cart (cartUpdated event)
  ↓
View Cart → Checkout Page
  ↓
Edit Address (modal)
  ↓
Continue → Payment Page
  ↓
Select Payment Method
  ↓
Enter Payment Details
  ↓
Place Order → Order Success Page
```

---

## LocalStorage Events Reference

All components dispatch and listen to these events:

```javascript
// Wishlist Updates
window.dispatchEvent(new Event('wishlistUpdated'));
window.addEventListener('wishlistUpdated', syncWishlist);

// Cart Updates
window.dispatchEvent(new Event('cartUpdated'));
window.addEventListener('cartUpdated', syncCart);

// User Login
window.dispatchEvent(new Event('userLoggedIn'));
window.addEventListener('userLoggedIn', handleUserLogin);
```

### LocalStorage Keys:
```javascript
localStorage.getItem('cart')         // Cart items array
localStorage.getItem('wishlist')     // Wishlisted items array
localStorage.getItem('authToken')    // User session token
localStorage.getItem('userEmail')    // Logged-in user email
```

---

## Styling Colors Reference

| Component | Primary Color | Secondary Color | Accent Color |
|-----------|--------------|-----------------|--------------|
| All | Red#ef4444 | Gray #f3f4f6 | Orange #f97316 |
| Checkout | Red | Gray | Orange |
| Payment | Green (active) | Yellow (action) | Red/Gray |
| Auth | Red | White | Gray |

---

## Troubleshooting Guide

### CheckoutPage Issues:
1. **Cart is empty**: Items not saved to localStorage
   - Check CartDrawer saves items with `localStorage.setItem('cart', ...)`

2. **Quantities not updating**: State not persisting
   - Ensure `handleQuantityChange` updates state
   - Verify localStorage sync in useEffect

3. **Address modal not appearing**: Modal state issue
   - Check `showAddressModal` state management
   - Verify modal render condition

### PaymentPage Issues:
1. **Form validation not working**: Input not clearing errors
   - Add `onChange` handler to clear error for that field
   - Verify validation function logic

2. **Auto-format not working**: Card/expiry fields
   - Check regex patterns in handler functions
   - Ensure `slice(-1)` for card number formatting

3. **Navigation failing**: State not passed correctly
   - Verify CheckoutPage passes complete state object
   - Check `useLocation().state` destructuring

### AuthContainer Issues:
1. **OTP inputs not auto-focusing**: Focus not working
   - Verify `document.getElementById('otp-${index + 1}')` returns element
   - Check input has correct id attribute

2. **Password toggle not showing**: Eye icon visibility
   - Check `showPassword` state updates
   - Verify icon renders correctly based on state

3. **Validation errors persisting**: Errors not clearing
   - Add `onChange` handlers to clear specific error
   - Test validation function independently

---

## Performance Optimization Tips

1. **Memo components** to prevent unnecessary re-renders:
   ```jsx
   const ProductCard = React.memo(({ product }) => {...});
   ```

2. **Lazy load PaymentPage** to improve initial load:
   ```jsx
   const PaymentPage = React.lazy(() => import('@/component/payment'));
   ```

3. **Debounce validation** for large forms:
   ```jsx
   import { debounce } from 'lodash';
   const debouncedValidate = debounce(validateForm, 300);
   ```

4. **Cache API responses** for product data:
   ```jsx
   const cachedProducts = localStorage.getItem('products_cache');
   ```

---
