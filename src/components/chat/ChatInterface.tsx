import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Send, Phone, Video, MoreVertical, Paperclip, 
  Image as ImageIcon, Smile, ArrowLeft, Users 
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { Message, Conversation } from '@/types/chat';
import * as chatService from '@/lib/chatService';
import { MessageBubble } from './MessageBubble';
import { CallDialog } from './CallDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    loadMessages();
    markAsRead();

    // Subscribe to new messages
    const unsubscribe = chatService.subscribeToMessages(conversation.id, (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
      if (message.senderId !== user?.id) {
        markAsRead();
      }
    });

    // Subscribe to typing indicators
    const unsubscribeTyping = chatService.subscribeToTyping(
      conversation.id,
      (userId, userName, isTyping) => {
        if (userId !== user?.id) {
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
  }, [conversation.id]);

  const loadMessages = async () => {
    try {
      const data = await chatService.fetchMessages(conversation.id);
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await chatService.markMessagesAsRead(conversation.id);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await chatService.sendMessage(conversation.id, newMessage.trim());
      setNewMessage('');
      handleTyping(false);
      scrollToBottom();
    } catch (error) {
      toast.error('Failed to send message');
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

  const getConversationTitle = () => {
    if (conversation.type === 'group') {
      return conversation.name || 'Group Chat';
    }
    const otherParticipant = conversation.participants.find(
      (p) => p.userId !== user?.id
    );
    return otherParticipant?.userName || 'Chat';
  };

  const getConversationAvatar = () => {
    if (conversation.type === 'group') {
      return conversation.avatar;
    }
    const otherParticipant = conversation.participants.find(
      (p) => p.userId !== user?.id
    );
    return otherParticipant?.userAvatar;
  };

  return (
    <>
      <Card className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b">
          <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Avatar className="h-10 w-10">
            {getConversationAvatar() ? (
              <AvatarImage src={getConversationAvatar()} />
            ) : null}
            <AvatarFallback>
              {conversation.type === 'group' ? (
                <Users className="h-5 w-5" />
              ) : (
                getConversationTitle().slice(0, 2).toUpperCase()
              )}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{getConversationTitle()}</h3>
            {conversation.type === 'group' && (
              <p className="text-xs text-muted-foreground">
                {conversation.participants.length} participants
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => startCall('audio')}>
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => startCall('video')}>
              <Video className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {conversation.type === 'group' && (
                  <DropdownMenuItem onClick={onViewParticipants}>
                    <Users className="mr-2 h-4 w-4" />
                    View Participants
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>Archive Chat</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Leave Chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === user?.id}
              />
            ))}
            
            {typingUsers.length > 0 && (
              <div className="text-sm text-muted-foreground italic">
                {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
              </div>
            )}
            
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Paperclip className="h-5 w-5" />
            </Button>

            <Input
              placeholder="Type a message..."
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
              className="flex-1"
            />

            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              size="icon"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>

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
