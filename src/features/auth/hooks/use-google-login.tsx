import { googleLogin } from "../api/google-login/route";

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
  return {
    mutate: () => {
      googleLogin();
    },
    isPending: false,
    isError: false,
    error: null,
  };
};
