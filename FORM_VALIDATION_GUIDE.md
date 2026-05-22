# 📝 Form Validation Implementation Guide - React Hook Form + Zod

## Overview
Complete guide for implementing professional form validation with error handling and UX best practices.

---

## Installation (✅ Already Done)
```bash
npm install react-hook-form zod @hookform/resolvers
```

---

## Example 1: Login Form (COMPLETE)

### Component: `component/auth/LoginForm.jsx`

```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../src/schemas/validationSchemas';
import toast from 'react-hot-toast';

function LoginForm() {
  const { 
    register,           // Input binding
    handleSubmit,       // Form submission
    formState: { errors, isSubmitting }  // Error states and loading
  } = useForm({
    resolver: zodResolver(loginSchema),  // ✅ Zod validation
    mode: 'onBlur'  // Validate on blur for better UX
  });

  const onSubmit = async (data) => {
    try {
      // data is already validated by Zod
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        toast.success('Login successful!');
        // Redirect to dashboard
      } else {
        toast.error('Login failed');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-bold mb-2">
          Email Address
        </label>
        <input
          {...register('email')}  // ✅ Register field
          id="email"
          type="email"
          placeholder="your@email.com"
          className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
            errors.email ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
          }`}
        />
        {/* Display error message */}
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-bold mb-2">
          Password
        </label>
        <input
          {...register('password')}  // ✅ Register field
          id="password"
          type="password"
          placeholder="••••••••"
          className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
            errors.password ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
          }`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}  // ✅ Disable while submitting
        className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

export default LoginForm;
```

---

## Example 2: Signup Form

### Component: `component/auth/SignupForm.jsx`

```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '../../src/schemas/validationSchemas';
import toast from 'react-hot-toast';
import { sanitizationUtils } from '../../src/utils/sanitizationUtils';

function SignupForm() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    watch  // ✅ Watch field values for comparison
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'onChange'  // Real-time validation
  });

  const password = watch('password');  // Watch password field

  const onSubmit = async (data) => {
    try {
      // Sanitize data before sending
      const sanitizedData = {
        fullName: sanitizationUtils.sanitizeText(data.fullName),
        email: sanitizationUtils.sanitizeEmail(data.email),
        password: data.password,  // Never sanitize passwords!
        confirmPassword: data.confirmPassword
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedData)
      });

      if (response.ok) {
        toast.success('Account created! Please verify your email.');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="block text-sm font-bold mb-2">Full Name</label>
        <input
          {...register('fullName')}
          placeholder="Himanshu Sharma"
          className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
            errors.fullName ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-bold mb-2">Email</label>
        <input
          {...register('email')}
          type="email"
          placeholder="your@email.com"
          className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-bold mb-2">Password</label>
        <input
          {...register('password')}
          type="password"
          placeholder="••••••••"
          className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-bold mb-2">Confirm Password</label>
        <input
          {...register('confirmPassword')}
          type="password"
          placeholder="••••••••"
          className={`w-full px-4 py-2 border rounded-lg outline-none transition ${
            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Password Strength Indicator */}
      {password && (
        <div className="text-sm">
          <p className="font-bold mb-2">Password Strength:</p>
          <div className="flex gap-2">
            <div className={`h-2 flex-1 rounded ${password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div className={`h-2 flex-1 rounded ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div className={`h-2 flex-1 rounded ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div className={`h-2 flex-1 rounded ${/[!@#$%^&*]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {isSubmitting ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  );
}

export default SignupForm;
```

---

## Example 3: Address Form

### Component: `component/auth/AddressForm.jsx`

```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema } from '../../src/schemas/validationSchemas';

function AddressForm({ onSuccess }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(addressSchema)
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="block text-sm font-bold mb-2">Full Name</label>
        <input {...register('fullName')} placeholder="John Doe" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-bold mb-2">Email</label>
        <input {...register('email')} type="email" placeholder="john@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-bold mb-2">Phone Number (10 digits)</label>
        <input {...register('phone')} placeholder="9876543210" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-bold mb-2">Street Address</label>
        <textarea {...register('address')} placeholder="123 Main Street" className="w-full px-4 py-2 border border-gray-300 rounded-lg" rows="3" />
        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
      </div>

      {/* City, State, Postal Code */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-bold mb-2">City</label>
          <input {...register('city')} placeholder="Delhi" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">State</label>
          <input {...register('state')} placeholder="Delhi" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Postal Code (6 digits)</label>
          <input {...register('postalCode')} placeholder="110001" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode.message}</p>}
        </div>
      </div>

      <button type="submit" className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
        Save Address
      </button>
    </form>
  );
}

export default AddressForm;
```

---

## Example 4: Product Review Form

### Component: `component/Pages/productpage/ReviewForm.jsx`

```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewSchema } from '../../../src/schemas/validationSchemas';
import { AiFillStar } from 'react-icons/ai';

function ReviewForm({ productId, onSubmit: onSubmitProp }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5 }
  });

  const rating = watch('rating');

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        onSubmitProp(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-bold">Write a Review</h3>

      {/* Name */}
      <div>
        <label className="block text-sm font-bold mb-2">Your Name</label>
        <input {...register('userName')} placeholder="Your name" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        {errors.userName && <p className="text-red-500 text-sm">{errors.userName.message}</p>}
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-bold mb-2">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="cursor-pointer">
              <input
                {...register('rating', { valueAsNumber: true })}
                type="radio"
                value={value}
                className="hidden"
              />
              <AiFillStar
                size={32}
                className={`transition ${rating >= value ? 'text-yellow-400' : 'text-gray-300'}`}
              />
            </label>
          ))}
        </div>
        {errors.rating && <p className="text-red-500 text-sm">{errors.rating.message}</p>}
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-bold mb-2">Comment (10-500 characters)</label>
        <textarea
          {...register('comment')}
          placeholder="Share your experience with this product..."
          rows="5"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        {errors.comment && <p className="text-red-500 text-sm">{errors.comment.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

export default ReviewForm;
```

---

## Common Patterns

### Pattern 1: Async Validation (E.g., Email Uniqueness)

```jsx
import { z } from 'zod';

// Custom validation
const customSchema = z.object({
  email: z.string().email().refine(
    async (email) => {
      const response = await fetch(`/api/auth/check-email?email=${email}`);
      const data = await response.json();
      return data.available;  // true = valid, false = already exists
    },
    { message: "Email already registered" }
  )
});
```

### Pattern 2: Conditional Validation

```jsx
const schema = z.object({
  accountType: z.enum(['personal', 'business']),
  businessName: z.string().optional()
}).refine(
  (data) => data.accountType === 'business' ? !!data.businessName : true,
  { message: "Business name is required for business accounts", path: ["businessName"] }
);
```

### Pattern 3: File Upload Validation

```jsx
const fileSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files?.length > 0, "File is required")
    .refine((files) => files[0].size < 5 * 1024 * 1024, "File must be less than 5MB")
    .refine(
      (files) => ['image/jpeg', 'image/png'].includes(files[0].type),
      "Only JPEG and PNG are allowed"
    )
});
```

---

## Best Practices

### 1. Validation Mode
```jsx
useForm({
  mode: 'onBlur',    // Validate when field loses focus (less annoying)
  // mode: 'onChange',  // Real-time validation (more responsive)
  // mode: 'onSubmit'   // Only on form submission (less helpful)
})
```

### 2. Show Loading State
```jsx
const { formState: { isSubmitting } } = useForm();

