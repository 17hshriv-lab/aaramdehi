# Header Component Migration Guide - From window.dispatchEvent to CartContext

## Current Implementation (OLD - Using window.dispatchEvent) ❌

```jsx
// In component/header/index.jsx
const Header = ({ hideNav = false }) => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.length);
  };

  const updateWishlistCount = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistCount(wishlist.length);
  };

  useEffect(() => {
    updateCartCount();
    updateWishlistCount();

    // ❌ PROBLEM: window.addEventListener causes memory leaks
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("wishlistUpdated", updateWishlistCount);
    window.addEventListener("compareUpdated", updateCompareCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("wishlistUpdated", updateWishlistCount);
      window.removeEventListener("compareUpdated", updateCompareCount);
    };
  }, []);

  return (
    <StyledBadge badgeContent={cartCount}>
      <IoCartOutline size={24} />
    </StyledBadge>
  );
};
```

---

## New Implementation (Using CartContext) ✅

```jsx
// In component/header/index.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../../src/hooks/useCart';

const Header = ({ hideNav = false }) => {
  // ✅ Get cart/wishlist data directly from context
  const { cartCount, wishlistCount } = useCart();
  
  // No need to manually update counts anymore!
  // They update automatically when cart/wishlist changes

  return (
    <StyledBadge badgeContent={cartCount}>
      <IoCartOutline size={24} />
    </StyledBadge>
  );
};
```

---

## Step-by-Step Migration

### Step 1: Add Import
```jsx
import { useCart } from '../../src/hooks/useCart';
```

### Step 2: Get Context Values
```jsx
const { 
  cartCount,        // ✅ Total items in cart
  wishlistCount,    // ✅ Total items in wishlist
  cart,             // ✅ Full cart array
  wishlist,         // ✅ Full wishlist array
  // ... other functions
} = useCart();
```

### Step 3: Remove Old State Variables
```jsx
// ❌ DELETE THESE:
const [cartCount, setCartCount] = useState(0);
const [wishlistCount, setWishlistCount] = useState(0);
const [compareCount, setCompareCount] = useState(0);

// ❌ DELETE THESE FUNCTIONS:
const updateCartCount = () => { ... };
const updateWishlistCount = () => { ... };
const updateCompareCount = () => { ... };

// ❌ DELETE THIS useEffect:
useEffect(() => {
  // All the window.addEventListener logic
}, []);
```

### Step 4: Use Context Data Directly
```jsx
// ✅ Use cartCount directly (it updates automatically)
<StyledBadge badgeContent={cartCount}>
  <IoCartOutline size={24} />
</StyledBadge>

// ✅ Use wishlistCount directly
<Tooltip title={`Wishlist (${wishlistCount})`}>
  <IconButton onClick={toggleWishlistDrawer}>
    <CiHeart size={24} />
  </IconButton>
</Tooltip>
```

### Step 5: Pass Cart to CartDrawer (If Needed)
```jsx
// CartDrawer can also use the hook directly
<CartDrawer 
  isOpen={isCartOpen} 
  onClose={toggleCartDrawer}
  // ✅ No need to pass cartItems anymore - CartDrawer gets it from context
/>
```

---

## Benefits Summary

| Feature | OLD (window.dispatchEvent) | NEW (CartContext) |
|---------|---------------------------|-------------------|
| Memory Leaks | ❌ Yes (listeners accumulate) | ✅ No (proper cleanup) |
| Real-time Updates | ❌ Manual event sync needed | ✅ Automatic (React state) |
| Code Complexity | ❌ High (event listeners) | ✅ Low (simple hook) |
| Performance | ❌ Slower (localStorage reads) | ✅ Faster (in-memory state) |
| Testing | ❌ Hard (global events) | ✅ Easy (React hooks) |
| Debugging | ❌ Hard (event tracking) | ✅ Easy (React DevTools) |

---

## Complete Migration Checklist

### Header Component
- [ ] Import `useCart` hook
- [ ] Remove `cartCount`, `wishlistCount`, `compareCount` states
- [ ] Remove `updateCartCount()`, `updateWishlistCount()`, `updateCompareCount()` functions
- [ ] Remove entire `useEffect` with window.addEventListener
- [ ] Get `cartCount` and `wishlistCount` from `useCart()`
- [ ] Update all badge/tooltip components to use context values

### CartDrawer Component
- [ ] Import `useCart` hook
- [ ] Get `cart`, `removeFromCart`, `updateCartQuantity`, `clearCart` from hook
- [ ] Remove any props that pass these from Header
- [ ] Update remove/update handlers to use context methods

### WishlistDrawer Component
- [ ] Import `useCart` hook
- [ ] Get `wishlist`, `removeFromWishlist` from hook
- [ ] Remove any localStorage management
- [ ] Update remove handlers to use context methods

### ProductDetailsPage
- [x] Already migrated to use CartContext
- [x] Using `addToCart` and `addToWishlist` from context
- [x] Using `isInWishlist` to check status

### Other Components Using Cart/Wishlist
- [ ] Search any component using `localStorage.getItem("cart")`
- [ ] Search any component using `window.dispatchEvent`
- [ ] Migrate each to use CartContext hook

---

## Verification Steps

### 1. Test Adding to Cart
```
1. Navigate to product page
2. Click "Add to Cart"
3. Verify cart count increases in header
4. Verify CartDrawer shows item
```

### 2. Test Removing from Cart
```
1. Open CartDrawer
2. Click remove button
3. Verify cart count decreases immediately
4. Verify item disappears from cart
```

### 3. Test Wishlist Toggle
```
1. Click heart icon on product
2. Verify wishlist count increases
3. Verify wishlist drawer shows item
4. Click heart again
5. Verify wishlist count decreases
```

### 4. Test Page Refresh
```
1. Add items to cart
2. Add items to wishlist
3. Refresh page (F5)
4. Verify items are still there
5. Verify counts are correct
```

---

## Common Issues & Solutions

### Issue: Wishlist count not showing
**Solution:** Make sure `WishlistDrawer` also uses `useCart` hook and gets updated wishlistCount

### Issue: Cart drawer not updating
**Solution:** Check that CartDrawer imports and uses the `useCart` hook

### Issue: Items disappear after refresh
**Solution:** CartContext saves to localStorage automatically - check browser console for errors

### Issue: "useCart must be used within CartProvider" error
**Solution:** Verify App.jsx wraps entire app with `<CartProvider>`

---

## Files to Modify

1. **component/header/index.jsx** - Primary header component
2. **component/CartDrawer/CartDrawer.jsx** - Cart drawer component
3. **component/WishlistDrawer/Wishlist.jsx** - Wishlist drawer component
4. Any other components using `localStorage.getItem("cart")` or `window.dispatchEvent`

---

## Success Criteria ✅

After migration:
- [ ] No `window.dispatchEvent` calls in codebase
- [ ] No `window.addEventListener` for cart/wishlist
- [ ] No manual `localStorage.getItem` for cart/wishlist in components
- [ ] All cart/wishlist state from CartContext
- [ ] Real-time updates working smoothly
- [ ] No console errors
- [ ] All tests passing
- [ ] Memory leaks fixed

---

## Support

For questions about CartContext, refer to:
- Implementation: `src/context/CartContext.jsx`
- Hook: `src/hooks/useCart.js`
- Guide: `CODE_QUALITY_IMPROVEMENTS.md`
