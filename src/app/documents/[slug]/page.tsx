import PageContent from "./PageContent";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <>
      <PageContent
        params={{
          slug: params.slug,
        }}
      />
    </>
  );
}
