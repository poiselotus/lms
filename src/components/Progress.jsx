import styles from "./Progress.module.css";

export default function Progress({ label, value }) { 
    return ( 
        <div className={styles.box}> 
            <span>{label}</span> 
            <span>{value}</span> 
        </div> 
    );
}