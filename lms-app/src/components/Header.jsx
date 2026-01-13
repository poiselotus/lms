import styles from "./Header.module.css";
import notification from "../images/notification.png";
import message from "../images/message.png";
import { useAuth } from "../context/authContext";

export default function Header() {
    const { profile, loading } = useAuth();

    if (loading) return null; // wait until auth finishes

    const fullName = profile?.fullName || profile?.name || "Student";

    return (
        <header className={styles.header}>
        <div className={styles.text}>
            <h1>Dashboard</h1>
            <p>Welcome, {fullName}</p>
        </div>

        <div className={styles.icons}>
            <img src={notification} alt="notification" />
            <img src={message} alt="message" />
        </div>
        </header>
    );
}
