import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/authContext/index"; 
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../config/auth";
import styles from "./SignIn.module.css"; 
import logo from "../images/oxfordtrans1.png";

export default function Login() {
  const navigate = useNavigate();
  const { userLoggedIn, profile, syncProfile } = useAuth(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // --- NAVIGATION TRIGGER ---
  // We only redirect once the profile (and its role) is fully loaded
  useEffect(() => {
    if (userLoggedIn && profile) {
      console.log("Login successful. Role detected:", profile.role);
      navigate("/dashboard", { replace: true });
    }
  }, [userLoggedIn, profile, navigate]);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      await doSignInWithEmailAndPassword(email, password);
      toast.success("Welcome back!");
    } catch (err) {
      console.error(err);
      toast.error("Invalid email or password");
      setIsProcessing(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const result = await doSignInWithGoogle();
      const user = result.user;

      /**
       * CRITICAL FIX: 
       * We call syncProfile WITHOUT a second argument.
       * This tells our AuthContext: "Check if this user exists. If they do, 
       * KEEP their current role (Teacher). If they are new, then make them a student."
       */
      await syncProfile(user);
      
      toast.success("Signed in with Google!");
    } catch (err) {
      console.error("Google Auth Error:", err);
      
      // Handling the COOP/Popup closure gracefully
      if (err.code === "auth/popup-closed-by-user") {
        toast.error("Login popup closed before finishing.");
      } else {
        toast.error("Google login failed. Please try again.");
      }
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <img src={logo} alt="Oxford Academy" className={styles.logo} />
        <h2 className={styles.title}>Sign in to Oxford Portal</h2>

        <form onSubmit={handleEmailSignIn} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className={styles.row}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className={styles.linkSmall}>Forgot Password?</Link>
          </div>

          <button className={styles.primary} type="submit" disabled={isProcessing}>
            {isProcessing ? "Authenticating..." : "Sign In"}
          </button>

          <div className={styles.divider}><span>OR</span></div>

          <button 
            type="button" 
            className={styles.googleButton} 
            onClick={handleGoogleSignIn} 
            disabled={isProcessing}
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="G" 
              style={{ width: '18px', marginRight: '10px' }} 
            />
            {isProcessing ? "Connecting..." : "Sign in with Google"}
          </button>
        </form>

        <p className={styles.footerText}>
          New to the portal? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}