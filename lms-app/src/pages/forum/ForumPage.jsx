import Sidebar from "../../components/Sidebar";
import ForumChatList from "./ForumChatList";
import ForumChatWindow from "./ForumChatWindow";
import "./ForumPage.css";

const ForumPage = () => {
  return (
    <div className="forum-layout">
      <Sidebar />

      <div className="forum-main">
        <ForumChatList />
        <ForumChatWindow />
      </div>
    </div>
  );
};

export default ForumPage;