import type { AppointmentActivityWithRelations } from "@/types/appointment-activity";
import { DeliveryCommentItem } from "./comment";
import { CommentEditor } from "./comment-editor";

interface CommentSectionProps {
  comments: AppointmentActivityWithRelations[];
  onAddComment: (content: string, parentId?: string) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onAddComment,
}) => {
  const topLevelComments = comments.filter((comment) => !comment.parentId);
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Comentários ({topLevelComments.length})
      </h2>

      <div className="space-y-4">
        {topLevelComments.map((comment) => (
          <DeliveryCommentItem
            key={comment.id}
            comment={comment}
            onAddReply={onAddComment}
          />
        ))}
      </div>

      <div className="rounded-lg border bg-white">
        <div className="border-b p-4">
          <h3 className="font-medium text-gray-900">Adicionar comentário</h3>
        </div>
        <CommentEditor onSubmit={(content) => onAddComment(content)} />
      </div>
    </div>
  );
};
