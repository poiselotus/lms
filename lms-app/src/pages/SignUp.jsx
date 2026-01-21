import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/authContext";
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle } from "../config/auth";
import styles from "./SignIn.module.css"; // Reusing your SignIn styles for consistency
import logo from "../images/oxfordtrans1.png";

export default function Signup() {
  const navigate = useNavigate();
  const { userLoggedIn, profile } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // Redirect if already logged in and profile exists
  useEffect(() => {
    if (userLoggedIn && profile) {
      navigate("/dashboard", { replace: true });
    }
  }, [userLoggedIn, profile, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!isRegistering) {
      setIsRegistering(true);
      try {
        // MATCHED: Named to match the export in auth.js
        await doCreateUserWithEmailAndPassword(email, password);
        toast.success("Account created! Welcome to Oxford.");
        // The authContext will catch the new user and create the Firestore profile
      } catch (error) {
        toast.error(error.message);
        setIsRegistering(false);
      }
    }
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      try {
        await doSignInWithGoogle();
      } catch (error) {
        toast.error("Google Sign up failed");
        setIsRegistering(false);
      }
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <img src={logo} alt="Oxford Academy" className={styles.logo} />
        <h2 className={styles.title}>Create your Account</h2>
        <p className={styles.subtitle}>Join the Oxford Scholar community</p>

        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              className={styles.input}
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isRegistering}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Min 6 characters"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isRegistering}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm Password</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Repeat your password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isRegistering}
            />
          </div>

          <button
            type="submit"
            disabled={isRegistering}
            className={styles.primary}
          >
            {isRegistering ? "Creating Account..." : "Sign Up"}
          </button>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <button
            type="button"
            onClick={onGoogleSignIn}
            disabled={isRegistering}
            className={styles.googleButton}
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="G" 
              style={{ width: '18px', marginRight: '10px' }} 
            />
            Sign up with Google
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}