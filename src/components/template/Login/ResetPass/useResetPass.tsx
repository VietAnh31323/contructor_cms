import { useContext } from "react";
import { useFormContext } from "react-hook-form";

export const useResetPass = () => {
  const control = useFormContext();
  return [{ control }, {}];
};
