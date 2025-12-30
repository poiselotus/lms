import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../config/firebase";
import { COLLECTIONS } from "../../config/firestoreCollections";
import styles from "./Course.module.css";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("You must be logged in to create a course");
      return;
    }

    if (!title || !description || !category || !level || !duration) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      // Upload image if exists
      let imageUrl = "";
      if (image) {
        const storageRef = ref(storage, `courses/${Date.now()}_${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // Add course to Firestore
      await addDoc(collection(db, COLLECTIONS.COURSES), {
        title,
        description,
        category,
        level,
        duration,
        imageUrl,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      // Reset form
      setTitle("");
      setDescription("");
      setCategory("");
      setLevel("");
      setDuration("");
      setImage(null);

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
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="text"
          placeholder="Level (Beginner/Intermediate/Advanced)"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        />

        <input
          type="text"
          placeholder="Duration (e.g., 4 weeks)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
