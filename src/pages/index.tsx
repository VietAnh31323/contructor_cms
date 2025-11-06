import { useRouter } from "next/router";
import { useEffect } from "react";
import { ROUTES } from "@/routes";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTES.LOGIN);
  }, [router]);

  return null;
}
