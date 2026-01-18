const ForumMessage = ({ message }) => {
  if (!message) return null;

  const isMe = message.sender === "You";

  return (
    <div className={`message ${isMe ? "me" : "other"}`}>
      <p>{message.text}</p>
    </div>
  );
};

export default ForumMessage;