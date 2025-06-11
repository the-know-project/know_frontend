import { googleLogin } from "../api/google-login/route";
import { useRoleStore } from "../state/store";
import { IRole } from "../types/auth.types";

// interface LoginSuccess {
//   status: number;
//   message: string;
//   user: {
//     id: string;
//     email: string;
//   };
//   tokens: {
//     accessToken: string;
//     refreshToken: string;
//   };
//   role?: IRole;
// }

export const useGoogleLogin = () => {
  const role = useRoleStore((state) => state.role);
  return {
    mutate: () => {
      googleLogin(role as IRole);
    },
    isPending: false,
    isError: false,
    error: null,
  };
};
