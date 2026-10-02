import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { projectsCollection } from "@/lib/firebase";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { serializeProject } from "@/lib/project-badge";

export const metadata = { title: "Administrador" };

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const snapshot = await projectsCollection.orderBy("order", "asc").get();
  const projects = snapshot.docs.map((doc) =>
    serializeProject(doc.id, doc.data()),
  );

  return <AdminDashboard projects={projects} />;
}
