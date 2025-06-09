import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Code, Eye, Image, Italic, Link } from "lucide-react";
import { useState } from "react";

interface CommentEditorProps {
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  initialContent?: string;
  placeholder?: string;
}

export const CommentEditor: React.FC<CommentEditorProps> = ({
  onSubmit,
  onCancel,
  initialContent = "",
  placeholder = "Leave a comment...",
}) => {
  const [content, setContent] = useState(initialContent);

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
      setContent("");
    }
  };

  const formatContent = (text: string) => {
    return text
      .replace(/@(\w+)/g, '<span class="text-blue-600 font-medium">@$1</span>')
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>',
      )
      .replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-gray-100 p-2 rounded text-sm font-mono overflow-x-auto">$1</pre>',
      )
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");
  };

  return (
    <div className="border-t">
      <Tabs defaultValue="write" className="w-full">
        <div className="flex items-center justify-between p-2 border-b">
          <TabsList className="h-8">
            <TabsTrigger value="write" className="text-xs">
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs">
              Preview
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Bold className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Italic className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Code className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Link className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Image className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <TabsContent value="write" className="p-4 pt-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="min-h-24 resize-none border-0 focus-visible:ring-0 p-0"
          />
        </TabsContent>

        <TabsContent value="preview" className="p-4 pt-3">
          {content ? (
            <div
              className="prose max-w-none text-sm text-gray-700 min-h-24"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
              dangerouslySetInnerHTML={{ __html: formatContent(content) }}
            />
          ) : (
            <div className="text-gray-400 text-sm min-h-24 flex items-center">
              Nothing to preview
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between p-4 border-t bg-gray-50">
        <div className="text-xs text-gray-500">
          <strong>Tip:</strong> Use @username to mention someone, `code` for
          inline code, and ```code``` for blocks
        </div>

        <div className="flex items-center space-x-2">
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button size="sm" onClick={handleSubmit} disabled={!content.trim()}>
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
};
