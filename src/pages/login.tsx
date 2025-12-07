import Login from "@/components/template/Login/LoginForm";
import { NoneLayout } from "@/components/layouts/NoneLayout";
import Head from "next/head";
import { Box } from "@mui/material";
import login from "@/assets/svg/Login.svg";
export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Đăng nhập </title>
      </Head>
      <NoneLayout>
        <Box>
          <Login />
        </Box>
      </NoneLayout>
    </>
  );
}
