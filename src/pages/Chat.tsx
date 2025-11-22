import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ConversationList } from '@/components/chat/ConversationList';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { NewChatDialog } from '@/components/chat/NewChatDialog';
import { Conversation } from '@/types/chat';
import { MessageSquare } from 'lucide-react';

export default function Chat() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [chatMode, setChatMode] = useState<'direct' | 'group'>('direct');

  const handleNewChat = () => {
    setChatMode('direct');
    setShowNewChatDialog(true);
  };

  const handleNewGroup = () => {
    setChatMode('group');
    setShowNewChatDialog(true);
  };

  const handleChatCreated = () => {
    setShowNewChatDialog(false);
    // Refresh conversation list
    window.location.reload();
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-4rem)] max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          {/* Conversation List */}
          <div className={`${selectedConversation ? 'hidden md:block' : ''}`}>
            <ConversationList
              onSelectConversation={setSelectedConversation}
              onNewChat={handleNewChat}
              onNewGroup={handleNewGroup}
            />
          </div>

          {/* Chat Interface */}
          <div className={`md:col-span-2 ${!selectedConversation ? 'hidden md:flex' : ''}`}>
            {selectedConversation ? (
              <ChatInterface
                conversation={selectedConversation}
                onBack={() => setSelectedConversation(null)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No conversation selected</h3>
                <p className="text-muted-foreground">
                  Select a conversation or start a new chat
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <NewChatDialog
        open={showNewChatDialog}
        onClose={() => setShowNewChatDialog(false)}
        mode={chatMode}
        onSuccess={handleChatCreated}
      />
    </DashboardLayout>
  );
}
