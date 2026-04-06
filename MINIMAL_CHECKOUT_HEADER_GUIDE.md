# MinimalCheckoutHeader Component Guide

## Overview
A clean, conversion-focused header designed specifically for checkout flows. It includes:
- Minimal branding (just logo)
- Centered search bar
- User profile dropdown
- Shopping cart icon with badge
- **Functional progress stepper** showing Address → Order Summary → Payment

## Location
`component/header/MinimalCheckoutHeader.jsx`

## Usage

### Basic Usage (Auto-detect current step):
```jsx
import MinimalCheckoutHeader from '@/component/header/MinimalCheckoutHeader';

export default function CheckoutPage() {
  return (
    <>
      <MinimalCheckoutHeader currentStep={1} />
      {/* Your checkout content */}
    </>
  );
}
```

### Current Implementation:
- **CheckoutPage**: `<MinimalCheckoutHeader currentStep={1} />`
- **PaymentPage**: `<MinimalCheckoutHeader currentStep={2} />`
- **OrderSuccess**: `<MinimalCheckoutHeader currentStep={3} />`

---

## Features

### 1. Logo & Branding
- **Text**: "Aaramdehi" (text-red-500, 2xl, bold)
- **Clickable**: Links to home page `/`
- **Minimalist**: Only essential branding

### 2. Search Bar
- **Desktop**: Visible and wide (centered, flex-1)
- **Mobile**: Appears below header with full width
- **Placeholder**: "Search for Products, Brands and More"
- **Border**: Light gray (border-gray-300)
- **Focus State**: Red border + subtle ring (focus:border-red-500 focus:ring-1 focus:ring-red-200)
- **Search Function**: Redirects to `/product?search={query}` on Enter key

### 3. Right Section Icons

#### User Profile
- **Icon**: Person icon
- **Desktop**: Shows "User Name" with dropdown arrow
- **Mobile**: Just shows person icon
- **Dropdown Menu**:
  - Shows user name and email
  - My Account
  - My Orders
  - Logout

#### More Menu
- **Icon**: Three dots (vertical)
- **Dropdown Options**:
  - Help Center
  - Track Order
  - Settings

#### Cart Icon
- **Icon**: Cart with red badge
- **Badge**: Shows cart item count
- **Color**: Red (text-red-500 for items)
- **Clickable**: Links to `/checkout`
- **Data**: Reads from localStorage "cart"

---

## Progress Stepper (Most Important)

### Visual States:

| State | Active | Completed | Inactive |
|-------|--------|-----------|----------|
| Color | bg-blue-600 (text-white) | bg-green-50 (text-green-600) | bg-gray-100 (text-gray-500) |
| Icon | Step Number | Checkmark (✓) | Step Number |
| Line | Green | Green | Gray |
| Label | Blue text | Green text | Gray text |

### Dynamic Based on `currentStep` Prop:

```jsx
// Step 1: Address (Complete on checkout page)
<MinimalCheckoutHeader currentStep={1} />
// Shows: [✓ Address] ─ [2 Order Summary] ─ [3 Payment]

// Step 2: Order Summary (Active on payment page)
<MinimalCheckoutHeader currentStep={2} />
// Shows: [✓ Address] ─ [2 Order Summary] ─ [3 Payment]

// Step 3: Payment (Active on success page)
<MinimalCheckoutHeader currentStep={3} />
// Shows: [✓ Address] ─ [✓ Order Summary] ─ [3 Payment]
```

### Stepper Logic:
```jsx
const steps = [
  { id: 1, label: 'Address', completed: currentStep > 1 },
  { id: 2, label: 'Order Summary', completed: currentStep > 2, active: currentStep === 2 },
  { id: 3, label: 'Payment', completed: false, active: currentStep === 3 }
];
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentStep` | number | 2 | Current step in checkout (1, 2, or 3) |

---

## Styling Details

### Colors:
- **Logo**: `text-red-500` (Aaramdehi brand color)
- **Active Step**: `bg-blue-600` (Flipkart-inspired)
- **Completed Step**: `bg-green-50` + `text-green-600`
- **Inactive Step**: `bg-gray-100` + `text-gray-500`
- **Cart Count Badge**: `bg-red-500` (red badge)

