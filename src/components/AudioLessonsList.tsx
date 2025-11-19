import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Music, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface AudioLesson {
  _id: string;
  title: string;
  audio_url: string;
  created_at: string;
}

export function AudioLessonsList({ readonly = false }: { readonly?: boolean }) {
  const [lessons] = useState<AudioLesson[]>([]);

  useEffect(() => {
    // Audio lessons feature not yet implemented with MongoDB backend
    // TODO: Add audio lessons API endpoints and implement this feature
  }, []);

  if (lessons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Music className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">No audio lessons available yet</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {lessons.map((lesson) => (
        <Card key={lesson._id} className="p-4 transition-shadow hover:shadow-md">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{lesson.title}</h3>
            </div>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Added {new Date(lesson.created_at).toLocaleDateString()}
          </p>
          <audio controls className="mb-4 w-full">
            <source src={lesson.audio_url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          {!readonly && (
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
        </Card>
      ))}
    </div>
  );
}
