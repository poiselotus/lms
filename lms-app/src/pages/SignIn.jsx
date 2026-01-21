import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import styles from "./SignIn.module.css";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../config/auth";
import logo from "../images/oxfordtrans1.png";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      await doSignInWithEmailAndPassword(email, password);
      toast.success("Signed in successfully!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const errorMsg = err.message || "Failed to sign in";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    setLoading(true);

    try {
      await doSignInWithGoogle();
      toast.success("Signed in with Google successfully!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const errorMsg = err.message || "Google sign in failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <img src={logo} alt="logo" className={styles.logo} />
        <h2 className={styles.title}>Sign in Your Account</h2>

        <form onSubmit={submit} className={styles.form}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className={styles.label}>Password</label>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className={styles.row}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" /> Remember my preference
            </label>
            <Link to="/forgot-password" className={styles.linkSmall}>
              Forgot Password?
            </Link>
          </div>

          <button className={styles.primary} type="submit" disabled={loading}>
            {loading ? "Signing..." : "Sign In"}
          </button>

          <button
            type="button"
            className={styles.googleButton}
            onClick={googleSignIn}
            disabled={loading}
          >
            Sign in with Google
          </button>
        </form>

        <p className={styles.footerText}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
