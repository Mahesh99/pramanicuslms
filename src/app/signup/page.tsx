import { SignupForm } from "@/components/SignupForm";
import { SiteHeader } from "@/components/SiteHeader";

export default function SignupPage() {
  return (
    <>
      <SiteHeader />
      <main className="auth-page">
        <SignupForm />
      </main>
    </>
  );
}
