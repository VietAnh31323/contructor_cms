import "@/styles/global.css";
import { Poppins } from "next/font/google";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import AdminLayout from "@/components/layouts/AdminLayout";
import AuthLayout from "@/components/layouts/AuthLayout";
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-poppins",
});
export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

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
