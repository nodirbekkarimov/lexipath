import { redirect } from 'next/navigation';

export default function ReaderRedirect({ params }: { params: { id: string } }) {
  redirect(`/reading/${params.id}`);
}
