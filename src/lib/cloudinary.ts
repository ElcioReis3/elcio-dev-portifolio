import { v2 as cloudinary } from "cloudinary";
import { publicIdFromUrl } from "@/lib/cloudinary-url";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  file: File,
  folder = "portfolio-elcio",
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          transformation: [
            // limite generoso: o corte é feito depois, por URL, então
            // vale a pena guardar o original em boa resolução
            { width: 1920, height: 1920, crop: "limit" },
            { quality: "auto:good" },
            { fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!.secure_url);
        },
      )
      .end(buffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

/**
 * Apaga no Cloudinary as imagens que saíram do projeto.
 * Compara por public_id: uma imagem cortada mantém o mesmo public_id do
 * original (só muda a transformação na URL), então ela NÃO é apagada.
 */
export async function deleteRemovedImages(
  before: string[],
  after: string[],
): Promise<void> {
  const keep = new Set(
    after.map(publicIdFromUrl).filter((id): id is string => Boolean(id)),
  );
  const removed = new Set(
    before.map(publicIdFromUrl).filter((id): id is string => Boolean(id)),
  );

  for (const publicId of removed) {
    if (keep.has(publicId)) continue;
    try {
      await deleteImage(publicId);
    } catch (error) {
      // não é crítico: o projeto já foi atualizado no banco
      console.warn("[cloudinary] falha ao apagar", publicId, error);
    }
  }
}

export default cloudinary;
