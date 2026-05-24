import { redirect } from "next/navigation";

// Root page redirects straight to the dashboard
export default function Home() {
  redirect("/dashboard");
}