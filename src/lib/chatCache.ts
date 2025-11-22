// Chat caching service for faster loading
import { Conversation, Message } from '@/types/chat';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class ChatCache {
  private conversationsCache: CacheEntry<Conversation[]> | null = null;
  private messagesCache: Map<string, CacheEntry<Message[]>> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Cache conversations
  setConversations(conversations: Conversation[]) {
    this.conversationsCache = {
      data: conversations,
      timestamp: Date.now(),
    };
  }

  getConversations(): Conversation[] | null {
    if (!this.conversationsCache) return null;
    
    const age = Date.now() - this.conversationsCache.timestamp;
    if (age > this.CACHE_DURATION) {
      this.conversationsCache = null;
      return null;
    }
    
    return this.conversationsCache.data;
  }

  // Cache messages for a conversation
  setMessages(conversationId: string, messages: Message[]) {
    this.messagesCache.set(conversationId, {
      data: messages,
      timestamp: Date.now(),
    });
  }

  getMessages(conversationId: string): Message[] | null {
    const cached = this.messagesCache.get(conversationId);
    if (!cached) return null;
    
    const age = Date.now() - cached.timestamp;
    if (age > this.CACHE_DURATION) {
      this.messagesCache.delete(conversationId);
      return null;
    }
    
    return cached.data;
  }

  // Update a single message in cache
  updateMessage(conversationId: string, messageId: string, updater: (msg: Message) => Message) {
    const cached = this.messagesCache.get(conversationId);
    if (!cached) return;
    
    cached.data = cached.data.map(msg => 
      msg.id === messageId ? updater(msg) : msg
    );
  }

  // Add a new message to cache
  addMessage(conversationId: string, message: Message) {
    const cached = this.messagesCache.get(conversationId);
    if (!cached) return;
    
    cached.data.push(message);
  }

  // Remove a message from cache
  removeMessage(conversationId: string, messageId: string) {
    const cached = this.messagesCache.get(conversationId);
    if (!cached) return;
    
    cached.data = cached.data.filter(msg => msg.id !== messageId);
  }

  // Clear all cache
  clear() {
    this.conversationsCache = null;
    this.messagesCache.clear();
  }

  // Clear cache for specific conversation
  clearConversation(conversationId: string) {
    this.messagesCache.delete(conversationId);
  }
}

export const chatCache = new ChatCache();
