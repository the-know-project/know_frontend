import { useMutation } from "@tanstack/react-query";
import { TokenUtils } from "../utils/token.utils";
import { useAuth } from "./use-auth";
import { useRouter } from "next/navigation";
import ToastIcon from "@/src/shared/components/toast-icon";
import ToastDescription from "@/src/shared/components/toast-description";
import { toast } from "sonner";

export const useLogout = () => {
  const auth = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: TokenUtils.logout,
    onSuccess: () => {
      auth.logout();
      toast("", {
        icon: <ToastIcon />,
        description: (
          <ToastDescription description="You have been logged out." />
        ),
      });
      router.push("/");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      auth.logout();
      router.push("/");
    },
  });
};
