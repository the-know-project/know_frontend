# Liked Assets with Zustand - Usage Guide

This guide shows how to use the Zustand-based liked assets system for optimistic updates and state management.

## Overview

The system provides:
- **Optimistic Updates**: Instant UI feedback before API calls complete
- **Error Recovery**: Automatic rollback if API calls fail
- **Persistence**: Stores liked assets in localStorage
- **Server Sync**: Optional synchronization with server data
- **Performance**: Efficient selectors and minimal re-renders

## Basic Usage

### 1. Using the Unified Hook (Recommended)

```tsx
import { useAssetLike } from "../hooks/use-asset-like";

const MyComponent = ({ assetId, initialLikeCount }) => {
  const { isLiked, likeCount, toggleLike, isLoading, error } = useAssetLike({
    assetId,
    initialLikeCount,
  });

  return (
    <div>
      <button onClick={toggleLike} disabled={isLoading}>
        {isLiked ? "❤️" : "🤍"} {likeCount}
      </button>
      {error && <span className="error">{error}</span>}
    </div>
  );
};
```

### 2. Using Individual Hooks

```tsx
import { 
  useIsAssetLiked, 
  useLikeCount, 
  useLikedAssetsActions 
} from "../state/liked-assets-store";

const MyComponent = ({ assetId, initialLikeCount }) => {
  const isLiked = useIsAssetLiked(assetId);
  const likeCount = useLikeCount(assetId, initialLikeCount);
  const { addLikedAsset, removeLikedAsset } = useLikedAssetsActions();

  const handleToggle = () => {
    if (isLiked) {
      removeLikedAsset(assetId, initialLikeCount);
    } else {
      addLikedAsset(assetId, initialLikeCount);
    }
  };

  return (
    <button onClick={handleToggle}>
      {isLiked ? "❤️" : "🤍"} {likeCount}
    </button>
  );
};
```

## Server Synchronization

### Automatic Sync on App Start

```tsx
import { useSyncLikedAssets } from "../hooks/use-sync-liked-assets";

const ExploreContainer = () => {
  const { isInitialized, error } = useSyncLikedAssets();

  if (!isInitialized) {
    return <div>Loading liked assets...</div>;
  }

  return (
    <div>
      {/* Your explore content */}
    </div>
  );
};
```

### Periodic Sync

```tsx
import { usePeriodicSyncLikedAssets } from "../hooks/use-sync-liked-assets";

const App = () => {
  // Sync every 5 minutes
  const { lastSyncTime, error } = usePeriodicSyncLikedAssets(5 * 60 * 1000);

  return (
    <div>
      {lastSyncTime && (
        <small>Last sync: {lastSyncTime.toLocaleTimeString()}</small>
      )}
      {/* Your app content */}
    </div>
  );
};
```

## Store Methods

### Core Actions

```tsx
import { useLikedAssetsStore } from "../state/liked-assets-store";

const useMyComponent = () => {
  const store = useLikedAssetsStore();

  // Check if asset is liked
  const isLiked = store.isAssetLiked("asset-123");

  // Get like count with optimistic updates
  const likeCount = store.getLikeCount("asset-123", 0);

  // Add a liked asset
  store.addLikedAsset("asset-123", 42); // 42 is original count

  // Remove a liked asset
  store.removeLikedAsset("asset-123", 42);

  // Update optimistic count
  store.updateOptimisticCount("asset-123", 43);

  // Revert optimistic update
  store.revertOptimisticUpdate("asset-123");
};
```

### Bulk Operations

```tsx
import { useBulkLikeActions } from "../hooks/use-asset-like";

const AdminPanel = () => {
  const { initializeLikes, clearAllLikes } = useBulkLikeActions();

  const handleInitialize = () => {
    const userLikedAssets = ["asset-1", "asset-2", "asset-3"];
    initializeLikes(userLikedAssets);
  };

  const handleClearAll = () => {
    clearAllLikes();
  };

  return (
    <div>
      <button onClick={handleInitialize}>Initialize Likes</button>
      <button onClick={handleClearAll}>Clear All Likes</button>
    </div>
  );
};
```

