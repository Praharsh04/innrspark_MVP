import { MobileFrame } from "@/components/shared/MobileFrame";
import { LoginForm } from "@/components/auth/LoginForm";

export default function AuthPage() {
  return (
    <MobileFrame padded={false}>
      <LoginForm />
    </MobileFrame>
  );
}
