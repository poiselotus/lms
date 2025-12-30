import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { COLLECTIONS } from "../../config/firestoreCollections";
import styles from "./Course.module.css";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("You must be logged in to create a course");
      return;
    }

    if (!title || !description) {
      alert("All fields are required");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, COLLECTIONS.COURSES), {
        title,
        description,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setDescription("");
      alert("Course created successfully ✅");
    } catch (error) {
      console.error("Create course error:", error);
      alert("Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create Course</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Course title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Course description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
