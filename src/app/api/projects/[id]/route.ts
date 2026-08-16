import { NextRequest, NextResponse } from "next/server";
import { projectsCollection } from "@/lib/firebase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PUT /api/projects/[id] — atualiza projeto
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, details, urlLink, featured, order } = body;

    const docRef = projectsCollection.doc(params.id);
    const snap = await docRef.get();
    if (!snap.exists) {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
        { status: 404 }
      );
    }

    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (details !== undefined) updates.details = details;
    if (urlLink !== undefined) updates.urlLink = urlLink;
    if (featured !== undefined) updates.featured = featured;
    if (order !== undefined) updates.order = order;

    await docRef.update(updates);
    const updated = await docRef.get();
    const data = updated.data()!;

    return NextResponse.json({
      id: updated.id,
      title: data.title ?? "",
      description: data.description ?? "",
      details: data.details ?? "",
      images: Array.isArray(data.images) ? data.images : [],
      urlLink: data.urlLink ?? null,
      featured: data.featured ?? false,
      order: data.order ?? 0,
    });
  } catch (error) {
    console.error("[PUT /api/projects/[id]]", error);
    return NextResponse.json(
      { error: "Erro ao atualizar projeto" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] — remove projeto
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    await projectsCollection.doc(params.id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/projects/[id]]", error);
    return NextResponse.json(
      { error: "Erro ao deletar projeto" },
      { status: 500 }
    );
  }
}
