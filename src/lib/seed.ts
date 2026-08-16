import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const projects = [
  {
    title: "Landing Page | Marketplace para veículos",
    description: "React com Next.js (Tailwindcss, TypeScript e Shadcn) / API Rest",
    details: "Marketplace de veículos com listagem, filtros por categoria, integração com API Rest e design responsivo.",
    images: JSON.stringify(["/images/projetos/cars.png"]),
    urlLink: "https://marketplace-cars.netlify.app/",
    featured: true,
    order: 1,
  },
  {
    title: "Sistema de assinatura | Barbearia",
    description: "React com Next.js (Tailwindcss, TypeScript e Shadcn) / API Rest",
    details: "Sistema completo de agendamento e assinatura para barbearia, com painel administrativo e gestão de clientes.",
    images: JSON.stringify(["/images/projetos/barber-site.png"]),
    urlLink: "https://sua-logoname-barbearia.netlify.app/",
    featured: true,
    order: 2,
  },
  {
    title: "Landing Page | Empresa de empréstimos",
    description: "HTML, CSS e JavaScript",
    details: "Landing page de alta conversão para empresa de empréstimos consignados, com formulário de simulação.",
    images: JSON.stringify(["/images/projetos/emprest-banner.png"]),
    urlLink: "https://emprest-emprestimo-consignado.netlify.app/",
    featured: false,
    order: 3,
  },
  {
    title: "Landing Page | Barbearia Shekau",
    description: "HTML, JavaScript e Tailwindcss",
    details: "Página de apresentação para barbearia com galeria de cortes, localização e botão de agendamento via WhatsApp.",
    images: JSON.stringify(["/images/projetos/shekau.png"]),
    urlLink: "https://shekau-do-corte.netlify.app/",
    featured: false,
    order: 4,
  },
  {
    title: "Landing Page | Studio Barber",
    description: "HTML, CSS e JavaScript",
    details: "Site institucional para studio de barbearia com design moderno e integração com redes sociais.",
    images: JSON.stringify(["/images/projetos/studio-barber-banner.png"]),
    urlLink: "https://studio-barber-cx.netlify.app/",
    featured: false,
    order: 5,
  },
  {
    title: "Gerador de Currículo",
    description: "HTML, JavaScript e Tailwindcss",
    details: "Ferramenta web que gera currículos profissionais em PDF a partir de formulário intuitivo.",
    images: JSON.stringify(["/images/projetos/gerador-curriculo.png"]),
    urlLink: "https://gerador-curriculo.netlify.app/",
    featured: false,
    order: 6,
  },
  {
    title: "Cronômetro Regressivo",
    description: "HTML, CSS e JavaScript",
    details: "Aplicação de cronômetro regressivo personalizável, ideal para apresentações e treinos.",
    images: JSON.stringify(["/images/projetos/cronometro.png"]),
    urlLink: "https://cronometro-regressivo-elcioservicoson.netlify.app/",
    featured: false,
    order: 7,
  },
  {
    title: "Página de Links | Shekau Company",
    description: "React com Next.js (Tailwindcss e TypeScript)",
    details: "Página de links personalizada no estilo Linktree, com identidade visual da marca e múltiplos links.",
    images: JSON.stringify(["/images/projetos/shekau-company.png"]),
    urlLink: "https://shekau-company-site.netlify.app",
    featured: false,
    order: 8,
  },
  {
    title: "Planner de Tarefas Semanais",
    description: "HTML, CSS e JavaScript",
    details: "Organizador semanal de tarefas com drag-and-drop, persistência local e visual clean.",
    images: JSON.stringify(["/images/projetos/planner.png"]),
    urlLink: "https://planner-semanal-elcioservicoson.netlify.app/",
    featured: false,
    order: 9,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing
  await prisma.project.deleteMany();

  // Insert all projects
  for (const project of projects) {
    await prisma.project.create({ data: project });
  }

  console.log(`✅ Created ${projects.length} projects`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
