import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Message } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';
import { File, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="space-y-2">
            <img
              src={message.fileUrl}
              alt={message.fileName || 'Image'}
              className="max-w-sm rounded-lg"
            />
            {message.content && <p>{message.content}</p>}
          </div>
        );
      
      case 'file':
        return (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <File className="h-8 w-8 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{message.fileName}</p>
              <p className="text-xs text-muted-foreground">{message.content}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(message.fileUrl, '_blank')}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        );
      
      default:
        return <p className="whitespace-pre-wrap break-words">{message.content}</p>;
    }
  };

  return (
    <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {!isOwn && (
        <Avatar className="h-8 w-8">
          {message.senderAvatar ? (
            <AvatarImage src={message.senderAvatar} />
          ) : null}
          <AvatarFallback className="text-xs">
            {message.senderName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`flex flex-col gap-1 max-w-[70%] ${isOwn ? 'items-end' : ''}`}>
        {!isOwn && (
          <span className="text-xs font-medium text-muted-foreground">
            {message.senderName}
          </span>
        )}
        
        <div
          className={`rounded-lg px-4 py-2 ${
            isOwn
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          }`}
        >
          {renderContent()}
        </div>
        
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
