import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../config/firestoreCollections";
import { useAuth } from "../../context/authContext";
import { toast } from "react-hot-toast";
import styles from "./Course.module.css";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, COLLECTIONS.COURSES));
        setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        if (user) {
          const q = query(collection(db, "enrollments"), where("studentId", "==", user.uid));
          const enrollSnap = await getDocs(q);
          setEnrolledIds(enrollSnap.docs.map(doc => doc.data().courseId));
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.COURSES, id));
      setCourses(courses.filter(c => c.id !== id));
      toast.success("Course deleted successfully");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <div className={styles.loading}>Loading Curriculum...</div>;

  // Check if user is a teacher or the specific collaborator ID
  const canManage = profile?.role === "teacher" || profile?.uid === "Pd6bPImud5e68yrQeKUrPNgoj8x2";

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <h1>Available Courses</h1>
          {/* CREATE COURSE BUTTON - Visible only to Teachers */}
          {canManage && (
            <button 
              className={styles.createBtn} 
              onClick={() => navigate("/create-course")}
            >
              + Create New Course
            </button>
          )}
        </div>
        <p>Explore our world-class curriculum</p>
      </header>

      <div className={styles.grid}>
        {courses.map((course) => {
          const isEnrolled = enrolledIds.includes(course.id);

          return (
            <div key={course.id} className={styles.card} onClick={() => navigate(`/course/${course.id}`)}>
              <div className={styles.imageWrapper}>
                <img src={course.imageUrl} alt={course.title} className={styles.image} />
                <span className={styles.categoryBadge}>{course.category}</span>
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.courseTitle}>{course.title}</h3>
                <p className={styles.description}>
                  {course.description?.substring(0, 60)}...
                </p>
                <div className={styles.meta}>
                  <span>🎓 Diploma</span>
                  <span>⏱️ {course.duration}</span>
                </div>
                
                <div className={styles.btnGroup}>
                  <button className={styles.enrollBtn} disabled={isEnrolled}>
                    {isEnrolled ? "Already Enrolled" : "Enroll Now"}
                  </button>
                  
                  {canManage && (
                    <button 
                      className={styles.deleteBtn} 
                      onClick={(e) => handleDelete(e, course.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseList;