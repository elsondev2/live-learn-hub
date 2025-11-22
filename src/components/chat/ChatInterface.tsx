import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { Message, Conversation } from '@/types/chat';
import * as chatService from '@/lib/chatService';
import { MessageBubble } from './MessageBubble';
import { CallDialog } from '@/components/chat/CallDialog';

interface ChatInterfaceProps {
  conversation: Conversation;
  onBack: () => void;
  onViewParticipants?: () => void;
}

export function ChatInterface({ conversation, onBack, onViewParticipants }: ChatInterfaceProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const loadMessages = useCallback(async () => {
    try {
      const data = await chatService.fetchMessages(conversation.id);
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [conversation.id, scrollToBottom]);

  const markAsRead = useCallback(async () => {
    try {
      await chatService.markMessagesAsRead(conversation.id);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  }, [conversation.id]);

  useEffect(() => {
    loadMessages();
    markAsRead();

    // Subscribe to new messages
    const unsubscribe = chatService.subscribeToMessages(conversation.id, (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
      if (message.senderId !== user?._id) {
        markAsRead();
      }
    });

    // Subscribe to typing indicators
    const unsubscribeTyping = chatService.subscribeToTyping(
      conversation.id,
      (userId, userName, isTyping) => {
        if (userId !== user?._id) {
          setTypingUsers((prev) => {
            if (isTyping) {
              return prev.includes(userName) ? prev : [...prev, userName];
            } else {
              return prev.filter((name) => name !== userName);
            }
          });
        }
      }
    );

    return () => {
      unsubscribe();
      unsubscribeTyping();
    };
  }, [conversation.id, loadMessages, markAsRead, scrollToBottom, user?._id]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const messageToSend = newMessage.trim();
    setNewMessage(''); // Clear immediately like WhatsApp
    handleTyping(false);

    setSending(true);
    try {
      await chatService.sendMessage(conversation.id, messageToSend);
      scrollToBottom();
    } catch (error) {
      toast.error('Failed to send message');
      setNewMessage(messageToSend); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (typing: boolean) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (typing) {
      setIsTyping(true);
      chatService.sendTypingIndicator(conversation.id, user?.name || '', true);
      
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        chatService.sendTypingIndicator(conversation.id, user?.name || '', false);
      }, 3000);
    } else {
      setIsTyping(false);
      chatService.sendTypingIndicator(conversation.id, user?.name || '', false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const url = await chatService.uploadChatFile(file);
      const type = file.type.startsWith('image/') ? 'image' : 'file';
      await chatService.sendMessage(
        conversation.id,
        file.name,
        type,
        url,
        file.name
      );
      toast.success('File sent');
    } catch (error) {
      toast.error('Failed to upload file');
    }
  };

  const startCall = (type: 'audio' | 'video') => {
    setCallType(type);
    setShowCallDialog(true);
  };

  const handleRecording = async () => {
    if (!isRecording) {
      setIsRecording(true);
      chatService.sendTypingIndicator(conversation.id, user?.name || '', true);
      
      // Simulate recording for 2 seconds (in real app, you'd use MediaRecorder API)
      setTimeout(async () => {
        try {
          await chatService.sendMessage(
            conversation.id,
            '🎤 Voice message',
            'text'
          );
          toast.success('Voice message sent');
        } catch (error) {
          toast.error('Failed to send voice message');
        } finally {
          setIsRecording(false);
          chatService.sendTypingIndicator(conversation.id, user?.name || '', false);
        }
      }, 2000);
    }
  };

  const getConversationTitle = () => {
    if (conversation.type === 'group') {
      return conversation.name || 'Group Chat';
    }
    const otherParticipant = conversation.participants.find(
      (p) => p.userId !== user?._id
    );
    return otherParticipant?.userName || 'Chat';
  };

  const getConversationAvatar = () => {
    if (conversation.type === 'group') {
      return conversation.avatar;
    }
    const otherParticipant = conversation.participants.find(
      (p) => p.userId !== user?._id
    );
    return otherParticipant?.userAvatar;
  };

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-green-600 text-white p-4 flex items-center gap-3 shadow-md">
          <button 
            onClick={onBack} 
            className="md:hidden text-white hover:bg-green-700 p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-semibold">
            {getConversationAvatar() ? (
              <img src={getConversationAvatar()} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              getConversationTitle().slice(0, 1).toUpperCase()
            )}
          </div>

          <div className="flex-1">
            <div className="font-semibold">{getConversationTitle()}</div>
            {isRecording ? (
              <div className="text-sm text-green-100">
                🎤 recording...
              </div>
            ) : typingUsers.length > 0 ? (
              <div className="text-sm text-green-100">
                typing...
              </div>
            ) : null}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#e5ddd5]" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h100v100H0z\' fill=\'%23e5ddd5\'/%3E%3Cpath d=\'M0 0L50 50M50 0L100 50M0 50L50 100M50 50L100 100\' stroke=\'%23d1c7b7\' stroke-width=\'0.5\' opacity=\'0.1\'/%3E%3C/svg%3E")'
        }}>
          <div className="space-y-3">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === user?._id}
              />
            ))}
            <div ref={scrollRef} />
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="bg-gray-100 p-4 flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping(true);
            }}
            placeholder="Type a message"
            className="flex-1 px-4 py-3 rounded-full bg-white border border-gray-300 focus:outline-none focus:border-green-500"
            disabled={isRecording}
          />
          {newMessage.trim() ? (
            <button
              type="submit"
              disabled={sending}
              className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRecording}
              disabled={isRecording}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isRecording
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </form>
      </div>

      {showCallDialog && (
        <CallDialog
          conversation={conversation}
          callType={callType}
          onClose={() => setShowCallDialog(false)}
        />
      )}
    </>
  );
}
