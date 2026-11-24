import CollectionDetail from "@/src/features/collections/components/collection-detail";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CollectionPage({ params }: Props) {
  const { id } = await params;
  return <CollectionDetail collectionId={id} />;
}
