import React from "react";
import { useNavigate } from "react-router-dom"; // Add this
import styles from "./Card.module.css";

const Card = ({ id, title, code, image, category }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img 
          src={image || "https://via.placeholder.com/300x180"} 
          alt={title} 
          className={styles.cardImage} 
        />
        {category && <span className={styles.categoryBadge}>{category}</span>}
      </div>
      
      <div className={styles.cardContent}>
        <span className={styles.levelText}>{code}</span>
        <h3 className={styles.cardTitle}>{title}</h3>
        
        <div className={styles.cardFooter}>
          <button 
            className={styles.viewBtn}
            onClick={() => navigate(`/course/${id}`)} // This triggers the move
          >
            View Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;