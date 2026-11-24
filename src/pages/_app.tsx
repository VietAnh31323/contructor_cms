import "@/styles/global.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { RecoilRoot } from "recoil";
import { APP_FONT_FAMILY, theme } from "@/components/layouts/theme";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DialogProvider } from "@/components/hooks/dialog/useDialog";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const [queryClient] = useState(() => new QueryClient());

  const isPublicStandalonePage = router.pathname.startsWith("/landing");
  const isAuthPage =
    router.pathname.startsWith("/login") ||
    router.pathname.startsWith("/ressetPass");

  const Layout = isAuthPage ? AuthLayout : AdminLayout;

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Provider store={store}>
        <RecoilRoot>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <DialogProvider>
              {isPublicStandalonePage ? (
                <Component {...pageProps} />
              ) : (
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              )}
            </DialogProvider>

            <ToastContainer
              position="top-right"
              autoClose={3500}
              hideProgressBar={false}
              newestOnTop
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              toastStyle={{ fontFamily: APP_FONT_FAMILY }}
            />
          </ThemeProvider>
        </RecoilRoot>
      </Provider>
    </QueryClientProvider>
  );
}
