import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../config/firestoreCollections";
import styles from "./Course.module.css";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, COLLECTIONS.COURSES)
        );

        const courseData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCourses(courseData);
      } catch (err) {
        console.error("🔥 Error fetching courses:", err);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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
              <img
                src={course.imageUrl}
                alt={course.title}
                className={styles.image}
              />
            )}

            <h3>{course.title}</h3>
            <p>{course.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
