import React, { useState } from "react";
import styles from "./SignIn.module.css";
import { doPasswordReset } from "../config/auth";
import logo from "../images/oxfordtrans1.png";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      await doPasswordReset(email);
      setStatus("Password reset email sent. Check your inbox.");
    } catch (err) {
      setStatus(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <img src={logo} alt="logo" className={styles.logo} />
        <h2 className={styles.title}>Reset your password</h2>

        <form onSubmit={submit} className={styles.form}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {status && <div className={styles.error}>{status}</div>}

          <button className={styles.primary} type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send reset email"}
          </button>
        </form>

        <p className={styles.footerText}>
          Remembered? <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
