import { useState } from 'react' 
import styles from './Sidebar.module.css'
import oxfordtrans1 from "../images/oxfordtrans1.png";
import profile1 from "../images/profile1.png";
import home from "../images/home.png";
import onlinelearning from "../images/onlinelearning.png";
import paper from "../images/paper.png";
import schedule from "../images/schedule.png";
import setting from "../images/setting.png";
import chat from "../images/chat.png";
import { NavLink } from "react-router-dom";


export default function Sidebar() { const [open, setOpen] = useState(true)

return ( 
    <aside className={`${styles.sidebar} ${!open ? styles.closed : ''}`}>
        <div className={styles.top}> 
            <img src={oxfordtrans1} alt="Oxford Logo" className={styles.logo}/> 
            <button onClick={() => setOpen(!open)} className={styles.hamburger}> ☰ </button> 
        </div>

        <div className={styles.profile}>
            <img src={profile1} alt="avatar" className={styles.avatar} />
            <div className={styles.info}>
                <p className={styles.name} >Hi, Vanessa</p>
                <small className={styles.id}>E173037</small>
            </div>
                
        </div>

        <nav className={styles.nav}>
            <NavLink to="/" className={styles.active}>
                <img src={home} className={styles.icons} />
                Home
            </NavLink>

            <NavLink to="/courses">
                <img src={onlinelearning} className={styles.icons} />
                My Courses
            </NavLink>

            <NavLink to="/assignments">
                <img src={paper} className={styles.icons} />
                Assignments
            </NavLink>

            <NavLink to="/timetable">
                <img src={schedule} className={styles.icons} />
                Time Table
            </NavLink>

            <NavLink to="/forum">
                <img src={chat} className={styles.icons} />
                Forum
            </NavLink>

            <NavLink to="/settings">
                <img src={setting} className={styles.icons} />
                Settings
            </NavLink>
        </nav>

    </aside>

) }
