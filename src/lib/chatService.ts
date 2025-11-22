// Chat service for managing conversations and messages
import { Conversation, Message, ConversationParticipant } from '@/types/chat';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Get auth token
const getAuthToken = () => localStorage.getItem('auth_token');

// Fetch all conversations for current user
export const fetchConversations = async (): Promise<Conversation[]> => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/conversations`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  if (!response.ok) throw new Error('Failed to fetch conversations');
  return response.json();
};

// Create a new conversation
export const createConversation = async (
  type: 'direct' | 'group',
  participantIds: string[],
  name?: string,
  description?: string
): Promise<Conversation> => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/conversations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type, participantIds, name, description }),
  });
  
  if (!response.ok) throw new Error('Failed to create conversation');
  return response.json();
};

// Fetch messages for a conversation
export const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/conversations/${conversationId}/messages`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  if (!response.ok) throw new Error('Failed to fetch messages');
  return response.json();
};

// Send a message
export const sendMessage = async (
  conversationId: string,
  content: string,
  type: 'text' | 'image' | 'file' = 'text',
  fileUrl?: string,
  fileName?: string,
  replyTo?: string
): Promise<Message> => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, type, fileUrl, fileName, replyTo }),
  });
  
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
};

// Mark messages as read
export const markMessagesAsRead = async (conversationId: string): Promise<void> => {
  const token = getAuthToken();
  await fetch(`${API_URL}/conversations/${conversationId}/read`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

// Add participants to group
export const addParticipants = async (
  conversationId: string,
  participantIds: string[]
): Promise<void> => {
  const token = getAuthToken();
  await fetch(`${API_URL}/conversations/${conversationId}/participants`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ participantIds }),
  });
};

// Remove participant from group
export const removeParticipant = async (
  conversationId: string,
  participantId: string
): Promise<void> => {
  const token = getAuthToken();
  await fetch(`${API_URL}/conversations/${conversationId}/participants/${participantId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
};

// Upload file for chat
export const uploadChatFile = async (file: File): Promise<string> => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_URL}/chat/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });
  
  if (!response.ok) throw new Error('Failed to upload file');
  const data = await response.json();
  return data.url;
};

// Subscribe to conversation messages (Socket.io)
export const subscribeToMessages = (
  conversationId: string,
  onMessage: (message: Message) => void
) => {
  // Import socket service dynamically to avoid circular dependencies
  import('./socket').then(({ socketService }) => {
    // Join conversation room
    socketService.emit('join_conversation', conversationId);
    
    // Listen for new messages
    socketService.on('new_message', (message: Message) => {
      if (message.conversationId === conversationId) {
        onMessage(message);
      }
    });
  });

  return () => {
    import('./socket').then(({ socketService }) => {
      socketService.emit('leave_conversation', conversationId);
      socketService.off('new_message');
    });
  };
};

// Subscribe to typing indicators
export const subscribeToTyping = (
  conversationId: string,
  onTyping: (userId: string, userName: string, isTyping: boolean) => void
) => {
  import('./socket').then(({ socketService }) => {
    socketService.on('user_typing', (data: { userId: string; userName: string; isTyping: boolean }) => {
      onTyping(data.userId, data.userName, data.isTyping);
    });
  });

  return () => {
    import('./socket').then(({ socketService }) => {
      socketService.off('user_typing');
    });
  };
};

// Send typing indicator
export const sendTypingIndicator = async (
  conversationId: string,
  userName: string,
  isTyping: boolean
) => {
  const token = getAuthToken();
  if (!token) return;
  
  // Get user ID from token
  const payload = JSON.parse(atob(token.split('.')[1]));
  const userId = payload.userId;
  
  import('./socket').then(({ socketService }) => {
    socketService.emit('typing', {
      conversationId,
      userId,
      userName,
      isTyping,
    });
  });
};

// Edit a message
export const editMessage = async (
  conversationId: string,
  messageId: string,
  content: string
): Promise<void> => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/conversations/${conversationId}/messages/${messageId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  
  if (!response.ok) throw new Error('Failed to edit message');
};

// Delete a message
export const deleteMessage = async (
  conversationId: string,
  messageId: string
): Promise<void> => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/conversations/${conversationId}/messages/${messageId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  
  if (!response.ok) throw new Error('Failed to delete message');
};

// Subscribe to message edits
export const subscribeToMessageEdits = (
  conversationId: string,
  onEdit: (message: Message) => void
) => {
  import('./socket').then(({ socketService }) => {
    socketService.on('message_edited', (message: Message) => {
      if (message.conversationId === conversationId) {
        onEdit(message);
      }
    });
  });

  return () => {
    import('./socket').then(({ socketService }) => {
      socketService.off('message_edited');
    });
  };
};

// Subscribe to message deletes
export const subscribeToMessageDeletes = (
  conversationId: string,
  onDelete: (messageId: string) => void
) => {
  import('./socket').then(({ socketService }) => {
    socketService.on('message_deleted', (data: { messageId: string; conversationId: string }) => {
      if (data.conversationId === conversationId) {
        onDelete(data.messageId);
      }
    });
  });

  return () => {
    import('./socket').then(({ socketService }) => {
      socketService.off('message_deleted');
    });
  };
};
