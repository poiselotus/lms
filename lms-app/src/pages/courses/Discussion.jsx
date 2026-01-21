import React, { useState, useEffect } from "react";
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../context/authContext";
import { toast } from "react-hot-toast";
import styles from "./Discussion.module.css";

export default function Discussion({ courseId }) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Listen for real-time updates in the forum
  useEffect(() => {
    if (!courseId) return;

    const q = query(
      collection(db, "discussions"),
      where("courseId", "==", courseId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setMessages(fetchedMessages);
    }, (error) => {
      console.error("Discussion listener error:", error);
    });

    return () => unsubscribe();
  }, [courseId]);

  const handlePost = async (e) => {
    e.preventDefault();
    
    // Safety checks
    if (!newMessage.trim()) return;
    if (!profile) {
      toast.error("You must be logged in to participate.");
      return;
    }

    try {
      // Data Cleaning: Ensure content is free of accidental double quotes
      const cleanContent = newMessage.replace(/^"|"$/g, '').trim();

      await addDoc(collection(db, "discussions"), {
        courseId: courseId,
        content: cleanContent,
        authorId: profile.uid,
        authorName: profile.name || "Anonymous User", // Using profile.name to match cleaned DB format
        role: profile.role || "student",
        timestamp: serverTimestamp(),
      });

      setNewMessage(""); // Clear input after successful post
    } catch (error) {
      console.error("Post error:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className={styles.forumContainer}>
      <h3>Course Discussion</h3>
      
      <div className={styles.messageList}>
        {messages.length === 0 ? (
          <p className={styles.emptyForum}>No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`${styles.message} ${msg.role === 'teacher' ? styles.teacherMsg : ''}`}
            >
              <div className={styles.msgHeader}>
                <span className={styles.author}>{msg.authorName}</span>
                <span className={styles.roleTag}>{msg.role}</span>
              </div>
              <p className={styles.content}>{msg.content}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handlePost} className={styles.inputArea}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask a question or share a thought..."
          required
          rows="3"
        />
        <button type="submit">Post to Forum</button>
      </form>
    </div>
  );
}