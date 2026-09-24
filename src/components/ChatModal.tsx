import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../api';

interface ChatModalProps {
  propertyId: number;
  ownerId: number;
  ownerName: string;
  onClose: () => void;
}

function ChatModal({ propertyId, ownerId, ownerName, onClose }: ChatModalProps) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);

    try {
      await sendMessage({ receiverId: ownerId, content: message, propertyId });
      setSent(true);
      window.dispatchEvent(new Event('chatUpdated'));
      setTimeout(() => onClose(), 2000); // Close automatically after success
    } catch (err) {
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="city-modal-overlay" onClick={onClose}>
      <div className="city-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', padding: 0, overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ background: '#0f172a', padding: '1.25rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Message {ownerName}</h3>
          <button onClick={onClose} style={{ background: 'transparent', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          {sent ? (
            <div style={{ textAlign: 'center', color: '#16a34a', padding: '2rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
              <h3 style={{ margin: 0 }}>Message Sent!</h3>
              <p className="text-muted">The owner will reply shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSend}>
              <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                Ask a question about the property, availability, or special requests.
              </p>
              <textarea 
                className="custom-textarea" 
                rows={4} 
                placeholder="Hi, is this space available next weekend?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                autoFocus
              />
              <button type="submit" className="btn-solid w-100" style={{ marginTop: '1rem' }} disabled={sending || !message.trim()}>
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatModal;