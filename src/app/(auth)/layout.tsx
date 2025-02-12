import AuthorizationLayout from "@/modules/register/layouts/add-account-layout";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthorizationLayout>{children}</AuthorizationLayout>
    </>
  );
}
