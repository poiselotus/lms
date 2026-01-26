import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/authContext";
import { doCreateUserWithEmailAndPassword } from "../config/auth";
import styles from "./SignIn.module.css"; 
import logo from "../images/oxfordtrans1.png";

export default function Signup() {
  const navigate = useNavigate();
  const { userLoggedIn, profile, syncProfile } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (profile) navigate("/dashboard", { replace: true });
  }, [profile, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    if (!isRegistering) {
      setIsRegistering(true);
      try {
        const userCredential = await doCreateUserWithEmailAndPassword(email, password);
        // CRITICAL: Force the profile sync with the chosen role immediately
        await syncProfile(userCredential.user, role);
        toast.success(`Welcome! Registered as ${role}`);
      } catch (error) {
        toast.error(error.message);
        setIsRegistering(false);
      }
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h2 className={styles.title}>Create Account</h2>
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Join as:</label>
            <select className={styles.input} value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input type="email" className={styles.input} required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input type="password" className={styles.input} required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm Password</label>
            <input type="password" className={styles.input} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <button type="submit" disabled={isRegistering} className={styles.primary}>
            {isRegistering ? "Creating..." : "Sign Up"}
          </button>
        </form>
        <p className={styles.footerText}>Already have an account? <Link to="/signin">Sign In</Link></p>
      </div>
    </div>
  );
}