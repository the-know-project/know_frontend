import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface Comment {
  id: string;
  userId: string;
  fileId?: string;
  firstName: string;
  lastName: string;
  ProfilePicture: string | null | undefined;
  comment: string;
  createdAt: number;
}

export interface CommentMeta {
  currentPage: number;
  totalPage: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface CommentState {
  comments: Record<string, Comment[]>;
  isLoading: Record<string, boolean>;

  setComments: (postId: string, data: (Comment | CommentMeta)[]) => void;
  appendComments: (postId: string, data: (Comment | CommentMeta)[]) => void;
  addOptimisticComment: (postId: string, comment: Comment) => void;
  updateComment: (postId: string, commentId: string, updates: Partial<Comment>) => void;
  removeComment: (postId: string, commentId: string) => void;
  setLoading: (postId: string, isLoading: boolean) => void;
}

const isComment = (item: Comment | CommentMeta): item is Comment => {
  return (item as Comment).id !== undefined;
};

export const useCommentStore = create<CommentState>()(
  persist(
    immer((set) => ({
      comments: {},
      isLoading: {},

      setComments: (postId, rawData) =>
        set((state) => {
    
          state.comments[postId] = rawData.filter(isComment);
        }),

      appendComments: (postId, rawData) =>
        set((state) => {
          const newComments = rawData.filter(isComment);
          
          if (!state.comments[postId]) {
            state.comments[postId] = [];
          }


          const existingIds = new Set(state.comments[postId].map((c) => c.id));
          const uniqueNewComments = newComments.filter(
            (c) => !existingIds.has(c.id)
          );

          state.comments[postId].push(...uniqueNewComments);
        }),

  
      addOptimisticComment: (postId, newComment) =>
        set((state) => {
          if (!state.comments[postId]) {
            state.comments[postId] = [];
          }

          state.comments[postId].unshift(newComment);
        }),

 
      updateComment: (postId, commentId, updates) =>
        set((state) => {
          const list = state.comments[postId];
          if (list) {
            const index = list.findIndex((c) => c.id === commentId);
            if (index !== -1) {
              state.comments[postId][index] = {
                ...state.comments[postId][index],
                ...updates,
              };
            }
          }
        }),

      removeComment: (postId, commentId) =>
        set((state) => {
          if (state.comments[postId]) {
            state.comments[postId] = state.comments[postId].filter(
              (c) => c.id !== commentId
            );
          }
        }),

      setLoading: (postId, status) =>
        set((state) => {
          state.isLoading[postId] = status;
        }),
    })),
    {
      name: "comment-storage",
      version: 1,
      
      partialize: (state) => ({
        comments: state.comments,
      }),
    }
  )
);

export const usePostComments = (postId: string | null) => {
  return useCommentStore((state) =>
    postId ? state.comments[postId] || [] : []
  );
};

export const useIsCommentsLoading = (postId: string | null) => {
  return useCommentStore((state) =>
    postId ? state.isLoading[postId] || false : false
  );
};

export const useCommentActions = () => {
  const state = useCommentStore.getState();
  return {
    setComments: state.setComments,
    appendComments: state.appendComments,
    addOptimisticComment: state.addOptimisticComment,
    updateComment: state.updateComment,
    removeComment: state.removeComment,
    setLoading: state.setLoading,
  };
};