### Responsive Design:
```
Desktop (md+):
┌─ Logo ─ [Search Bar] ─ User / More / Cart ─┐
│         Stepper: [✓] ─ [2] ─ [3]           │
└────────────────────────────────────────────┘

Mobile (< md):
┌─ Logo ─ Cart ─ Menu ─┐
│  [Search Bar 2]      │
│  Stepper: [✓] ─ [2]  │
└─────────────────────┘
```

### Spacing:
- Padding: `py-3` (desktop), adjusts on screens
- Gap between icons: `gap-1 md:gap-3`
- Container: Centered with `container mx-auto px-4`
- Max search width: `max-w-md`

---

## Integration Points

### 1. Cart Count Sync
- Listens to `cartUpdated` event from localStorage
- Auto-updates badge count
- Reads from `localStorage.getItem('cart')`

### 2. User Profile Data
- Retrieves user name from `localStorage.getItem('userEmail')`
- Extracts first word as display name
- Capitalizes first letter

### 3. Search Functionality
- On Enter key press: navigates to `/product?search=${searchValue}`
- Can integrate with search API

### 4. Navigation Links
- Logo: `/` (home)
- Cart Icon: `/checkout`
- Profile: Dropdown menu (no navigation)

---

## How It's Used in Checkout Flow

### Page 1: CheckoutPage
```jsx
<MinimalCheckoutHeader currentStep={1} />
// Shows Address as complete, Order Summary as active
// User can edit address and review cart
// "Continue" button → goes to Payment
```

### Page 2: PaymentPage
```jsx
<MinimalCheckoutHeader currentStep={2} />
// Shows Order Summary as complete, Payment as active
// User can select payment method
// "Place Order" button → goes to Success
```

### Page 3: OrderSuccess
```jsx
<MinimalCheckoutHeader currentStep={3} />
// Shows all steps as complete ✓✓✓
// User sees order confirmation
// Can download invoice or track order
```

---

## Customization

### Change Active Step Color:
Change `bg-blue-600` to your preferred color (e.g., `bg-red-500`):
```jsx
className={`... ${step.active ? 'bg-red-500 text-white' : '...'}`}
```

### Add More Icons to Right Section:
```jsx
{/* Between "More Menu" and "Cart Icon" */}
<button className="p-2 hover:bg-gray-50">
  <IoNotificationsOutline size={20} />
</button>
```

### Adjust Search Bar Width:
Change `max-w-md` to `max-w-lg`, `max-w-xl`, etc.

---

## Known Behaviors

1. **Search Bar**: Hides on mobile (`hidden sm:flex`)
2. **Mobile Search**: Appears below header for small screens
3. **Dropdowns**: Click outside doesn't auto-close (click button to toggle)
4. **Cart Badge**: Reads from localStorage directly
5. **User Name**: Extracted from email (before @)

---

## Common Issues & Solutions

### Issue: Step numbers not changing color
**Solution**: Verify `currentStep` prop is passed correctly
```jsx
// ✓ Correct
<MinimalCheckoutHeader currentStep={2} />

// ✗ Wrong
<MinimalCheckoutHeader currentStep="2" /> {/* String instead of number */}
```

### Issue: Cart badge not updating
**Solution**: Make sure cart events are dispatched
```jsx
window.dispatchEvent(new Event("cartUpdated"));
```

### Issue: User name not showing
**Solution**: Check localStorage has userEmail
```javascript
localStorage.setItem('userEmail', 'john@example.com');
```

### Issue: Search bar too narrow
**Solution**: Increase max-width
```jsx
<div className="flex-1 max-w-2xl mx-4"> {/* Changed from max-w-md */}
```

---

## Browser Compatibility
- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers

## Dependencies
- React (18+)
- React Router DOM (v6+)
- Tailwind CSS
- React Icons (io5)
- Material-UI Badge & IconButton

---

## Performance Notes
- Uses `useLocation()` for route detection
- Event listeners cleaned up in useEffect
- No unnecessary re-renders (hooks properly managed)
- Badge count optimized with localStorage listeners

---

This header is designed to be:
✅ **Minimal** - No distraction, focused on checkout
✅ **Functional** - Working steppers, real cart data
✅ **Responsive** - Works on all devices
✅ **Clean** - Professional Flipkart-like design
