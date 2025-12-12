import { v4 as uuid } from "uuid";
export const getFingerPrint = () => {
  const id = uuid();
  return id;
};
