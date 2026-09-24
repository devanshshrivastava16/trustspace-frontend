import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getChatRooms, getChatMessages, sendMessage, markMessageAsRead, getCurrentUser } from '../api';

function ChatPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [activeRoom, setActiveRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load User & Rooms
  useEffect(() => {
    Promise.all([getCurrentUser(), getChatRooms().catch(() => [])])
      .then(([user, roomsData]) => {
        setCurrentUser(user);
        setRooms(roomsData);
        setLoading(false);
      });
  }, []);

  // Load Messages when a room is clicked
  useEffect(() => {
    if (!activeRoom) return;
    
    getChatMessages(activeRoom.id).then((msgs) => {
      setMessages(msgs);
      scrollToBottom();
      
      // Mark unread messages as read
      const unreadMsgs = msgs.filter((m: any) => !m.isRead && m.sender.id !== currentUser.id);
      if (unreadMsgs.length > 0) {
        // Mark the latest message as read (assuming API clears earlier ones too)
        markMessageAsRead(unreadMsgs[unreadMsgs.length - 1].id).then(() => {
          window.dispatchEvent(new Event('chatUpdated'));
        });
      }
    });
  }, [activeRoom, currentUser]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoom) return;

    const receiverId = activeRoom.user1.id === currentUser.id ? activeRoom.user2.id : activeRoom.user1.id;
    const tempMessage = newMessage;
    setNewMessage('');

    try {
      const sentMsg = await sendMessage({
        receiverId,
        content: tempMessage,
        propertyId: activeRoom.property?.id
      });
      setMessages(prev => [...prev, sentMsg]);
      scrollToBottom();
    } catch (err) {
      alert("Failed to send message.");
      setNewMessage(tempMessage); // restore on fail
    }
  };

  if (loading) return <div className="app-content"><div className="loading-state">Loading messages...</div></div>;

  return (
    <div className="chat-dashboard-layout">
      {/* LEFT SIDEBAR: Rooms List */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h2>Messages</h2>
        </div>
        <div className="chat-rooms-list">
          {rooms.length === 0 ? (
            <p className="text-muted" style={{ padding: '1.5rem', textAlign: 'center' }}>No conversations yet.</p>
          ) : (
            rooms.map((room) => {
              // Determine the "other" person in the chat
              const otherUser = room.user1.id === currentUser.id ? room.user2 : room.user1;
              const isActive = activeRoom?.id === room.id;

              return (
                <div 
                  key={room.id} 
                  className={`chat-room-card ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveRoom(room)}
                >
                  <div className="chat-avatar">
                    {otherUser.profileImage ? <img src={otherUser.profileImage} alt="" /> : <span>{otherUser.fullName?.charAt(0)}</span>}
                  </div>
                  <div className="chat-room-info">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h4>{otherUser.fullName}</h4>
                      <span className="chat-time">{new Date(room.updatedAt).toLocaleDateString([], { timeZone: 'Asia/Kolkata' })}</span>
                    </div>
                    <p className="last-message">
                      {room.property && <span className="chat-property-tag">{room.property.title}</span>}
                      {typeof room.lastMessage === 'object' ? room.lastMessage?.content : room.lastMessage}
                    </p>
                  </div>
                  {room.unreadCount > 0 && <div className="unread-badge">{room.unreadCount}</div>}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR: Active Conversation */}
      <div className="chat-main-area">
        {!activeRoom ? (
          <div className="chat-empty-state">
            <span className="empty-icon">💬</span>
            <h3>Your Messages</h3>
            <p>Select a conversation from the left to start messaging.</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="chat-main-header">
              <div className="chat-avatar">
                {/* Find other user again for header */}
                {(() => {
                  const otherUser = activeRoom.user1.id === currentUser.id ? activeRoom.user2 : activeRoom.user1;
                  return otherUser.profileImage ? <img src={otherUser.profileImage} alt="" /> : <span>{otherUser.fullName?.charAt(0)}</span>;
                })()}
              </div>
              <div className="chat-header-info">
                <h3>{activeRoom.user1.id === currentUser.id ? activeRoom.user2.fullName : activeRoom.user1.fullName}</h3>
                {activeRoom.property && <Link to={`/properties/${activeRoom.property.id}`} className="text-blue" style={{ fontSize: '0.85rem' }}>Regarding: {activeRoom.property.title}</Link>}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="chat-messages-container">
              {messages.map((msg) => {
                const isMine = msg.sender.id === currentUser.id;
                return (
                  <div key={msg.id} className={`chat-bubble-wrapper ${isMine ? 'mine' : 'theirs'}`}>
                    <div className="chat-bubble">
                      <p>{msg.content}</p>
                      <span className="msg-time">
                        {new Date(msg.sentAt).toLocaleTimeString([], { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}
                        {isMine && <span className="read-receipt">{msg.isRead ? ' ✓✓' : ' ✓'}</span>}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form className="chat-input-area" onSubmit={handleSend}>
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="btn-solid" disabled={!newMessage.trim()}>Send</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatPage;