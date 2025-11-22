import { Skeleton } from '@/components/ui/skeleton';

export function ConversationListSkeleton() {
  return (
    <div className="space-y-1">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="p-4 flex items-center gap-3 border-b">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChatMessagesSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={`flex ${i % 3 === 0 ? 'justify-end' : 'justify-start'}`}
        >
          <div className="space-y-2">
            <Skeleton className={`h-16 ${i % 3 === 0 ? 'w-48' : 'w-56'} rounded-lg`} />
          </div>
        </div>
      ))}
    </div>
  );
}
