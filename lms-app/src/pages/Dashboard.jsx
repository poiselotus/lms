import styles from './Dashboard.module.css' 
import Sidebar from '../components/Sidebar' 
import Header from '../components/Header' 
import Card from '../components/Card' 
import Progress from '../components/Progress'
import banner from "../images/banner.png"

export default function Dashboard() { 
    return (  
        <div className={styles.container}> 
        <Sidebar />

        <main className={styles.main}>
            <Header />

            <div className={styles.wrapper}>
                <img
                    src={banner}
                    alt="Oxford Biology PhD Scholarship"
                    className={styles.banner}
                />
            </div>

            <section className={styles.cards}>
                <Card title="Diploma in English" code="OXF/ENG/01" />
                <Card title="Diploma in IT" code="OXF/DIT/01" />
                <Card title="HND in Computing" code="OXF/HND/01" />
            </section>

            <section className={styles.progressGrid}>
                <Progress label="Module Progress" value="90%" />
                <Progress label="Assignment Progress" value="10%" />
                <Progress label="Attendance Progress" value="97%" />
                <Progress label="Course Progress" value="50%" />
            </section>
        </main>
    </div>

    ) 

}