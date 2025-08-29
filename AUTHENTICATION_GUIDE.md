# Authentication Guide

This guide explains how to properly handle authentication for API calls in the POV Web application.

## Overview

The application uses a multi-layered authentication system that stores access tokens in:

1. **Cookies** (primary, used by axios interceptors)
2. **localStorage** (backup)
3. **Zustand store** (state management)

## Key Files

- `api/axios.ts` - Configured axios instance with automatic token handling
- `app/utils/auth.ts` - Authentication utilities
- `app/utils/api.ts` - API functions with authentication
- `store/userStore.ts` - User state management including access tokens

## How to Make Authenticated API Calls

### 1. Using the Configured Axios Instance (Recommended)

The `api` instance in `api/axios.ts` automatically handles authentication tokens:

```typescript
import { api } from "@/api/axios";

// The token is automatically added to requests
const response = await api.post("/events", eventData);
```

### 2. Using the Generic Authenticated API Function

For consistent error handling and authentication:

```typescript
import { authenticatedApiCall } from "@/app/utils/api";

// GET request
const events = await authenticatedApiCall<Event[]>("/events/user");

// POST request
const newEvent = await authenticatedApiCall<Event>("/events", {
  method: "POST",
  data: eventData,
});

// PUT request
const updatedEvent = await authenticatedApiCall<Event>(`/events/${eventId}`, {
  method: "PUT",
  data: updateData,
});

// DELETE request
await authenticatedApiCall(`/events/${eventId}`, {
  method: "DELETE",
});
```

### 3. Using Pre-built API Functions

For common operations, use the pre-built functions:

```typescript
import {
  createEvent,
  getUserEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "@/app/utils/api";

// Create event
const event = await createEvent(eventData);

// Get user's events
const userEvents = await getUserEvents();

// Get specific event
const event = await getEventById(eventId);

// Update event
const updatedEvent = await updateEvent(eventId, updateData);

// Delete event
await deleteEvent(eventId);
```

## Authentication Utilities

### Check if User is Authenticated

```typescript
import { isAuthenticated } from "@/app/utils/auth";

if (!isAuthenticated()) {
  // Redirect to login or show auth required message
  router.push("/sign-in");
}
```

### Get Access Token

```typescript
import { getAccessToken } from "@/app/utils/auth";

const token = getAccessToken();
if (token) {
  // Use token for custom requests
}
```

### Clear Authentication Data

```typescript
import { clearAuthData } from "@/app/utils/auth";

// Clear all auth data (logout)
clearAuthData();
```

## Error Handling

All API functions throw `ApiError` instances with proper error information:

```typescript
import { ApiError } from "@/app/utils/api";

try {
  const event = await createEvent(eventData);
} catch (error) {
  if (error instanceof ApiError) {
    console.error("API Error:", error.message);
    console.error("Status:", error.statusCode);
    console.error("Field Errors:", error.errors);
  }
}
```

## Automatic Token Refresh

The axios interceptor automatically handles token refresh when:

- A 401 error is received
- The refresh token is valid
- The request is not for authentication endpoints

## Best Practices

1. **Always use the configured axios instance** (`api`) instead of raw fetch
2. **Use the generic `authenticatedApiCall` function** for consistent error handling
3. **Check authentication before making requests** using `isAuthenticated()`
4. **Handle API errors properly** using try-catch blocks
5. **Use TypeScript types** for better type safety

## Example: Complete Component

```typescript
"use client";
import { useState, useEffect } from "react";
import { isAuthenticated } from "@/app/utils/auth";
import { getUserEvents, ApiError } from "@/app/utils/api";
import { useRouter } from "next/navigation";

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      // Check authentication first
      if (!isAuthenticated()) {
        router.push("/sign-in");
        return;
      }

      try {
        setLoading(true);
        const userEvents = await getUserEvents();
        setEvents(userEvents);
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {events.map((event) => (
        <div key={event.id}>{event.title}</div>
      ))}
    </div>
  );
}
```

## Troubleshooting

### "Please sign in" Error

If you're getting authentication errors despite being logged in:

1. Check if the token exists: `console.log(getAccessToken())`
2. Verify the token is not expired
3. Ensure you're using the configured axios instance
4. Check browser console for network errors

### Token Not Persisting

If tokens are not being saved:

1. Check if cookies are enabled
2. Verify localStorage is available
3. Ensure the sign-in process is completing successfully

### Automatic Redirects

If you're being redirected to sign-in unexpectedly:

1. Check if the refresh token is valid
2. Verify the token refresh endpoint is working
3. Check network connectivity

