import { NextRequest, NextResponse } from "next/server";
import { projectsCollection } from "@/lib/firebase";
import { uploadImage } from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * POST /api/projects/[id]/images
 * formData: images[] (File)
 *
 * Envia novas imagens para um projeto já existente e devolve o projeto
 * atualizado. As imagens entram no fim da lista; a ordem é ajustada no painel.
 */
export async function POST(
  req: NextRequest,
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
    if (!snap.exists) {
      return NextResponse.json(
        { error: "Projeto não encontrado" },
        { status: 404 },
      );
    }

    const formData = await req.formData();
    const files = formData.getAll("images") as File[];
    const valid = files.filter((file) => file && file.size > 0);

    if (valid.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma imagem enviada" },
        { status: 400 },
      );
    }

    const uploaded: string[] = [];
    for (const file of valid) {
      uploaded.push(await uploadImage(file));
    }

    const current: string[] = Array.isArray(snap.data()?.images)
      ? (snap.data()!.images as string[])
      : [];
    const images = [...current, ...uploaded];

    await docRef.update({ images, updatedAt: new Date().toISOString() });

    return NextResponse.json({ id, images, uploaded }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/projects/[id]/images]", error);
    return NextResponse.json(
      { error: "Erro ao enviar imagens" },
      { status: 500 },
    );
  }
}
