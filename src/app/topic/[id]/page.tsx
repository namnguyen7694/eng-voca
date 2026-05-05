import TopicPageContent from "@/components/TopicPageContent";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <TopicPageContent id={resolvedParams.id} />;
}
