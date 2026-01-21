import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// GET a single document
export const getDocument = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Firestore getDocument Error:", error);
    throw error; // Throw so AuthContext catches it
  }
};

// SET/CREATE a document
export const setDocument = async (collectionName, id, data) => {
  try {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, data, { merge: true });
    return true;
  } catch (error) {
    console.error("Firestore setDocument Error:", error);
    throw error;
  }
};