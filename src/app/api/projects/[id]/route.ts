import { NextRequest, NextResponse } from "next/server";
import { projectsCollection } from "@/lib/firebase";
import { deleteRemovedImages } from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  DEFAULT_APP_STATUS,
  DEFAULT_WEB_STATUS,
  hasApp,
  hasWeb,
  normalizeKind,
  parseAppStatus,
  parseWebStatus,
  serializeProject,
} from "@/lib/project-badge";

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
    const {
      title,
      description,
      details,
      urlLink,
      featured,
      order,
      images,
      kind,
      appLink,
      webStatus,
      appStatus,
    } = body;

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

    if (appLink !== undefined) updates.appLink = appLink;

    // tipo + status dos badges (web e app têm status próprios)
    if (
      kind !== undefined ||
      webStatus !== undefined ||
      appStatus !== undefined
    ) {
      const current = serializeProject(id, snap.data()!);
      const nextKind = normalizeKind(kind ?? current.kind);
      if (kind !== undefined) updates.kind = nextKind;

      if (webStatus === null) {
        // plataforma removida do projeto: limpa o status
        updates.webStatus = null;
      } else if (webStatus !== undefined) {
        const parsed = parseWebStatus(webStatus);
        if (!parsed) {
          return NextResponse.json(
            { error: "`webStatus` inválido" },
            { status: 400 },
          );
        }
        updates.webStatus = parsed;
      } else if (hasWeb(nextKind) && !current.webStatus) {
        updates.webStatus = DEFAULT_WEB_STATUS;
      }

      if (appStatus === null) {
        // plataforma removida do projeto: limpa o status
        updates.appStatus = null;
      } else if (appStatus !== undefined) {
        const parsed = parseAppStatus(appStatus);
        if (!parsed) {
          return NextResponse.json(
            { error: "`appStatus` inválido" },
            { status: 400 },
          );
        }
        updates.appStatus = parsed;
      } else if (hasApp(nextKind) && !current.appStatus) {
        updates.appStatus = DEFAULT_APP_STATUS;
      }
    }

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
    return NextResponse.json(serializeProject(updated.id, updated.data()!));
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
