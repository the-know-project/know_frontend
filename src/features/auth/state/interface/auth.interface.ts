import { IRole } from "../../types/auth.types";

export interface IRoleState {
  role: IRole;
  setRole: (role: IRole) => void;
  clearRole: () => void;
}
