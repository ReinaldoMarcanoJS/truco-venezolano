import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div>
      <main>
        <div>
          <h1>Protected Page</h1>
          <p>Welcome, you are authenticated!</p>
        </div>
      </main>
    </div>
  );
}
