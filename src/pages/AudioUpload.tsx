import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Upload, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AudioUpload() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    toast.error('Audio upload feature is not yet implemented with MongoDB backend');
    // TODO: Implement file upload with a storage service (AWS S3, Cloudinary, etc.)
    // and create the corresponding backend API endpoint
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-2xl">
        <Button variant="outline" className="mb-6" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Upload Audio Lesson</CardTitle>
            <CardDescription className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="h-4 w-4" />
              Audio upload feature coming soon - requires file storage setup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Lesson title..."
              />
            </div>
            <div>
              <Label htmlFor="file">Audio File</Label>
              <Input
                id="file"
                type="file"
                accept="audio/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button onClick={handleUpload} disabled className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Upload (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
