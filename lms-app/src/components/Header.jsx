import styles from './Header.module.css'
import notification from "../images/notification.png"
import message from "../images/message.png"

export default function Header() {
    return (
        <header className={styles.header}>
        <div className={styles.text}>
            <h1>Dashboard</h1>
            <p>Welcome Back, Vanessa</p>
        </div>

        <div className={styles.icons}>
            <img src={notification} alt="notification" />
            <img src={message} alt="message" />
        </div>
        </header>
    )
}
