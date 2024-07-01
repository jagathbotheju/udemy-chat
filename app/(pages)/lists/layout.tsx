export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col">
      {/* <div className="inline-block max-w-lg text-center justify-center"> */}
      {children}
      {/* </div> */}
    </section>
  );
}
