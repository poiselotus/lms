import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css";
import {
  doCreateWithEmailAndPassword,
  doUpdateProfile,
  doSendEmailVerification,
} from "../config/auth";
import { setDocument } from "../config/firestore";
import logo from "../images/oxfordtrans1.png";

export default function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await doCreateWithEmailAndPassword(email, password);
      // create a user profile document in Firestore
      try {
        const user = result.user;
        await setDocument("users", user.uid, {
          uid: user.uid,
          email: user.email,
          displayName: username || user.displayName || "",
          createdAt: new Date().toISOString(),
        });
      } catch (fErr) {
        console.warn("failed to write user profile to firestore", fErr);
      }
      try {
        await doUpdateProfile({ displayName: username });
      } catch (uErr) {
        // non-fatal - profile update may fail if currentUser not yet available
        console.warn("update profile failed", uErr);
      }

      try {
        await doSendEmailVerification();
      } catch (vErr) {
        console.warn("send verification failed", vErr);
      }

      navigate("/signin");
    } catch (err) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <img src={logo} alt="logo" className={styles.logo} />
        <h2 className={styles.title}>Signup Your Account</h2>

        <form onSubmit={submit} className={styles.form}>
          <label className={styles.label}>Username</label>
          <input
            className={styles.input}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

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

          {error && <div className={styles.error}>{error}</div>}

          <button className={styles.primary} type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
