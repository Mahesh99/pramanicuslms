import Image from "next/image";
import { Suspense, type ReactNode } from "react";

export function ClassroomLoginShell({ children }: { children: ReactNode }) {
  return (
    <div className="classroom-login">
      <aside className="classroom-login-brand" aria-hidden={false}>
        <div className="classroom-login-brand-inner">
          <Image
            src="/logo.png"
            alt="Pramanicus Academy"
            width={420}
            height={140}
            priority
            className="classroom-login-logo"
          />
          <p className="classroom-login-tagline">Student learning portal</p>
          <p className="classroom-login-location">Ramanthapur, Hyderabad</p>
        </div>
      </aside>

      <main className="classroom-login-panel">
        <div className="classroom-login-panel-inner">
          <Suspense fallback={<div className="auth-card auth-card--flat">Loading…</div>}>
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
