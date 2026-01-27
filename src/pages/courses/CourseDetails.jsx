import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, getDocs, collection, query, where, addDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../config/firestoreCollections";
import { useAuth } from "../../context/authContext";
import { toast } from "react-hot-toast";
import Discussion from "./Discussion"; // Integrated your Discussion component
import styles from "./CourseDetails.module.css";

const CourseDetails = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch course details
        const courseDoc = await getDoc(doc(db, COLLECTIONS.COURSES, courseId));
        if (courseDoc.exists()) {
          setCourse({ id: courseDoc.id, ...courseDoc.data() });
        }

        // Check user enrollment and completion status
        if (user) {
          const q = query(
            collection(db, "enrollments"),
            where("studentId", "==", user.uid),
            where("courseId", "==", courseId)
          );
          const enrollSnap = await getDocs(q);

          if (!enrollSnap.empty) {
            setIsEnrolled(true);
            const enrollData = enrollSnap.docs[0].data();
            setEnrollmentId(enrollSnap.docs[0].id);
            setIsCompleted(enrollData.status === "completed");
          }
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [courseId, user]);

  const handleEnroll = async () => {
    if (!user) return navigate("/signin");
    try {
      const newEnroll = await addDoc(collection(db, "enrollments"), {
        studentId: user.uid,
        courseId: courseId,
        status: "active",
        enrolledAt: new Date(),
      });
      setEnrollmentId(newEnroll.id);
      setIsEnrolled(true);
      toast.success("Welcome to the course!");
    } catch (err) {
      toast.error("Enrollment failed");
    }
  };

  const handleComplete = async () => {
    try {
      await updateDoc(doc(db, "enrollments", enrollmentId), {
        status: "completed",
        completedAt: new Date(),
      });
      setIsCompleted(true);
      toast.success("Course marked as completed!");
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  if (loading) return <div className={styles.container}>Loading Oxford Portal...</div>;
  if (!course) return <div className={styles.container}>Course not found.</div>;

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back to Courses
      </button>

      <div className={styles.heroSection}>
        <img src={course.imageUrl} alt={course.title} className={styles.heroImage} />
        <div className={styles.heroContent}>
          <h1>{course.title}</h1>
          <p>Academic Level: Diploma</p>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.courseDescription}>
          <section className={styles.aboutSection}>
            <h2>About this Course</h2>
            <p>{course.description}</p>
          </section>

          {/* DISCUSSION FORUM - Only visible if enrolled */}
          {isEnrolled && (
            <section className={styles.discussionSection}>
              <Discussion courseId={courseId} />
            </section>
          )}
        </div>

        <aside>
          <div className={styles.infoCard}>
            <h3>Course Progress</h3>
            <p><strong>Duration:</strong> {course.duration || "6 weeks"}</p>
            <p><strong>Instructor:</strong> {course.instructor || "Oxford Faculty"}</p>

            {!isEnrolled ? (
              <button className={styles.enrollBtn} onClick={handleEnroll}>
                Enroll Now
              </button>
            ) : !isCompleted ? (
              <button className={styles.completeBtn} onClick={handleComplete}>
                Complete Course
              </button>
            ) : (
              <>
                <p className={styles.successNote}>✅ Course Completed</p>
                <button 
                  className={styles.completeBtn} 
                  style={{ background: "#ffb800", color: "#061a3a" }}
                  onClick={() => navigate(`/generate-certificate/${courseId}`)}
                >
                  Generate Certificate
                </button>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CourseDetails;