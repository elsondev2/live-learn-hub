// Chat and messaging types

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video';
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
  readBy: string[];
  replyTo?: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read'; // WhatsApp-style status
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  description?: string;
  avatar?: string;
  participants: ConversationParticipant[];
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isArchived?: boolean;
}

export interface ConversationParticipant {
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole: 'TEACHER' | 'STUDENT';
  joinedAt: string;
  lastReadAt?: string;
  isAdmin?: boolean;
}

export interface CallSession {
  id: string;
  conversationId: string;
  type: 'audio' | 'video';
  initiatorId: string;
  participants: CallParticipant[];
  status: 'ringing' | 'active' | 'ended';
  startedAt?: string;
  endedAt?: string;
}

export interface CallParticipant {
  userId: string;
  userName: string;
  status: 'calling' | 'connected' | 'disconnected';
  joinedAt?: string;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
  timestamp: string;
}
