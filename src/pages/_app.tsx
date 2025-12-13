import "@/styles/global.css";
import { Poppins } from "next/font/google";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import AdminLayout from "@/components/layouts/AdminLayout";
import AuthLayout from "@/components/layouts/AuthLayout";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { RecoilRoot } from "recoil";
import { theme } from "@/components/layouts/theme";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DialogProvider } from "@/components/hooks/dialog/useDialog";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const [queryClient] = useState(() => new QueryClient());

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
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </DialogProvider>
          </ThemeProvider>
        </RecoilRoot>
      </Provider>

      <ToastContainer
        position="top-center"
        autoClose={0}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </QueryClientProvider>
  );
}
