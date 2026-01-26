import React, { useState, useEffect } from "react";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../context/authContext";
import { toast } from "react-hot-toast";
import styles from "./Discussion.module.css";

const Discussion = ({ courseId }) => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // REAL-TIME LISTENER: This makes messages appear immediately
  useEffect(() => {
    if (!courseId) return;

    const q = query(
      collection(db, "discussions"),
      where("courseId", "==", courseId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
      setLoading(false);
    }, (error) => {
      console.error("Forum Listener Error:", error);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [courseId]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, "discussions"), {
        courseId,
        userId: user.uid,
        userName: profile?.name || "Student",
        userImage: profile?.avatar || "", // If you have user photos
        text: newMessage,
        createdAt: serverTimestamp()
      });
      setNewMessage(""); // Clear input after sending
    } catch (error) {
      toast.error("Could not post message");
    }
  };

  return (
    <div className={styles.discussionWrapper}>
      <h3>Course Discussion</h3>
      
      <div className={styles.messageList}>
        {loading ? (
          <p>Loading conversation...</p>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.id} className={msg.userId === user.uid ? styles.myMsg : styles.otherMsg}>
              <div className={styles.msgHeader}>
                <strong>{msg.userName}</strong>
                <span>{msg.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p>{msg.text}</p>
            </div>
          ))
        ) : (
          <p className={styles.empty}>No messages yet. Start the conversation!</p>
        )}
      </div>

      <form onSubmit={handlePost} className={styles.inputArea}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask a question or share a thought..."
          rows="3"
        />
        <button type="submit" disabled={!newMessage.trim()}>
          Post to Forum
        </button>
      </form>
    </div>
  );
};

export default Discussion;