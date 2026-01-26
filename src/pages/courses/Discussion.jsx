import React, { useState, useEffect } from "react";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  deleteDoc,
  doc 
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

  // Check if current user is a moderator (Teacher or specific ID)
  const isModerator = profile?.role === "teacher" || user?.uid === "Pd6bPImud5e68yrQeKUrPNgoj8x2";

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

    return () => unsubscribe();
  }, [courseId]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, "discussions"), {
        courseId,
        userId: user.uid,
        userName: profile?.name || "Student",
        text: newMessage,
        createdAt: serverTimestamp()
      });
      setNewMessage(""); 
    } catch (error) {
      toast.error("Could not post message");
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await deleteDoc(doc(db, "discussions", msgId));
      toast.success("Message removed");
    } catch (error) {
      toast.error("Failed to delete message");
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
                <div className={styles.userInfo}>
                  <strong>{msg.userName}</strong>
                  {/* Show "Teacher" tag if applicable */}
                  {msg.role === "teacher" && <span className={styles.teacherTag}>Staff</span>}
                </div>
                <div className={styles.msgMeta}>
                  <span>{msg.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  
                  {/* MODERATION BUTTON: Visible to you and collaborators */}
                  {isModerator && (
                    <button 
                      className={styles.deleteMsgBtn} 
                      onClick={() => handleDeleteMessage(msg.id)}
                      title="Delete Message"
                    >
                      ×
                    </button>
                  )}
                </div>
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
          placeholder="Ask a question..."
          rows="2"
        />
        <button type="submit" disabled={!newMessage.trim()}>
          Post to Forum
        </button>
      </form>
    </div>
  );
};

export default Discussion;