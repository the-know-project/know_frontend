# Enhanced Authentication System Migration Guide

## Overview

This guide helps you migrate from the current authentication system to the new Enhanced Authentication System that provides better token management, activity tracking, and more reliable session handling.

## Key Improvements

### 🔄 Better Token Refresh Logic
- **Activity-based refresh**: Tokens only refresh when users are active
- **Smarter thresholds**: 15-minute threshold instead of 5 minutes
- **Network error tolerance**: Won't logout on temporary network issues
- **Reduced API calls**: Less frequent refresh attempts

### 📱 Enhanced User Experience
- **No mid-session logouts**: Users won't be logged out while actively using the app
- **Graceful error handling**: Better recovery from network issues
- **Debug information**: Development mode shows auth status

### ⚡ Performance Optimizations
- **Activity tracking**: Monitors user interaction to avoid unnecessary refreshes
- **Debounced operations**: Prevents multiple simultaneous refresh attempts
- **Smart intervals**: Longer check intervals reduce background processing

## Migration Steps

### Step 1: Update Root Layout/App Component

**Before:**
```tsx
import { AuthProvider } from "@/src/features/auth/components/auth-provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

**After:**
```tsx
import { EnhancedAuthProvider } from "@/src/features/auth/components/enhanced-auth-provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <EnhancedAuthProvider
          enableAutoRefresh={true}
          refreshThresholdMinutes={15}
          checkInterval={60000} // 1 minute
        >
          {children}
        </EnhancedAuthProvider>
      </body>
    </html>
  );
}
```

### Step 2: Update Auth Status Hooks

**Before:**
```tsx
import { useStableAuthStatus } from "@/src/features/auth/hooks/use-stable-auth-status";

const MyComponent = () => {
  const { isAuthenticated, user, role, isLoading } = useStableAuthStatus();
  // ...
};
```

**After:**
```tsx
import { useEnhancedAuthContext } from "@/src/features/auth/components/enhanced-auth-provider";

const MyComponent = () => {
  const { 
    isAuthenticated, 
    user, 
    role, 
    isLoading,
    tokenInfo, // New: detailed token information
    refreshTokens, // New: manual refresh function
    clearError // New: error management
  } = useEnhancedAuthContext();
  
  // Optional: Show token debug info in development
  console.log('Token expires in:', tokenInfo.timeUntilExpiryMinutes, 'minutes');
  
  // ...
};
```

### Step 3: Update Token Utilities (Optional)

**Before:**
```tsx
import { TokenUtils } from "@/src/features/auth/utils/token.utils";

// Checking auth status
const isAuth = TokenUtils.IsAuthenticated();

// Manual refresh
await TokenUtils.refreshIfNeeded();

// Logout
await TokenUtils.logout();
```

**After:**
```tsx
import { EnhancedTokenUtils } from "@/src/features/auth/utils/enhanced-token.utils";

// Checking auth status (more reliable)
const isAuth = EnhancedTokenUtils.isAuthenticated();

// Smart refresh (activity-aware)
const result = await EnhancedTokenUtils.smartRefresh();

// Logout with proper cleanup
await EnhancedTokenUtils.logout();

// Debug token state (development)
EnhancedTokenUtils.debugTokenState();
```

### Step 4: Update HTTP Client (Already Done)

The HTTP client has been automatically updated to use the enhanced token utilities. No changes needed in your API calling code.

### Step 5: Remove Old Auth Hooks (Optional)

You can gradually replace instances of:
- `useStableAuthStatus` → `useEnhancedAuthContext`
- `useAuthStatus` → `useEnhancedAuthContext`
- `TokenUtils` → `EnhancedTokenUtils`

## Configuration Options

### EnhancedAuthProvider Props

```tsx
interface EnhancedAuthProviderProps {
  children: React.ReactNode;
  
  // Routes that don't require authentication
  publicRoutes?: string[]; // Default: ["/login", "/register", "/", "/about", "/contact"]
  
  // Where to redirect on auth failure
  redirectTo?: string; // Default: "/login"
  
  // Enable automatic token refresh
  enableAutoRefresh?: boolean; // Default: true
  
  // How many minutes before expiry to refresh
  refreshThresholdMinutes?: number; // Default: 15
  
  // How often to check auth status (ms)
  checkInterval?: number; // Default: 60000 (1 minute)
  
