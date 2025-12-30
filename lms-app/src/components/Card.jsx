import styles from "./Card.module.css";
import cardicon from "../images/cardicon.png"

export default function Card({ title, code }) { 
    
    return ( <div className={styles.card}> 
        <img src={cardicon} alt="doc" /> 
        <h3>{title}</h3> <small>{code}</small> </div> 
    
    ) 
} 