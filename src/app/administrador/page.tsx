import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { projectsCollection } from "@/lib/firebase";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata = { title: "Administrador" };

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const snapshot = await projectsCollection.orderBy("order", "asc").get();
  const projects = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title ?? "",
      description: data.description ?? "",
      details: data.details ?? "",
      images: (Array.isArray(data.images) ? data.images : []) as string[],
      urlLink: data.urlLink ?? null,
      featured: data.featured ?? false,
      order: data.order ?? 0,
    };
  });

  return <AdminDashboard projects={projects} />;
}
