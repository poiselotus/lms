import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../config/firestoreCollections";
import { useAuth } from "../../context/authContext";
import { toast } from "react-hot-toast";
import styles from "./Certificate.module.css";

const GenerateCertificate = () => {
  const { courseId } = useParams();
  const { profile, user } = useAuth(); // Added user for UID safety
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Check if certificate already exists for this user/course
  useEffect(() => {
    const checkExistingCert = async () => {
      if (!user?.uid || !courseId) return;
      try {
        const q = query(
          collection(db, COLLECTIONS.CERTIFICATES),
          where("userId", "==", user.uid),
          where("courseId", "==", courseId)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setCertData(querySnapshot.docs[0].data());
        }
      } catch (error) {
        console.error("Error checking existing certificate:", error);
      } finally {
        setLoading(false);
      }
    };
    checkExistingCert();
  }, [user, courseId]);

  const formatTitle = (id) => {
    if (!id) return "Course Completion";
    return id
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleGenerate = async () => {
    if (!profile || !user) return toast.error("User not authenticated");

    setIsGenerating(true);
    try {
      const newCert = {
        userId: user.uid,
        userName: profile.name || "Oxford Scholar",
        courseId: courseId,
        courseName: formatTitle(courseId), 
        issuedAt: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, COLLECTIONS.CERTIFICATES), newCert);
      setCertData(newCert); 
      toast.success("Certificate generated successfully!");
    } catch (error) {
      console.error("Error generating certificate:", error);
      toast.error("Failed to generate certificate");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return <div className={styles.container}>Verifying completion...</div>;

  return (
    <div className={styles.container}>
      {!certData ? (
        <div className={styles.setupAction}>
          <h2>Certificate of Completion</h2>
          <p>Congratulations, <strong>{profile?.name}</strong>!</p>
          <p>You have successfully fulfilled all requirements for:</p>
          <h3>{formatTitle(courseId)}</h3>
          <button 
            className={styles.mainButton} 
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Claim My Certificate"}
          </button>
        </div>
      ) : (
        <div className={styles.certPreview}>
          {/* Certificate Frame - Designed for Printing */}
          <div className={styles.certificateFrame} id="certificate-print-area">
            <div className={styles.innerFrame}>
              <div className={styles.header}>
                <span className={styles.logoText}>OXFORD ACADEMY</span>
                <div className={styles.seal}></div>
              </div>
              
              <h1 className={styles.mainHeading}>CERTIFICATE</h1>
              <p className={styles.subtext}>OF COMPLETION</p>
              
              <p className={styles.presentedText}>This is to certify that</p>
              <h2 className={styles.studentName}>{certData.userName}</h2>
              
              <p className={styles.presentedText}>has successfully completed the prescribed course of study in</p>
              <h3 className={styles.courseTitle}>{certData.courseName}</h3>
              
              <div className={styles.footer}>
                <div className={styles.footerItem}>
                  <p>Issue Date</p>
                  <strong>{certData.issuedAt}</strong>
                </div>
                <div className={styles.footerItem}>
                   <div className={styles.signatureLine}></div>
                   <p>Academic Registrar</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.printBtn} onClick={() => window.print()}>
              Print or Save as PDF
            </button>
            <button className={styles.backBtn} onClick={() => navigate("/dashboard")}>
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateCertificate;