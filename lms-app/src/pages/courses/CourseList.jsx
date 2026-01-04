import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../../config/firebase";
import { COLLECTIONS } from "../../config/firestoreCollections";
import { ref, deleteObject } from "firebase/storage";
import styles from "./Course.module.css";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    try {
      const snapshot = await getDocs(collection(db, COLLECTIONS.COURSES));
      const courseData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCourses(courseData);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (courseId, imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await deleteDoc(doc(db, COLLECTIONS.COURSES, courseId));
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }
      setCourses(courses.filter((c) => c.id !== courseId));
    } catch (err) {
      console.error("Error deleting course:", err);
      alert("Failed to delete course");
    }
  };

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h2>Available Courses</h2>
      {courses.length === 0 && <p>No courses available</p>}
      <div className={styles.grid}>
        {courses.map((course) => (
          <div key={course.id} className={styles.card}>
            {course.imageUrl && (
              <img src={course.imageUrl} alt={course.title} className={styles.image} />
            )}
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p><strong>Category:</strong> {course.category}</p>
            <p><strong>Level:</strong> {course.level}</p>
            <p><strong>Duration:</strong> {course.duration}</p>
            <div className={styles.actions}>
              <button onClick={() => handleDelete(course.id, course.imageUrl)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
