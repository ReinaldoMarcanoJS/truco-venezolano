
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>  
      <main className="">
        <div>
          {children}
        </div>
      </main>
    </>
  );
}
