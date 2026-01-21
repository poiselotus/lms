import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, addDoc, query, where, serverTimestamp } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../../config/firebase";
import { COLLECTIONS } from "../../config/firestoreCollections";
import { useAuth } from "../../context/authContext";
import { toast } from "react-hot-toast";
import styles from "./Course.module.css";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]); // Track courses student is already in
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { profile } = useAuth();

  // 1. Fetch all available courses and current student enrollments
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch Courses from the "courses" collection defined in your config
      const snapshot = await getDocs(collection(db, COLLECTIONS.COURSES));
      const courseData = snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setCourses(courseData);

      // If user is a student, fetch their existing enrollments to disable buttons
      if (profile?.uid && profile?.role === "student") {
        const enrollQuery = query(
          collection(db, "enrollments"),
          where("studentId", "==", profile.uid)
        );
        const enrollSnap = await getDocs(enrollQuery);
        const enrolled = enrollSnap.docs.map(doc => doc.data().courseId);
        setEnrolledIds(enrolled);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [profile]);

  // 2. Enrollment Logic (Students only)
  const handleEnroll = async (course) => {
    if (enrolledIds.includes(course.id)) {
      return toast.error("You are already enrolled in this course");
    }

    setActionLoading(true);
    try {
      // Logic aligns with your Dashboard.jsx requirements
      await addDoc(collection(db, "enrollments"), {
        studentId: profile.uid,
        studentName: profile.name, // Using profile.name from updated context
        courseId: course.id,
        courseTitle: course.title,
        courseImage: course.imageUrl || "https://via.placeholder.com/300",
        enrolledAt: serverTimestamp(),
        progress: 0,
        status: "active"
      });

      setEnrolledIds([...enrolledIds, course.id]);
      toast.success(`Enrolled in ${course.title}! Check your dashboard.`);
    } catch (err) {
      console.error("Enrollment error:", err);
      toast.error("Enrollment failed. Try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Delete Logic (Teachers only)
  const handleDelete = async (courseId, imageUrl) => {
    if (!window.confirm("Are you sure? This will remove the course for everyone.")) return;

    try {
      await deleteDoc(doc(db, COLLECTIONS.COURSES, courseId));
      
      // Only attempt to delete from storage if it's not the Unsplash placeholder
      if (imageUrl && !imageUrl.includes("unsplash.com")) {
        try {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        } catch (storageErr) {
          console.warn("Image could not be deleted from storage, but document was removed.");
        }
      }
      
      setCourses(courses.filter((c) => c.id !== courseId));
      toast.success("Course removed successfully");
    } catch (err) {
      toast.error("Failed to delete course");
    }
  };

  if (loading) return <div className={styles.container}><p>Loading available courses...</p></div>;

  return (
    <div className={styles.container}>
      <header className={styles.headerArea}>
        <h2>{profile?.role === "teacher" ? "Manage Courses" : "Available Courses"}</h2>
        <p>Explore our world-class curriculum</p>
      </header>

      {courses.length === 0 && (
        <div className={styles.empty}>
           <p>No courses are currently available.</p>
        </div>
      )}

      <div className={styles.grid}>
        {courses.map((course) => (
          <div key={course.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img 
                src={course.imageUrl || "https://via.placeholder.com/300"} 
                alt={course.title} 
                className={styles.image} 
                onError={(e) => { e.target.src = "https://via.placeholder.com/300"; }}
              />
              <span className={styles.badge}>
                {course.category ? course.category.toUpperCase() : "GENERAL"}
              </span>
            </div>

            <div className={styles.cardBody}>
              <h3>{course.title}</h3>
              <p className={styles.desc}>{course.description}</p>
              
              <div className={styles.meta}>
                <span>📊 {course.level}</span>
                <span>⏱️ {course.duration}</span>
              </div>

              <div className={styles.actions}>
                {/* TEACHER VIEW: Delete Button */}
                {profile?.role === "teacher" && (
                  <button 
                    className={styles.deleteBtn} 
                    onClick={() => handleDelete(course.id, course.imageUrl)}
                  >
                    Delete Course
                  </button>
                )}

                {/* STUDENT VIEW: Enroll Button */}
                {profile?.role === "student" && (
                  <button 
                    disabled={enrolledIds.includes(course.id) || actionLoading}
                    className={enrolledIds.includes(course.id) ? styles.enrolledBtn : styles.enrollBtn}
                    onClick={() => handleEnroll(course)}
                  >
                    {enrolledIds.includes(course.id) ? "Already Enrolled" : "Enroll Now"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;