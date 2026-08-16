/**
 * Script de migração: MongoDB → Firestore
 * Rode: npm run migrate
 */

import { config } from "dotenv";
import { resolve } from "path";

// Carrega .env.local ANTES de qualquer import do firebase
config({ path: resolve(process.cwd(), ".env.local") });

// Import dinâmico do firebase (só depois que o .env foi carregado)
async function main() {
  const { projectsCollection } = await import("../lib/firebase");

  const projects = [
    {
      title: "Marketplace para veículos",
      description: "Sistema para anúncios de veículos e/ou imóveis.",
      details: "React com Typescript",
      urlLink: "https://marketplace-cars.netlify.app/",
      images: [
        "https://res.cloudinary.com/dgysc0sib/image/upload/v1742916056/projectsImages/gpazfvh3wcyebbyhts8i.png",
        "https://res.cloudinary.com/dgysc0sib/image/upload/v1742916057/projectsImages/jtbardao3vcy9qmxexje.png",
        "https://res.cloudinary.com/dgysc0sib/image/upload/v1742916059/projectsImages/zl0wej0nvwuaeani8bb3.png",
        "https://res.cloudinary.com/dgysc0sib/image/upload/v1742916062/projectsImages/rcuieeogcnv6fiyrgqms.png",
      ],
      createdAt: "2025-03-25T15:21:03.121Z",
      featured: true,
      order: 1,
    },
    {
      title: "Site para Barbearia",
      description: "Apresenta informações sobre uma barbearia.",
      details: "React com Typescript",
      urlLink: "https://shekau-do-corte.netlify.app/",
      images: [
        "https://res.cloudinary.com/dgysc0sib/image/upload/v1743099487/projectsImages/qlrtjqc6iacv2np4td0b.png",
        "https://res.cloudinary.com/dgysc0sib/image/upload/v1743099488/projectsImages/dsex1hdvkjbv3lftvdkg.png",
        "https://res.cloudinary.com/dgysc0sib/image/upload/v1743099489/projectsImages/nit9pfnl8mkwiixmpt2j.png",
        "https://res.cloudinary.com/dgysc0sib/image/upload/v1743099490/projectsImages/kzo7q2skukfzlxkj3rxf.png",
      ],
      createdAt: "2025-03-27T18:18:10.619Z",
      featured: false,
      order: 2,
    },
    {
      title: "Planner Digital Inteligente",
      description: "Guarda anotações e tarefas do dia a dia.",
      details: "Em Javascript",
      urlLink: "https://planner-semanal-elcioservicoson.netlify.app/",
      images: [
        "https://res.cloudinary.com/dgysc0sib/image/upload/v1743100430/projectsImages/xmsi76i3istlsw8kkx8y.png",
        "https://res.cloudinary.com/dgysc0sib/image/upload/v1743100430/projectsImages/okisiv20ph3wjlxyg6py.png",
        "https://res.cloudinary.com/dgysc0sib/image/upload/v1743100431/projectsImages/vxywfkllhl6qoukwc7se.png",
      ],
      createdAt: "2025-03-27T18:33:51.997Z",
      featured: false,
      order: 3,
    },
    {
      title: "Site para empresa de Empréstimos",
      description: "Com foco no compartilhamento em redes sociais",
      details: "Em Javascript",
      urlLink: "https://emprest-emprestimo-consignado.netlify.app/",
      images: [
        "https://res.cloudinary.com/dgysc0sib/image/upload/v1743100676/projectsImages/wrrzypfbxsqymk5e0qb1.png",
        "https://res.cloudinary.com/dgysc0sib/image/upload/v1743100677/projectsImages/bcdujrvdazcb3dvwredg.png",
        "https://res.cloudinary.com/dgysc0sib/image/upload/v1743100677/projectsImages/x0xqejllgwbdmxpllnp1.png",
      ],
      createdAt: "2025-03-27T18:37:58.165Z",
      featured: false,
      order: 4,
    },
    {
      title: "Sistema para Anúncios de Veículos",
      description: "Sistema completo para gerenciamento de anúncios.",
      details: "React com Typescript",
      urlLink: "https://jrf-veiculos-emplacadora.netlify.app/",
      images: [
        "https://res.cloudinary.com/dgysc0sib/image/upload/v1744894755/projectsImages/pfhjd8ievp237jbknd3d.png",
        "https://res.cloudinary.com/dgysc0sib/image/upload/v1744894755/projectsImages/wbdlzkexlqqjhucrefhv.png",
      ],
      createdAt: "2025-04-17T12:59:16.201Z",
      featured: true,
      order: 5,
    },
    {
      title: "Pagina de link personalizada Fhase2",
      description: "Link para bio",
      details: "React",
      urlLink: "https://fhase2-uniformes-e-fardamentos.netlify.app/",
      images: [
        "https://res.cloudinary.com/dgysc0sib/image/upload/v1752841905/projectsImages/enk9wiukh1a6isd2laql.png",
      ],
      createdAt: "2025-07-18T12:31:46.407Z",
      featured: false,
      order: 6,
    },
    {
      title: "Página de link - Eryck imports",
      description: "Página Bio das redes sociais",
      details: "React",
      urlLink: "https://eryck-linktree.netlify.app/",
      images: [
        "https://res.cloudinary.com/dgysc0sib/image/upload/v1753406135/projectsImages/qf3zup6bdmcxji5xgwsd.png",
        "https://res.cloudinary.com/dgysc0sib/image/upload/v1753406136/projectsImages/qdbmgysgzhnlofwp9wfn.png",
      ],
      createdAt: "2025-07-25T01:15:36.983Z",
      featured: false,
      order: 7,
    },
  ];

  console.log("🚀 Iniciando migração para o Firestore...\n");

  const existing = await projectsCollection.get();
  const existingTitles = new Set(
    existing.docs.map((doc) => doc.data().title as string)
  );

  let created = 0;
  let skipped = 0;

  for (const project of projects) {
    if (existingTitles.has(project.title)) {
      console.log(`⏭️  Pulando (já existe): ${project.title}`);
      skipped++;
      continue;
    }
    await projectsCollection.add(project);
    console.log(`✅ Criado: ${project.title}`);
    created++;
  }

  console.log(`\n🎉 Migração concluída!`);
  console.log(`   Criados: ${created}`);
  console.log(`   Pulados: ${skipped}`);
  console.log(`   Total no banco: ${created + existing.size}`);

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Erro na migração:", err);
  process.exit(1);
});