  // Custom fallback component
  fallback?: React.ComponentType<{
    error: string | null;
    retry: () => void;
    isLoading: boolean;
  }>;
}
```

### Example Custom Configuration

```tsx
<EnhancedAuthProvider
  publicRoutes={["/", "/login", "/register", "/about"]}
  redirectTo="/signin"
  enableAutoRefresh={true}
  refreshThresholdMinutes={20} // Refresh 20 minutes before expiry
  checkInterval={120000} // Check every 2 minutes
  fallback={CustomAuthFallback}
>
  {children}
</EnhancedAuthProvider>
```

## Backend Recommendations

To fully benefit from this enhanced system, consider these backend changes:

### 1. Longer Access Token Lifespan
```javascript
// Recommended: 1-2 hours instead of 15 minutes
const accessTokenExpiry = '2h';
```

### 2. Refresh Token Rotation (Security Best Practice)
```javascript
// Issue new refresh token on each refresh
app.post('/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  
  // Validate old refresh token
  const payload = jwt.verify(refreshToken, secret);
  
  // Generate new tokens
  const newAccessToken = jwt.sign(userPayload, secret, { expiresIn: '2h' });
  const newRefreshToken = jwt.sign(userPayload, secret, { expiresIn: '7d' });
  
  // Invalidate old refresh token
  await invalidateRefreshToken(refreshToken);
  
  res.json({
    status: 200,
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: userPayload
    }
  });
});
```

### 3. Rate Limiting for Refresh Endpoint
```javascript
// Prevent abuse of refresh endpoint
app.use('/auth/refresh', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // limit each IP to 10 requests per windowMs
}));
```

## Debugging

### Development Debug Info

In development mode, you'll see a 🔐 button in the bottom right corner that shows:
- Token status
- Time until expiry
- User activity status
- Refresh count

### Console Logging

The enhanced system provides detailed console logging:
- `🔄` Token refresh attempts
- `✅` Successful operations
- `❌` Errors and failures
- `🚨` Critical auth failures
- `📱` State changes

### Manual Debugging

```tsx
import { EnhancedTokenUtils } from "@/src/features/auth/utils/enhanced-token.utils";

// Log complete token state
EnhancedTokenUtils.debugTokenState();

// Get detailed token info
const info = EnhancedTokenUtils.getTokenInfo();
console.table(info);
```

## Rollback Plan

If you need to rollback to the old system:

1. Replace `EnhancedAuthProvider` with `AuthProvider`
2. Replace `useEnhancedAuthContext` with `useStableAuthStatus`
3. Replace `EnhancedTokenUtils` with `TokenUtils`
4. The HTTP client will continue to work but will be less intelligent about token refresh

## Testing

### Test Scenarios

1. **Active User Session**: User should stay logged in while actively using the app
2. **Inactive User**: Token should refresh less frequently when user is inactive
3. **Network Issues**: Temporary network errors shouldn't cause logout
4. **Token Expiry**: Expired tokens should refresh automatically before API calls
5. **Refresh Token Expiry**: Should gracefully redirect to login when refresh fails

### Test Commands

```bash
# Test with network issues
# Open dev tools → Network → Throttling → Slow 3G

# Test token expiry
# In console: EnhancedTokenUtils.debugTokenState()
# Check timeUntilExpiryMinutes

# Test inactive user
# Leave tab inactive for 5+ minutes, then interact
```

## FAQ

### Q: Will this break my existing app?
A: No, it's designed to be a drop-in replacement. The API surface is mostly the same with additional features.

### Q: How do I know if the migration worked?
A: Check the console logs for the new emoji indicators (🔄, ✅, ❌) and verify that users aren't getting logged out unexpectedly.

### Q: Can I use both systems simultaneously?
A: Not recommended. Choose one system to avoid conflicts.

### Q: What if I want to customize the auth flow?
A: The enhanced system provides more hooks and options. Check the configuration section above.

### Q: How do I handle the new error states?
A: Use the `clearError` function from `useEnhancedAuthContext()` to handle recoverable errors gracefully.

## Support

If you encounter issues during migration:

1. Check the console for detailed error messages
2. Use `EnhancedTokenUtils.debugTokenState()` to inspect token state
3. Verify your backend token expiration times
4. Test with the debug UI in development mode