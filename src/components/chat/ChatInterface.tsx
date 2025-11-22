import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Phone, Video, Users, Send, Mic, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { Message, Conversation } from '@/types/chat';
import * as chatService from '@/lib/chatService';
import { MessageBubble } from './MessageBubble';
import { CallDialog } from '@/components/chat/CallDialog';
import { ChatMessagesSkeleton } from './ChatSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ChatInterfaceProps {
  conversation: Conversation;
  onBack: () => void;
}

export function ChatInterface({ conversation, onBack }: ChatInterfaceProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  const [isRecording, setIsRecording] = useState(false);
  const [page, setPage] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const PAGE_SIZE = 25;

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const loadMessages = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      }
      
      // TODO: Update API to support pagination
      const data = await chatService.fetchMessages(conversation.id);
      
      // Simulate pagination (take last 25 * pageNum messages)
      const paginatedData = data.slice(-PAGE_SIZE * pageNum);
      
      if (append) {
        setMessages(paginatedData);
      } else {
        setMessages(paginatedData);
        scrollToBottom();
      }
      
      setHasMore(data.length > PAGE_SIZE * pageNum);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [conversation.id, scrollToBottom, PAGE_SIZE]);

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
      
      // Show notification if message is from someone else
      if (message.senderId !== user?._id) {
        // Import notification service dynamically
        import('@/lib/notificationService').then(({ notificationService }) => {
          notificationService.notifyNewMessage(
            message.senderName,
            message.content,
            conversation.id
          );
        });
        markAsRead();
      }
      
      // Notify conversation list to refresh
      window.dispatchEvent(new CustomEvent('refresh-conversations'));
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

    // Subscribe to message edits
    const unsubscribeEdit = chatService.subscribeToMessageEdits(conversation.id, (editedMessage) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === editedMessage.id ? editedMessage : msg))
      );
    });

    // Subscribe to message deletes
    const unsubscribeDelete = chatService.subscribeToMessageDeletes(conversation.id, (messageId) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    });

    return () => {
      unsubscribe();
      unsubscribeTyping();
      unsubscribeEdit();
      unsubscribeDelete();
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
      chatService.sendTypingIndicator(conversation.id, user?.name || '', true);
      
      typingTimeoutRef.current = setTimeout(() => {
        chatService.sendTypingIndicator(conversation.id, user?.name || '', false);
      }, 3000);
    } else {
      chatService.sendTypingIndicator(conversation.id, user?.name || '', false);
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

  const handleEditMessage = async (messageId: string, newContent: string) => {
    try {
      await chatService.editMessage(conversation.id, messageId, newContent);
      toast.success('Message edited');
    } catch (error) {
      toast.error('Failed to edit message');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await chatService.deleteMessage(conversation.id, messageId);
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Failed to delete message');
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
        <div className="p-4 border-b flex items-center gap-3">
          <Button 
            variant="ghost"
            size="icon"
            onClick={onBack} 
            className="md:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Avatar className="h-10 w-10">
            {getConversationAvatar() ? (
              <AvatarImage src={getConversationAvatar()} />
            ) : null}
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {conversation.type === 'group' ? (
                <Users className="h-5 w-5" />
              ) : (
                getConversationTitle().slice(0, 1).toUpperCase()
              )}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{getConversationTitle()}</h3>
            {isRecording ? (
              <p className="text-xs text-muted-foreground">
                🎤 recording...
              </p>
            ) : typingUsers.length > 0 ? (
              <p className="text-xs text-muted-foreground">
                typing...
              </p>
            ) : conversation.type === 'group' ? (
              <p className="text-xs text-muted-foreground">
                {conversation.participants.length} participants
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => startCall('audio')}
              title="Audio call"
            >
              <Phone className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => startCall('video')}
              title="Video call"
            >
              <Video className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div 
          className="flex-1 overflow-y-auto p-4"
          ref={messagesContainerRef}
          onScroll={(e) => {
            const target = e.currentTarget;
            if (target.scrollTop === 0 && hasMore && !loadingMore) {
              // Load more messages when scrolled to top
              const newPage = page + 1;
              setPage(newPage);
              loadMessages(newPage, true);
            }
          }}
        >
          {loading ? (
            <ChatMessagesSkeleton />
          ) : (
            <div className="space-y-3">
              {loadingMore && (
                <div className="text-center py-2">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                </div>
              )}
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.senderId === user?._id}
                  onEdit={(id, content) => handleEditMessage(id, content)}
                  onDelete={(id) => handleDeleteMessage(id)}
                />
              ))}
              <div ref={scrollRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Input
              placeholder={isRecording ? "Recording..." : "Type a message..."}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isRecording}
              className="flex-1"
            />

            {newMessage.trim() ? (
              <Button
                onClick={handleSendMessage}
                disabled={sending}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleRecording}
                disabled={isRecording}
                size="icon"
                variant={isRecording ? "destructive" : "default"}
                className={isRecording ? "animate-pulse" : ""}
              >
                <Mic className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
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
