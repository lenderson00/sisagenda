import { CommentEditor } from "@/components/activity/comment-editor";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  MessageCircle,
  MoreHorizontal,
  Reply,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { ActivityComment } from "../../@types/activity";

interface DeliveryCommentItemProps {
  comment: ActivityComment;
  onAddReply: (content: string, parentId: string) => void;
  isReply?: boolean;
}

export const DeliveryCommentItem: React.FC<DeliveryCommentItemProps> = ({
  comment,
  onAddReply,
  isReply = false,
}) => {
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [repliesOpen, setRepliesOpen] = useState(true);

  const handleReply = (content: string) => {
    onAddReply(content, comment.id);
    setShowReplyEditor(false);
  };

  const formatContent = (content: string) => {
    return content
      .replace(
        /@(\w+)/g,
        '<span class="text-blue-600 font-medium bg-blue-50 px-1 py-0.5 rounded">@$1</span>',
      )
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>',
      )
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
  };

  return (
    <div className={`${isReply ? "ml-8" : ""} animate-fade-in`}>
      <div className="bg-white rounded-xl border transition-all duration-200">
        {/* Header do comentário */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-gray-50 to-gray-25">
          <div className="flex items-center space-x-3">
            <img
              src={comment.user.image ?? "/placeholder-user.jpg"}
              alt={comment.user.name ?? "User"}
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
            />
            <div>
              <span className="font-semibold text-gray-900">
                {comment.user.name}
              </span>
              <div className="flex items-center space-x-2 text-xs text-gray-500 mt-0.5">
                <MessageCircle className="w-3 h-3" />
                <span>
                  comentou em{" "}
                  {new Date(comment.createdAt).toLocaleString("pt-BR")}
                </span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Conteúdo do comentário */}
        <div className="p-4">
          {isEditing ? (
            <CommentEditor
              initialContent={comment.content ?? ""}
              onSubmit={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div
              className="prose max-w-none text-gray-700 leading-relaxed"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
              dangerouslySetInnerHTML={{
                __html: formatContent(comment.content ?? ""),
              }}
            />
          )}
        </div>

        {/* Footer com reações e ações */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyEditor(!showReplyEditor)}
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            >
              <Reply className="w-4 h-4 mr-2" />
              Responder
            </Button>
          </div>
        </div>

        {showReplyEditor && (
          <div className="p-4 border-t">
            <CommentEditor
              onSubmit={handleReply}
              onCancel={() => setShowReplyEditor(false)}
              placeholder="Escreva sua resposta..."
            />
          </div>
        )}

        {/* Respostas colapsáveis */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="border-t bg-gray-50">
            <Collapsible open={repliesOpen} onOpenChange={setRepliesOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-4 text-sm text-gray-600 hover:bg-gray-100 rounded-none"
                >
                  {repliesOpen ? (
                    <ChevronDown className="w-4 h-4 mr-2" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mr-2" />
                  )}
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {comment.replies.length}{" "}
                  {comment.replies.length === 1 ? "resposta" : "respostas"}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4 space-y-3 pt-3">
                {comment.replies.map((reply) => (
                  <DeliveryCommentItem
                    key={reply.id}
                    comment={reply}
                    onAddReply={onAddReply}
                    isReply
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </div>
    </div>
  );
};
