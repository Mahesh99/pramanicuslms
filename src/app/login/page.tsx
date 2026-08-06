import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ next?: string; denied?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = new URLSearchParams();
  if (params.next) query.set("next", params.next);
  if (params.denied) query.set("denied", params.denied);
  const suffix = query.toString();
  redirect(suffix ? `/?${suffix}` : "/");
}
