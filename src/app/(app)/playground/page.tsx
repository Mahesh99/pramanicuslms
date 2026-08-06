import { redirect } from "next/navigation";
import { PlaygroundClient } from "@/components/PlaygroundClient";
import { ensureEnrollmentClaimed } from "@/lib/auth";

export default async function PlaygroundPage() {
  const { user, enrolled } = await ensureEnrollmentClaimed();
  if (!user) redirect("/?next=/playground");
  if (!enrolled) redirect("/?denied=1");

  return (
    <>
      <header className="site-header">
        <h1>▶ Python Playground</h1>
        <p className="subtitle">Run Python in your browser — no install needed</p>
      </header>
      <PlaygroundClient />
    </>
  );
}
