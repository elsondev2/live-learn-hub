// Notification service for chat messages

class NotificationService {
  private audio: HTMLAudioElement | null = null;
  private permission: NotificationPermission = 'default';

  constructor() {
    this.initAudio();
    this.requestPermission();
  }

  private initAudio() {
    // Simple notification sound data URI
    const notificationSound = 'data:audio/wav;base64,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';
    
    this.audio = new Audio(notificationSound);
    this.audio.volume = 0.5;
  }

  async requestPermission() {
    if ('Notification' in window) {
      this.permission = await Notification.requestPermission();
    }
  }

  playSound() {
    if (this.audio) {
      this.audio.currentTime = 0;
      this.audio.play().catch(err => console.log('Audio play failed:', err));
    }
  }

  async showNotification(title: string, options?: NotificationOptions) {
    // Play sound
    this.playSound();

    // Show system notification
    if (this.permission === 'granted' && 'Notification' in window) {
      try {
        const notification = new Notification(title, {
          icon: '/logo.png',
          badge: '/logo.png',
          ...options,
        });

        // Auto-close after 5 seconds
        setTimeout(() => notification.close(), 5000);

        return notification;
      } catch (error) {
        console.error('Notification error:', error);
      }
    }
  }

  notifyNewMessage(senderName: string, message: string, conversationId: string) {
    this.showNotification(`New message from ${senderName}`, {
      body: message,
      tag: conversationId, // Prevents duplicate notifications
      requireInteraction: false,
    });
  }
}

export const notificationService = new NotificationService();
