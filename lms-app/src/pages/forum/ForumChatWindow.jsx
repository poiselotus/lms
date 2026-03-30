import ForumMessage from "./ForumMessage";

const messages = [
  { id: 1, sender: "Anil", text: "Hey there!" },
  { id: 2, sender: "You", text: "I am fine, how are you?" },
  { id: 3, sender: "Anil", text: "Can we meet?" },
];

const ForumChatWindow = () => {
  return (
    <div className="chat-window">
      <div className="chat-header">Anil</div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <ForumMessage key={msg.id} message={msg} />
        ))}
      </div>

      <div className="chat-input">
        <input type="text" placeholder="Type a message..." />
        <button>Send</button>
      </div>
    </div>
  );
};

export default ForumChatWindow;