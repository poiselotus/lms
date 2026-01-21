# Quick Reference Guide - LMS Authentication Implementation

## Key Changes at a Glance

### 1. Sign Up with Role Selection

- Navigate to `/signup`
- Choose account type: **Student** or **Teacher (Admin)**
- Fill in username, email, password
- Success toast confirms account creation
- Redirected to sign in

### 2. Sign In & Dashboard Access

- Login with your credentials
- Toast confirms successful sign-in
- Auto-navigated to dashboard
- **Header shows your role** (Student/Teacher)

### 3. User Profile Menu

- Click the **👤 button** in header
- View your:
  - Name
  - Email
  - Account role
- Click **Logout** to sign out

### 4. Role-Based Access Control

**Teachers can**:

- ✅ Access `/courses/create` to create courses
- ✅ Manage course content
- ✅ View all students

**Students can**:

- ✅ View course list
- ✅ Enroll in courses
- ✅ View progress
- ❌ Cannot create courses

### 5. Toast Notifications

Appears at **top-right** for:

- ✅ Account created successfully
- ✅ Signed in
- ✅ Signed out
- ✅ Password reset email sent
- ❌ Any errors (validation, authentication, permissions)

---

## Test Accounts to Create

### Teacher Account

```
Email: teacher@example.com
Password: password123
Username: Teacher Name
Role: Teacher (Admin)
```

### Student Account

```
Email: student@example.com
Password: password123
Username: Student Name
Role: Student
```

---

## File Changes Summary

| File                                | Changes                                   |
| ----------------------------------- | ----------------------------------------- |
| `package.json`                      | Added react-hot-toast                     |
| `src/context/authContext/index.jsx` | Added Toaster provider, role field        |
| `src/pages/SignUp.jsx`              | Added role selection, toast notifications |
| `src/pages/SignIn.jsx`              | Added toast notifications                 |
| `src/pages/ForgotPassword.jsx`      | Added toast notifications                 |
| `src/components/Header.jsx`         | Added profile menu, role display, logout  |
| `src/components/Header.module.css`  | Added profile dropdown styling            |
| `src/App.jsx`                       | Added TeacherRoute protection             |

---

## Firestore User Document

Each user has a document at: `users/{uid}`

```
{
  uid: "user123...",
  email: "user@example.com",
  displayName: "User Name",
  role: "teacher" or "student",
  enrolledCourses: [],
  createdAt: "2026-01-17T..."
}
```

---

## Quick Troubleshooting

### Toasts Not Showing?

1. Check `main.jsx` has `<AuthProvider>` wrapper
2. Verify internet connection
3. Check browser console for errors

### Role Not Updating?

1. Refresh browser page
2. Sign out and sign in again
3. Check Firestore user document has `role` field

### Can't Access CreateCourse as Teacher?

1. Verify your user has `role: "teacher"` in Firestore
2. Try signing out and in again
3. Check browser console for errors

### Password Reset Not Working?

1. Check email spam folder
2. Ensure email is correct
3. Check Firebase auth configuration

---

## Next Steps

1. **Customize Dashboard** for Teachers vs Students
2. **Add Course Management** for teachers
3. **Student Progress Tracking**
4. **Certificate Generation**
5. **Course Enrollment System**

---

## Support

Check `IMPLEMENTATION_SUMMARY.md` for detailed documentation of all changes.
