import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../config/firestoreCollections";
import { useAuth } from "../../context/authContext";
import { toast } from "react-hot-toast";
import styles from "./Course.module.css";

const CreateCourse = () => {
  const { profile, user } = useAuth(); // 'user' is the raw Firebase Auth object
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Information Technology",
    level: "Diploma",
    duration: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check user object directly from Auth for better reliability
    if (!user) {
      toast.error("You must be logged in to publish a course.");
      return;
    }

    setLoading(true);

    try {
      const placeholderImage =
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop";

      // Data Cleaning
      const cleanTitle = formData.title.replace(/^"|"$/g, "").trim();
      const cleanDescription = formData.description
        .replace(/^"|"$/g, "")
        .trim();

      console.log("Attempting to save course for user:", user.uid);

      // We hardcode the collection name "courses" if COLLECTIONS.COURSES is missing
      const courseCollection = collection(db, COLLECTIONS.COURSES || "courses");

      await addDoc(courseCollection, {
        title: cleanTitle,
        description: cleanDescription,
        category: formData.category,
        level: formData.level,
        duration: formData.duration,
        imageUrl: placeholderImage,
        teacherId: user.uid, // Using user.uid directly is safer than profile.uid
        teacherName: profile?.name || user.displayName || "Instructor",
        createdAt: serverTimestamp(),
        enrolledStudents: 0,
      });

      toast.success("Course published successfully! ✅");
      navigate("/all-courses");
    } catch (error) {
      console.error("Full Firestore Error Object:", error);

      if (error.code === "permission-denied") {
        toast.error(
          "Permission Denied: Ensure your role is 'teacher' in the database."
        );
      } else {
        toast.error("Failed to save course. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          ← Back
        </button>
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
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            placeholder="What will students learn?"
            required
            rows="4"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="Information Technology">
                Information Technology
              </option>
              <option value="Business Management">Business Management</option>
              <option value="Language Arts">Language Arts</option>
              <option value="Science">Science</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Level</label>
            <select
              value={formData.level}
              onChange={(e) =>
                setFormData({ ...formData, level: e.target.value })
              }
            >
              <option value="Diploma">Diploma</option>
              <option value="HND">HND</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Duration</label>
          <input
            type="text"
            placeholder="e.g. 1 Year"
            required
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Publishing..." : "Publish Course"}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
