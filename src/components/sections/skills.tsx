import Image from "next/image";

const skills = [
  { name: "React", icon: "/images/icons/react-icon.png", level: 90 },
  { name: "Next.js", icon: "/images/icons/nextjs-icon.png", level: 88 },
  { name: "TypeScript", icon: "/images/icons/typescript-icons.png", level: 85 },
  { name: "Tailwind CSS", icon: "/images/icons/tailwindcss.icons.png", level: 92 },
  { name: "Shadcn UI", icon: "/images/icons/shadcn-ui-icon.png", level: 88 },
  { name: "Git", icon: "/images/icons/git-icon.png", level: 80 },
  { name: "HTML", icon: "/images/icons/html-icons.png", level: 95 },
  { name: "CSS / SASS", icon: "/images/icons/css-icons.png", level: 90 },
  { name: "JavaScript", icon: "/images/icons/javascript-icons.png", level: 87 },
];

export function Skills() {
  return (
    <section className="section-padding py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold">Tecnologias</h2>
          <p className="text-muted-foreground text-sm">
            Ferramentas que uso no dia a dia
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-default"
            >
              <div className="relative w-8 h-8">
                <Image
                  src={skill.icon}
                  alt={skill.name}
                  fill
                  className="object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium text-center leading-tight">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