## Performance Optimizations

### Selective Subscriptions

```tsx
// Only subscribe to specific asset's like status
const isLiked = useIsAssetLiked("asset-123");

// Only subscribe to specific asset's like count
const likeCount = useAssetLikeCount("asset-123", 0);

// Only subscribe to total liked count
const totalLiked = useTotalLikedCount();
```

### Memoized Components

```tsx
import { memo } from "react";

const LikeButton = memo(({ assetId, initialCount }) => {
  const { isLiked, likeCount, toggleLike, isLoading } = useAssetLike({
    assetId,
    initialLikeCount: initialCount,
  });

  return (
    <button onClick={toggleLike} disabled={isLoading}>
      {isLiked ? "❤️" : "🤍"} {likeCount}
    </button>
  );
});
```

## Error Handling

```tsx
const MyComponent = ({ assetId, initialLikeCount }) => {
  const { isLiked, likeCount, toggleLike, isLoading, error } = useAssetLike({
    assetId,
    initialLikeCount,
  });

  const handleToggle = async () => {
    try {
      await toggleLike();
    } catch (err) {
      // Handle error (already handled internally, but you can add custom logic)
      console.error("Failed to toggle like:", err);
    }
  };

  return (
    <div>
      <button onClick={handleToggle} disabled={isLoading}>
        {isLiked ? "❤️" : "🤍"} {likeCount}
      </button>
      
      {error && (
        <div className="error-message">
          Error: {error}
          <button onClick={handleToggle}>Retry</button>
        </div>
      )}
    </div>
  );
};
```

## Integration with ExploreCard

```tsx
const ExploreCard = ({ id, artName, likeCount, ...props }) => {
  const { isLiked, likeCount: currentLikeCount, toggleLike, isLoading } = useAssetLike({
    assetId: id,
    initialLikeCount: likeCount,
  });

  return (
    <div className="explore-card">
      <h3>{artName}</h3>
      
      <div className="like-section">
        <button 
          onClick={toggleLike}
          disabled={isLoading}
          className={`like-btn ${isLiked ? 'liked' : ''}`}
        >
          {isLiked ? <HeartFilled /> : <Heart />}
        </button>
        <span>{currentLikeCount}</span>
      </div>
    </div>
  );
};
```

## Best Practices

1. **Use the unified hook** (`useAssetLike`) for most cases
2. **Initialize server sync** at the app level for better UX
3. **Handle errors gracefully** with retry mechanisms
4. **Use selective subscriptions** to avoid unnecessary re-renders
5. **Test optimistic updates** thoroughly, especially error scenarios
6. **Consider periodic sync** for apps with multiple devices/sessions

## API Integration

The system expects your API endpoints to follow this pattern:

```typescript
// Like an asset
POST /api/assets/{assetId}/like
Response: { status: 200, data: { liked: true, likeCount: 43 } }

// Unlike an asset
DELETE /api/assets/{assetId}/like
Response: { status: 200, data: { liked: false, likeCount: 42 } }

// Get user's liked assets
GET /api/users/{userId}/liked-assets
Response: { 
  status: 200, 
  data: { 
    likedAssets: [
      { fileId: "asset-1", likedAt: "2023-01-01T00:00:00Z" },
      { fileId: "asset-2", likedAt: "2023-01-02T00:00:00Z" }
    ] 
  } 
}
```

## Troubleshooting

### Common Issues

1. **Store not persisting**: Check localStorage permissions
2. **Optimistic updates not reverting**: Ensure error handling is properly implemented
3. **Performance issues**: Use selective subscriptions instead of full store subscriptions
4. **Sync not working**: Verify API endpoints and authentication

### Debug Mode

```tsx
// Enable debug logging
const debugStore = useLikedAssetsStore();
console.log("Current liked assets:", debugStore.getLikedAssetIds());
console.log("Total liked count:", debugStore.getTotalLikedCount());
```
