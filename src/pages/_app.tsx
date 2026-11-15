import "@/styles/global.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
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

  return (
    <QueryClientProvider client={queryClient}>
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
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
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
