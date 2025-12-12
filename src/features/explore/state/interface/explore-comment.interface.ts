export interface Comment {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null | undefined;
  comment: string;
  createdAt: number;
  isOptimistic?: boolean;
}

export interface CommentMeta {
  currentPage: number;
  totalPage: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ICommentState {
  comments: Record<string, Comment[]>;
  isLoading: Record<string, boolean>;

  setComments: (fileId: string, data: (Comment | CommentMeta)[]) => void;
  appendComments: (fileId: string, data: (Comment | CommentMeta)[]) => void;
  addOptimisticComment: (fileId: string, comment: Comment) => void;
  updateComment: (fileId: string, updates: Partial<Comment>) => void;
  removeComment: (fileId: string, commentId: string) => void;
  setLoading: (fileId: string, isLoading: boolean) => void;
  clearPostComments: (fileId: string) => void;
}
