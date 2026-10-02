import { NextRequest, NextResponse } from "next/server";
import { projectsCollection } from "@/lib/firebase";
import { uploadImage } from "@/lib/cloudinary";
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

// GET /api/projects — lista todos os projetos (público)
export async function GET() {
  try {
    const snapshot = await projectsCollection.orderBy("order", "asc").get();

    const projects = snapshot.docs.map((doc) =>
      serializeProject(doc.id, doc.data()),
    );

    return NextResponse.json(projects);
  } catch (error) {
    console.error("[GET /api/projects]", error);
    return NextResponse.json(
      { error: "Erro ao buscar projetos" },
      { status: 500 },
    );
  }
}

// POST /api/projects — cria novo projeto (somente admin)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const details = formData.get("details") as string;
    const kind = normalizeKind(formData.get("kind"));
    // só guarda link/status das plataformas que o projeto realmente tem
    const urlLink = hasWeb(kind) ? (formData.get("urlLink") as string) : null;
    const appLink = hasApp(kind) ? (formData.get("appLink") as string) : null;
    const webStatus = hasWeb(kind)
      ? (parseWebStatus(formData.get("webStatus")) ?? DEFAULT_WEB_STATUS)
      : null;
    const appStatus = hasApp(kind)
      ? (parseAppStatus(formData.get("appStatus")) ?? DEFAULT_APP_STATUS)
      : null;
    const imageFiles = formData.getAll("images") as File[];

    if (!title || !description || !details) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 },
      );
    }

    // Upload das imagens para Cloudinary
    const imageUrls: string[] = [];
    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const url = await uploadImage(file);
        imageUrls.push(url);
      }
    }

    // Próximo order
    const lastSnapshot = await projectsCollection
      .orderBy("order", "desc")
      .limit(1)
      .get();
    const lastOrder = lastSnapshot.empty
      ? 0
      : (lastSnapshot.docs[0].data().order ?? 0);

    const newProject = {
      title,
      description,
      details,
      urlLink: urlLink || null,
      appLink: appLink || null,
      kind,
      webStatus,
      appStatus,
      images: imageUrls,
      featured: false,
      order: lastOrder + 1,
      createdAt: new Date().toISOString(),
    };

    const docRef = await projectsCollection.add(newProject);

    return NextResponse.json({ id: docRef.id, ...newProject }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/projects]", error);
    return NextResponse.json(
      { error: "Erro ao criar projeto" },
      { status: 500 },
    );
  }
}
