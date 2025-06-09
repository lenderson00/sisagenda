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
import { User } from "@prisma/client";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Reply,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export interface DeliveryComment {
  id: string;
  user: {
    name: string;
    image: string;
  };
  timestamp: string;
  content: string;
  reactions: Record<string, number>;
  replies: DeliveryComment[];
  parentId?: string;
  attachments?: {
    type: "image" | "document";
    url: string;
    name: string;
  }[];
}

interface DeliveryCommentItemProps {
  comment: DeliveryComment;
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
  const [repliesOpen, setRepliesOpen] = useState(false);

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
      <div className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200">
        {/* Header do comentário */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-gray-50 to-gray-25">
          <div className="flex items-center space-x-3">
            <img
              src={comment.user.image}
              alt={comment.user.name}
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
                  {new Date(comment.timestamp).toLocaleString("pt-BR")}
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
              initialContent={comment.content}
              onSubmit={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div
              className="prose max-w-none text-gray-700 leading-relaxed"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
              dangerouslySetInnerHTML={{
                __html: formatContent(comment.content),
              }}
            />
          )}

          {/* Anexos */}
          {comment.attachments && comment.attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              <h5 className="text-sm font-medium text-gray-700 flex items-center">
                <Paperclip className="w-4 h-4 mr-2" />
                Anexos ({comment.attachments.length})
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {comment.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border transition-colors duration-200"
                  >
                    <div className="flex-shrink-0">
                      {attachment.type === "image" ? (
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          📸
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          📄
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {attachment.type === "image" ? "Imagem" : "Documento"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      Ver
                    </Button>
                  </div>
                ))}
              </div>
            </div>
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

        {/* Respostas colapsáveis */}
        {comment.replies.length > 0 && (
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
              <CollapsibleContent className="px-4 pb-4 space-y-3">
                {comment.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="bg-white rounded-lg border shadow-sm"
                  >
                    <div className="flex items-center space-x-3 p-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                      <img
                        src={reply.user.image}
                        alt={reply.user.name}
                        className="w-6 h-6 rounded-full border"
                      />
                      <div>
                        <span className="font-medium text-gray-900 text-sm">
                          {reply.user.name}
                        </span>
                        <span className="text-gray-500 text-xs ml-2">
                          {new Date(reply.timestamp).toLocaleString("pt-BR")}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <div
                        className="prose max-w-none text-gray-700 text-sm leading-relaxed"
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                        dangerouslySetInnerHTML={{
                          __html: formatContent(reply.content),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </div>

      {/* Editor de resposta */}
      {showReplyEditor && (
        <div className="mt-4 ml-8 animate-fade-in">
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-3 border-b bg-blue-50">
              <span className="text-sm font-medium text-blue-900">
                Responder para {comment.user.name}
              </span>
            </div>
            <CommentEditor
              onSubmit={handleReply}
              onCancel={() => setShowReplyEditor(false)}
              placeholder="Escrever uma resposta..."
            />
          </div>
        </div>
      )}
    </div>
  );
};
