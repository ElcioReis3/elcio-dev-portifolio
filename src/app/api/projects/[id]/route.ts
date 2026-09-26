import { NextRequest, NextResponse } from "next/server";
import { projectsCollection } from "@/lib/firebase";
import { deleteRemovedImages } from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function serialize(id: string, data: FirebaseFirestore.DocumentData) {
  return {
    id,
    title: data.title ?? "",
    description: data.description ?? "",
    details: data.details ?? "",
    images: Array.isArray(data.images) ? (data.images as string[]) : [],
    urlLink: data.urlLink ?? null,
    featured: data.featured ?? false,
    order: data.order ?? 0,
  };
}

// PUT /api/projects/[id] — atualiza projeto (inclui a lista/ordem de imagens)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { title, description, details, urlLink, featured, order, images } =
      body;

    const docRef = projectsCollection.doc(id);
    const snap = await docRef.get();
    if (!snap.exists) {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
        { status: 404 },
      );
    }

    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (details !== undefined) updates.details = details;
    if (urlLink !== undefined) updates.urlLink = urlLink;
    if (featured !== undefined) updates.featured = featured;
    if (order !== undefined) updates.order = order;

    const previousImages: string[] = Array.isArray(snap.data()?.images)
      ? (snap.data()!.images as string[])
      : [];

    let nextImages: string[] | null = null;
    if (images !== undefined) {
      if (
        !Array.isArray(images) ||
        images.some((url) => typeof url !== "string")
      ) {
        return NextResponse.json(
          { error: "`images` deve ser um array de URLs" },
          { status: 400 },
        );
      }
      nextImages = images as string[];
      updates.images = nextImages;
    }

    updates.updatedAt = new Date().toISOString();
    await docRef.update(updates);

    // limpa no Cloudinary o que foi removido de vez (best effort)
    if (nextImages) {
      await deleteRemovedImages(previousImages, nextImages);
    }

    const updated = await docRef.get();
    return NextResponse.json(serialize(updated.id, updated.data()!));
  } catch (error) {
    console.error("[PUT /api/projects/[id]]", error);
    return NextResponse.json(
      { error: "Erro ao atualizar projeto" },
      { status: 500 },
    );
  }
}

// DELETE /api/projects/[id] — remove projeto e suas imagens
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const docRef = projectsCollection.doc(id);
    const snap = await docRef.get();
    const images: string[] = Array.isArray(snap.data()?.images)
      ? (snap.data()!.images as string[])
      : [];

    await docRef.delete();
    await deleteRemovedImages(images, []);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/projects/[id]]", error);
    return NextResponse.json(
      { error: "Erro ao deletar projeto" },
      { status: 500 },
    );
  }
}
