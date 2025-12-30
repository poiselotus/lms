import { useParams } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { COLLECTIONS } from "../../config/firestoreCollections";
import styles from "./Certificate.module.css";

const GenerateCertificate = () => {
  const { courseId } = useParams();

  const handleGenerate = async () => {
    try {
      await addDoc(collection(db, COLLECTIONS.CERTIFICATES), {
        userId: auth.currentUser?.uid,
        courseId,
        issuedAt: serverTimestamp(),
      });

      alert("Certificate generated successfully");
    } catch (error) {
      console.error("Error generating certificate:", error);
      alert("Failed to generate certificate");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Generate Certificate</h2>
      <button onClick={handleGenerate}>Generate</button>
    </div>
  );
};

export default GenerateCertificate;
