import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const isLoggedIn = await supabase.auth
    .getUser()
    .then((user) => (user.data.user ? true : false));

  if (!isLoggedIn) {
    redirect("/login");
  }

  return null;
}
