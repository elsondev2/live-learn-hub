import { useState, useRef } from 'react';
import { Node, Edge } from '@xyflow/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Sparkles, Image, FileText, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  validateAccessKey,
  generateMindMapFromText,
  generateMindMapFromImage,
} from '@/lib/mindmap-ai';

interface MindMapAIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (nodes: Node[], edges: Edge[], title: string) => void;
}

export function MindMapAIDialog({ open, onOpenChange, onGenerate }: MindMapAIDialogProps) {
  const [accessKey, setAccessKey] = useState('');
  const [isKeyValid, setIsKeyValid] = useState(false);
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('text');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleValidateKey = () => {
    if (validateAccessKey(accessKey)) {
      setIsKeyValid(true);
      toast.success('Access key validated!');
    } else {
      toast.error('Invalid access key');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };


  const handleGenerateFromText = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const result = await generateMindMapFromText(topic, context);
      onGenerate(result.nodes, result.edges, result.title);
      onOpenChange(false);
      toast.success('Mind map generated!');
      // Reset form
      setTopic('');
      setContext('');
    } catch (error) {
      toast.error('Failed to generate mind map. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFromImage = async () => {
    if (!imagePreview) {
      toast.error('Please upload an image');
      return;
    }

    setLoading(true);
    try {
      const result = await generateMindMapFromImage(imagePreview, imagePrompt);
      onGenerate(result.nodes, result.edges, result.title);
      onOpenChange(false);
      toast.success('Mind map generated from image!');
      // Reset form
      setImagePreview(null);
      setImagePrompt('');
    } catch (error) {
      toast.error('Failed to analyze image. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Mind Map Generator
          </DialogTitle>
          <DialogDescription>
            Generate mind maps from text topics or images using AI
          </DialogDescription>
        </DialogHeader>

        {!isKeyValid ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <Lock className="h-5 w-5 text-amber-600" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Enter your access key to use AI features
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="access-key">Access Key</Label>
              <div className="flex gap-2">
                <Input
                  id="access-key"
                  type="password"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder="Enter your access key..."
                  onKeyDown={(e) => e.key === 'Enter' && handleValidateKey()}
                />
                <Button onClick={handleValidateKey}>
                  Verify
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <div className="flex items-center gap-2 mb-4 p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800 dark:text-green-200">Access granted</span>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text" className="gap-2">
                  <FileText className="h-4 w-4" />
                  From Text
                </TabsTrigger>
                <TabsTrigger value="image" className="gap-2">
                  <Image className="h-4 w-4" />
                  From Image
                </TabsTrigger>
              </TabsList>


              <TabsContent value="text" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic *</Label>
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Photosynthesis, World War II, Machine Learning..."
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="context">Additional Context (optional)</Label>
                  <Textarea
                    id="context"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Add any specific focus areas or requirements..."
                    rows={3}
                    disabled={loading}
                  />
                </div>
                <Button
                  onClick={handleGenerateFromText}
                  disabled={loading || !topic.trim()}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Mind Map
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="image" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Upload Image</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setImagePreview(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors"
                      disabled={loading}
                    >
                      <Image className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload an image
                      </span>
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-prompt">Focus Area (optional)</Label>
                  <Input
                    id="image-prompt"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="What should the AI focus on in this image?"
                    disabled={loading}
                  />
                </div>
                <Button
                  onClick={handleGenerateFromImage}
                  disabled={loading || !imagePreview}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Image...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate from Image
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
