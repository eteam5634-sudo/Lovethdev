import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProfilesDetailRedirect({ params }: Props) {
  const { id } = await params;
  redirect(`/users/${id}`);
}
