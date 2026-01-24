import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { COLLECTIONS } from "../../config/firestoreCollections";
import { useAuth } from "../../context/authContext";
import { toast } from "react-hot-toast";
import styles from "./Certificate.module.css";

const GenerateCertificate = () => {
  const { courseId } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [certData, setCertData] = useState(null);

  // Helper function to format courseId into a readable title
  const formatTitle = (id) => {
    if (!id) return "Course Completion";
    return id
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleGenerate = async () => {
    if (!profile) return toast.error("User not authenticated");

    setIsGenerating(true);
    try {
      // Logic standardized to use the cleaned profile.name and format the title
      const newCert = {
        userId: profile.uid,
        userName: profile.name, // Updated to use the correct name from profile
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

  return (
    <div className={styles.container}>
      {!certData ? (
        <div className={styles.setupAction}>
          <h2>Course Completion</h2>
          <p>Congratulations! You have successfully completed this module.</p>
          <button 
            className={styles.mainButton} 
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? "Processing..." : "Claim My Certificate"}
          </button>
        </div>
      ) : (
        <div className={styles.certPreview}>
          <div className={styles.certificateFrame}>
            <div className={styles.innerFrame}>
              <h1>Oxford Academy</h1>
              <p className={styles.subtext}>This certificate is proudly presented to</p>
              <h2 className={styles.studentName}>{certData.userName}</h2>
              <p className={styles.subtext}>for successfully completing the course</p>
              <h3 className={styles.courseTitle}>{certData.courseName}</h3>
              
              <div className={styles.footer}>
                <div className={styles.footerItem}>
                  <span>Date of Issue</span>
                  <strong>{certData.issuedAt}</strong>
                </div>
                <div className={styles.footerItem}>
                  <span className={styles.signature}>Official Oxford Seal</span>
                  <strong>Academic Director</strong>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.printBtn} onClick={() => window.print()}>
              Download as PDF / Print
            </button>
            <button className={styles.backBtn} onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateCertificate;