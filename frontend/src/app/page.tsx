import { redirect } from "next/navigation";

// Root path redirects to /feed
export default function Home() {
  redirect("/feed");
}
