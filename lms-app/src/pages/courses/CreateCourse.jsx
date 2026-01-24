import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../config/firestoreCollections";
import { useAuth } from "../../context/authContext";
import { toast } from "react-hot-toast";
import styles from "./Course.module.css";

const CreateCourse = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Information Technology",
    level: "Diploma",
    duration: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Safety check to ensure the user is logged in
    if (!profile) {
      toast.error("You must be logged in as a teacher to publish.");
      return;
    }

    setLoading(true);

    try {
      // 1. Define a default placeholder image URL 
      const placeholderImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop";

      // 2. Data Cleaning: Ensure strings are trimmed and free of accidental double quotes
      const cleanTitle = formData.title.replace(/^"|"$/g, '').trim();
      const cleanDescription = formData.description.replace(/^"|"$/g, '').trim();

      // 3. Save to Firestore
      await addDoc(collection(db, COLLECTIONS.COURSES), {
        title: cleanTitle,
        description: cleanDescription,
        category: formData.category, // Matches your manual update to the DB
        level: formData.level,
        duration: formData.duration,
        imageUrl: placeholderImage, 
        teacherId: profile.uid,
        teacherName: profile.name || "Instructor", // Using profile.name from updated context
        createdAt: serverTimestamp(),
      });

      toast.success("Course published successfully! ✅");
      
      // 4. Redirect to browse courses to see the result
      navigate("/courses");

    } catch (error) {
      console.error("Firestore Error:", error);
      toast.error("Failed to save course to database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>← Back</button>
        <h2>Create New Course</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Course Title</label>
          <input 
            type="text" 
            placeholder="e.g. Diploma in English" 
            required 
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea 
            placeholder="What will students learn in this course?" 
            required 
            rows="4"
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
          />
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label>Category</label>
            <select 
              value={formData.category} 
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Information Technology">Information Technology</option>
              <option value="Business Management">Business Management</option>
              <option value="Language Arts">Language Arts</option>
              <option value="Science">Science</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Level</label>
            <select 
              value={formData.level} 
              onChange={(e) => setFormData({...formData, level: e.target.value})}
            >
              <option value="Diploma">Diploma</option>
              <option value="HND">HND</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Duration (e.g. 1 Year)</label>
          <input 
            type="text" 
            placeholder="How long is this course?" 
            value={formData.duration} 
            onChange={(e) => setFormData({...formData, duration: e.target.value})} 
          />
        </div>

        <div className={styles.infoNote}>
          ℹ️ Image upload is currently disabled. A default cover image will be used.
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Publishing..." : "Publish Course"}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;