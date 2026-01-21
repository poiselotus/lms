# Component Architecture - Authentication & User Profile

## Context Flow Diagram

```
main.jsx
  └─ AuthProvider (with Toaster)
      ├─ Toast Notifications System
      └─ App.jsx
          ├─ PublicRoute
          │   ├─ SignUp (with role selection)
          │   ├─ SignIn (with toast feedback)
          │   └─ ForgotPassword (with toast feedback)
          │
          ├─ ProtectedRoute
          │   ├─ Dashboard
          │   │   └─ Header (with profile menu)
          │   ├─ CourseList
          │   └─ StudentProgress
          │
          └─ TeacherRoute
              └─ CreateCourse
```

## Authentication State

```
AuthContext
├─ currentUser: { uid, email, displayName }
├─ profile: { uid, email, displayName, role, enrolledCourses, createdAt }
├─ userLoggedIn: boolean
├─ loading: boolean
└─ signOut(): Promise
```

## Component Responsibilities

### Sign Up Page

- **Inputs**: Username, Email, Password, Role dropdown
- **Actions**:
  - Validate inputs
  - Create Firebase Auth user
  - Create Firestore user document with role
  - Send verification email
  - Show toast notifications
  - Redirect to Sign In
- **Errors**: Toast error messages

### Sign In Page

- **Inputs**: Email, Password
- **Actions**:
  - Authenticate with Firebase
  - Load user profile from Firestore
  - Show success toast
  - Auto-redirect to Dashboard
- **Errors**: Toast error messages for invalid credentials

### Header Component

- **Displays**:
  - Welcome message with user name
  - User role badge (Student/Teacher)
  - Profile button
- **Features**:
  - Profile dropdown with:
    - User name
    - Email address
    - Role badge
    - Logout button
  - Smooth animations
  - Hover effects
- **Actions**:
  - Toggle profile menu
  - Logout and redirect to SignIn

### Routing

#### Public Routes (Unauthenticated only)

- `/signin` - Sign In page
- `/signup` - Sign Up page
- `/forgot-password` - Password Reset

#### Protected Routes (All authenticated users)

- `/dashboard` - Main dashboard
- `/courses` - Course list
- `/student-progress` - Student progress

#### Teacher-Only Routes

- `/courses/create` - Create new course
  - Students get redirected with error toast
  - Only teachers can access

## Data Flow

### Sign Up Flow

```
User fills form
  ↓
Validation (toast errors if invalid)
  ↓
Create Auth user (Firebase)
  ↓
Create Profile doc (Firestore) with role
  ↓
Send verification email
  ↓
Success toast
  ↓
Redirect to SignIn
```

### Sign In Flow

```
User enters credentials
  ↓
Firebase Auth check
  ↓
Success? → Load profile from Firestore
  ↓
Store in AuthContext
  ↓
Toast success
  ↓
Auto-redirect to Dashboard
```

### Profile Access Flow

```
Click 👤 button in header
  ↓
Toggle dropdown menu
  ↓
Display user info from AuthContext.profile:
  - displayName
  - email
  - role (formatted as badge)
  ↓
User can click logout
  ↓
Call signOut() from AuthContext
  ↓
Show success toast
  ↓
Redirect to SignIn
```

## Component Props & State

### Header Component

```jsx
Props: (none - uses AuthContext)

State:
- showProfile: boolean (dropdown visibility)

Context Usage:
- profile: { displayName, email, role }
- loading: boolean
- signOut: function
```

### Sign Up Component

```jsx
Props: (none)

State:
- username: string
- email: string
- password: string
- role: "student" | "teacher"
- loading: boolean

Actions:
- submit(e): async - handle signup
```

### Sign In Component

```jsx
Props: (none)

State:
- email: string
- password: string
- loading: boolean

Actions:
- submit(e): async - handle signin
- googleSignIn(): async - Google OAuth signin
```

## Role-Based Access Implementation

### TeacherRoute Component

```jsx
function TeacherRoute({ children }) {
  const { profile, loading } = useAuth();

  // Check 1: Still loading auth
  if (loading) return null;

  // Check 2: Not authenticated
  if (!profile) return <Navigate to="/signin" />;

  // Check 3: Not a teacher
  if (profile.role !== "teacher") {
    toast.error("Only teachers can access this page");
    return <Navigate to="/dashboard" />;
  }

  return children;
}
```

## Toast Notification System

### Configured in AuthContext

```javascript
<Toaster
  position="top-right"
  reverseOrder={false}
  gutter={8}
  toastOptions={{
    duration: 4000,
    style: {
      background: "#363636",
      color: "#fff",
    },
  }}
/>
```

### Usage Examples

```javascript
// Success
toast.success("Account created successfully!");

// Error
toast.error("Invalid email or password");

// Info (future)
toast("Notification text");
```

## Environment Setup

### Required Firebase Configuration

- Authentication enabled
- Email/password sign-in enabled
- Google OAuth configured (optional)
- Firestore database setup

### Required Collections

- `users` - User profiles with role

### User Document Schema

```
users/{uid}
├─ uid: string
├─ email: string
├─ displayName: string
├─ role: "student" | "teacher"
├─ enrolledCourses: array
└─ createdAt: timestamp
```

## Security Rules Example (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }

    // Teachers can create/write courses
    match /courses/{courseId} {
      allow read: if request.auth != null;
      allow create, write: if request.auth != null &&
                            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "teacher";
    }
  }
}
```

---

## Performance Considerations

1. **Auth Context**: Only re-renders when auth state changes
2. **Toast Notifications**: Lightweight library with minimal overhead
3. **Profile Dropdown**: Only renders when needed
4. **Role Checks**: Done client-side + backend (Firestore rules)

## Future Enhancements

- [ ] Profile editing page
- [ ] Avatar/profile pictures
- [ ] Two-factor authentication
- [ ] Admin panel for super-users
- [ ] Student-teacher messaging
- [ ] Course progress analytics
