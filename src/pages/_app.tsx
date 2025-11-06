import "@/styles/global.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import AdminLayout from "@/components/layouts/AdminLayout";
import AuthLayout from "@/components/layouts/AuthLayout";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Nếu là trang đăng nhập hoặc reset password → dùng AuthLayout
  const isAuthPage =
    router.pathname.startsWith("/login") ||
    router.pathname.startsWith("/ressetPass");

  const Layout = isAuthPage ? AuthLayout : AdminLayout;

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
