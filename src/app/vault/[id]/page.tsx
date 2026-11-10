import { redirect } from 'next/navigation';

export default function VaultDetailRedirect({ params }: { params: { id: string } }) {
  redirect(`/vocabulary/${params.id}`);
}
