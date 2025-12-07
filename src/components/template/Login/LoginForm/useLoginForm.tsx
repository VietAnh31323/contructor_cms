import { useContext } from "react";
import { useFormContext } from "react-hook-form";

export const useLoginForm = () => {
  const control = useFormContext();
  return [{ control }, {}];
};
