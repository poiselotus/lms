import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const { user, profile, isTeacher } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [stats, setStats] = useState({ totalCourses: 0, totalStudents: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);

        if (isTeacher) {
          // TEACHER VIEW: Fetch global stats
          const coursesSnap = await getDocs(collection(db, "courses"));
          const usersSnap = await getDocs(collection(db, "users"));
          setStats({
            totalCourses: coursesSnap.size,
            totalStudents: usersSnap.docs.filter(d => d.data().role === 'student').length
          });
        } else {
          // STUDENT VIEW: Fetch personal enrollments
          const q = query(
            collection(db, "enrollments"),
            where("studentId", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);
          const courses = querySnapshot.docs.map(doc => ({
            enrollmentId: doc.id,
            ...doc.data()
          }));
          setEnrolledCourses(courses);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, isTeacher]);

  const handleCompleteCourse = async (enrollmentId, courseId) => {
    try {
      const enrollRef = doc(db, "enrollments", enrollmentId);
      await updateDoc(enrollRef, {
        status: "completed",
        progress: 100,
        completedAt: new Date().toISOString()
      });
      
      // Update local state to reflect completion immediately
      setEnrolledCourses(prev => prev.map(c => 
        c.enrollmentId === enrollmentId ? { ...c, status: "completed", progress: 100 } : c
      ));

      toast.success("Congratulations! Course completed.");
      navigate(`/generate-certificate/${courseId}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className={styles.loading}>Loading Dashboard...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Welcome, {profile?.name || "User"}</h1>
        <p className={styles.roleBadge}>{isTeacher ? "Teacher Account" : "Student Portal"}</p>
      </header>

      {isTeacher ? (
        /* TEACHER DASHBOARD CONTENT */
        <section className={styles.statsGrid}>
          <div className={styles.statCard} onClick={() => navigate("/manage-courses")}>
            <h3>{stats.totalCourses}</h3>
            <p>Active Courses</p>
          </div>
          <div className={styles.statCard}>
            <h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
          </div>
          <div className={styles.statCard} onClick={() => navigate("/create-course")}>
            <h3>+</h3>
            <p>Create New Course</p>
          </div>
        </section>
      ) : (
        /* STUDENT DASHBOARD CONTENT */
        <section className={styles.myLearning}>
          <h2>My Learning Path</h2>
          {enrolledCourses.length > 0 ? (
            <div className={styles.grid}>
              {enrolledCourses.map((course) => (
                <div key={course.enrollmentId} className={styles.courseCard}>
                  <img src={course.courseImage || "https://via.placeholder.com/300"} alt={course.courseTitle} />
                  <div className={styles.cardInfo}>
                    <h3>{course.courseTitle}</h3>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{ width: `${course.status === 'completed' ? 100 : 0}%` }}
                      ></div>
                    </div>
                    
                    <div className={styles.btnGroup}>
                      <button 
                        className={styles.continueBtn}
                        onClick={() => navigate(`/course/${course.courseId}`)}
                      >
                        {course.status === "completed" ? "Review Content" : "Continue"}
                      </button>

                      {course.status === "completed" ? (
                        <button 
                          className={styles.certBtn}
                          onClick={() => navigate(`/generate-certificate/${course.courseId}`)}
                        >
                          Certificate
                        </button>
                      ) : (
                        <button 
                          className={styles.completeBtn}
                          onClick={() => handleCompleteCourse(course.enrollmentId, course.courseId)}
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>You haven't joined any courses yet.</p>
              <button onClick={() => navigate("/all-courses")}>Browse Courses</button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Dashboard;