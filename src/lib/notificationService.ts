// Notification service for chat messages

class NotificationService {
  private audio: HTMLAudioElement | null = null;
  private permission: NotificationPermission = 'default';

  constructor() {
    this.initAudio();
    this.requestPermission();
  }

  private initAudio() {
    // Use the actual notification sound file from public folder
    this.audio = new Audio('/message-notification-190034.mp3');
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
