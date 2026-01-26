import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../config/firestoreCollections";
import { useAuth } from "../../context/authContext";
import { toast } from "react-hot-toast";
import Discussion from "./Discussion"; 
import styles from "./CourseDetails.module.css";

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourseAndEnrollment = async () => {
      try {
        const docRef = doc(db, COLLECTIONS.COURSES, courseId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCourse(docSnap.data());
        }

        if (profile?.uid) {
          const q = query(
            collection(db, "enrollments"),
            where("courseId", "==", courseId),
            where("studentId", "==", profile.uid)
          );
          const querySnapshot = await getDocs(q);
          setIsEnrolled(!querySnapshot.empty);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndEnrollment();
  }, [courseId, profile]);

  const handleEnroll = async () => {
    if (!profile) return toast.error("Please log in to enroll");
    
    setEnrolling(true);
    try {
      await addDoc(collection(db, "enrollments"), {
        studentId: profile.uid,
        studentName: profile.name,
        courseId: courseId,
        courseTitle: course.title,
        courseImage: course.imageUrl,
        enrolledAt: serverTimestamp(),
        progress: 0,
        status: "active"
      });

      setIsEnrolled(true);
      toast.success("Successfully enrolled!");
    } catch (error) {
      toast.error("Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading Course Information...</div>;
  if (!course) return <div className={styles.error}>Course not found.</div>;

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backBtn}>← Back to Dashboard</button>
      
      <div className={styles.heroSection}>
        <img src={course.imageUrl} alt={course.title} className={styles.heroImage} />
        <div className={styles.heroContent}>
          <span className={styles.badge}>{course.category}</span>
          <h1 className={styles.title}>{course.title}</h1>
          <p className={styles.level}>Academic Level: <strong>{course.level}</strong></p>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.descriptionSide}>
          <section className={styles.about}>
            <h2>About this Course</h2>
            <p className={styles.description}>{course.description}</p>
          </section>

          <section className={styles.forumSection}>
            <Discussion courseId={courseId} />
          </section>
        </div>

        <div className={styles.infoSide}>
          <div className={styles.infoCard}>
            <h3>Course Details</h3>
            <p><strong>Duration:</strong> {course.duration || "N/A"}</p>
            <p><strong>Instructor:</strong> {course.teacherName}</p>
            
            {profile?.role === "student" && (
              <button 
                className={isEnrolled ? styles.enrolledBtn : styles.enrollBtn} 
                onClick={handleEnroll}
                disabled={isEnrolled || enrolling}
              >
                {enrolling ? "Processing..." : isEnrolled ? "Already Enrolled" : "Enroll Now"}
              </button>
            )}

            {isEnrolled && (
                <p className={styles.successNote}>You have access to this course material.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}