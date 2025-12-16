import { db } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// Create or overwrite a document at `collectionName/docId`
export const setDocument = async (collectionName, docId, data) => {
  const ref = doc(db, collectionName, docId);
  await setDoc(ref, data, { merge: true });
  return ref;
};

// Add a new document with generated id
export const addDocument = async (collectionName, data) => {
  const ref = await addDoc(collection(db, collectionName), data);
  return ref;
};

export const getDocument = async (collectionName, docId) => {
  const ref = doc(db, collectionName, docId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

export const updateDocument = async (collectionName, docId, data) => {
  const ref = doc(db, collectionName, docId);
  await updateDoc(ref, data);
  return ref;
};

export const deleteDocument = async (collectionName, docId) => {
  const ref = doc(db, collectionName, docId);
  await deleteDoc(ref);
};

export const queryCollection = async (collectionName, field, op, value) => {
  const q = query(collection(db, collectionName), where(field, op, value));
  const snaps = await getDocs(q);
  const results = [];
  snaps.forEach((s) => results.push({ id: s.id, ...s.data() }));
  return results;
};
