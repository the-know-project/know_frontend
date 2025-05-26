import { useMutation } from "@tanstack/react-query";

type TRole = "ARTIST" | "BUYER";

export const useSignin = () => {
  return useMutation({
    mutationFn: async (role: TRole) => {
      //function goes here
      return true;
    },
  });
};
