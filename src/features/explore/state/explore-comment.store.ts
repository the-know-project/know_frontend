import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  Comment,
  CommentMeta,
  ICommentState,
} from "./interface/explore-comment.interface";

const isComment = (item: Comment | CommentMeta): item is Comment => {
  return (item as Comment).id !== undefined;
};

export const useCommentStore = create<ICommentState>()(
  persist(
    immer((set) => ({
      comments: {},
      isLoading: {},

      setComments: (fileId, rawData) =>
        set((state) => {
          state.comments[fileId] = rawData.filter(isComment);
        }),

      appendComments: (fileId, rawData) =>
        set((state) => {
          const newComments = rawData.filter(isComment);

          if (!state.comments[fileId]) {
            state.comments[fileId] = [];
          }

          const existingIds = new Set(state.comments[fileId].map((c) => c.id));
          const uniqueNewComments = newComments.filter(
            (c) => !existingIds.has(c.id),
          );

          state.comments[fileId].push(...uniqueNewComments);
        }),

      addOptimisticComment: (fileId, newComment) =>
        set((state) => {
          if (!state.comments[fileId]) {
            state.comments[fileId] = [];
          }
          state.comments[fileId].unshift(newComment);
        }),

      updateComment: (fileId, updates) =>
        set((state) => {
          const list = state.comments[fileId];
          if (list) {
            state.comments[fileId] = {
              ...state.comments[fileId],
              ...updates,
            };
          }
        }),

      removeComment: (fileId, commentId) =>
        set((state) => {
          if (state.comments[fileId]) {
            state.comments[fileId] = state.comments[fileId].filter(
              (c) => c.id !== commentId,
            );
          }
        }),

      setLoading: (fileId, status) =>
        set((state) => {
          state.isLoading[fileId] = status;
        }),

      clearPostComments: (fileId) =>
        set((state) => {
          delete state.comments[fileId];
          delete state.isLoading[fileId];
        }),
    })),
    {
      name: "comment-storage",
      version: 1,
      partialize: (state) => ({
        comments: state.comments,
      }),
    },
  ),
);

export const usePostComments = (fileId: string | null) => {
  if (fileId === null) return [];
  return useCommentStore.getState().comments[fileId] || [];
};

export const useIsCommentsLoading = (fileId: string | null) => {
  if (fileId === null) return false;
  return useCommentStore.getState().isLoading[fileId] || false;
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
    clearPostComments: state.clearPostComments,
  };
};
