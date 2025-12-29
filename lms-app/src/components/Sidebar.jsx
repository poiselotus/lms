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
                <p className={styles.name} >Hi, Alex</p>
                <small className={styles.id}>E173037</small>
            </div>
                
        </div>

        <nav className={styles.nav}>
            <a className={styles.active}><img src={home} alt="home" className={styles.icons} />Home</a>
            
            <a><img src={onlinelearning} alt="courses" className={styles.icons} />My Courses</a>
            <a><img src={paper} alt="paper" className={styles.icons} />Assignments</a>
            <a><img src={schedule} alt="schedule" className={styles.icons} />Time Table</a>
            <a><img src={chat} alt="chat" className={styles.icons} />Forum</a>
            <a><img src={setting} alt="setting" className={styles.icons} />Settings</a>
        </nav>
    </aside>

) }