<button disabled={isSubmitting}>
  {isSubmitting ? 'Loading...' : 'Submit'}
</button>
```

### 3. Handle Server Errors
```jsx
const { setError } = useForm();

try {
  const response = await submit(data);
} catch (error) {
  // Set error for specific field
  setError('email', { message: 'Email already in use' });
}
```

### 4. Always Sanitize Before Sending
```jsx
import { sanitizationUtils } from '../../src/utils/sanitizationUtils';

const onSubmit = (data) => {
  const sanitized = {
    name: sanitizationUtils.sanitizeText(data.name),
    email: sanitizationUtils.sanitizeEmail(data.email),
    comment: sanitizationUtils.sanitizeText(data.comment)
  };
  // Send sanitized data
};
```

---

## Checklist for Implementation

- [ ] Install dependencies (`react-hook-form`, `zod`, `@hookform/resolvers`)
- [ ] Create validation schemas in `src/schemas/validationSchemas.js`
- [ ] Create each form component (Login, Signup, Address, Review)
- [ ] Implement error display for each field
- [ ] Add loading states during submission
- [ ] Add sanitization before sending data
- [ ] Test validation with invalid data
- [ ] Test form submission with valid data
- [ ] Test error messages display correctly
- [ ] Test loading state on submit

---

## Troubleshooting

### Issue: Validation not triggering
- Check `zodResolver` is passed to `useForm`
- Check schema is imported correctly
- Check input has `...register('fieldName')`

### Issue: Errors not displaying
- Check `errors.fieldName` is accessed correctly
- Check conditional rendering: `{errors.fieldName && <p>...error.message</p>}`

### Issue: Fields not clearing after submit
- Add `.reset()` after successful submission

---

## Resources

- Schema definitions: `src/schemas/validationSchemas.js`
- React Hook Form: https://react-hook-form.com/
- Zod Validation: https://zod.dev/
- Sanitization: `src/utils/sanitizationUtils.js`
