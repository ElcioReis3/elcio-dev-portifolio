import { NextRequest, NextResponse } from "next/server";
import { db, projectsCollection } from "@/lib/firebase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * PATCH /api/projects/reorder
 * body: { ids: string[] }  — ids na ordem desejada (posição 0 = primeiro)
 *
 * Grava `order` = índice em todos os projetos de uma vez (batch),
 * normalizando ordens duplicadas ou com buracos.
 */
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const ids: unknown = body?.ids;

    if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
      return NextResponse.json(
        { error: "Envie { ids: string[] }" },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    const batch = db.batch();

    (ids as string[]).forEach((id, index) => {
      batch.update(projectsCollection.doc(id), {
        order: index,
        updatedAt: now,
      });
    });

    await batch.commit();

    return NextResponse.json({ success: true, total: ids.length });
  } catch (error) {
    console.error("[PATCH /api/projects/reorder]", error);
    return NextResponse.json(
      { error: "Erro ao salvar a ordem dos projetos" },
      { status: 500 },
    );
  }
}
