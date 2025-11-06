import Head from "next/head";
import { NoneLayout } from "@/components/layouts/NoneLayout";
import ResetPass from "@/components/template/Login/ResetPass/index";

export default function ResetPasswordPage() {
  return (
    <>
      <Head>
        <title>Đặt lại mật khẩu</title>
      </Head>
      <NoneLayout>
        <ResetPass />
      </NoneLayout>
    </>
  );
}
