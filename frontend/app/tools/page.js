import AppShell from "@/components/AppShell";
import ProjectCard from "@/components/ProjectCard";
import ToolCard from "@/components/ToolCard";
import WordCounter from "@/components/WordCounter";
import AnimateOnView from "@/components/AnimateOnView";
import { projects } from "@/lib/projects";
import { tools } from "@/lib/tools";

export const metadata = {
  title: "Apps, Games & Tools — longn.dev",
  description:
    "Những ứng dụng, tựa game nhỏ và công cụ phần mềm mình sử dụng.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Apps, Games & Tools — longn.dev",
    url: "https://longn.dev/tools",
  },
};

export default function ToolsPage() {
  return (
    <AppShell>
      <section className="view page-enter" style={{ display: "block" }} id="tools">
        <AnimateOnView>
          <p className="eyebrow">góc ứng dụng</p>
          <h2>Apps &amp; Games</h2>
          <p>
            Những ứng dụng, tựa game nhỏ và tiện ích mình đã tự tay xây dựng để học hỏi và dùng thử.
          </p>
        </AnimateOnView>

        <div className="grid">
          {projects.map((project, index) => (
            <AnimateOnView key={project.title} delay={index * 70}>
              <ProjectCard
                icon={project.icon}
                title={project.title}
                description={project.description}
                technologies={project.technologies}
                href={project.href}
              />
            </AnimateOnView>
          ))}
        </div>

        <AnimateOnView delay={200} style={{ marginTop: "4rem" }}>
          <p className="eyebrow">software &amp; gears</p>
          <h2>Công cụ sử dụng</h2>
          <p>Danh sách phần mềm và công cụ mình dùng hàng ngày để code, thiết kế và quản lý.</p>
        </AnimateOnView>

        <div className="grid">
          {tools.map((tool, index) => (
            <AnimateOnView key={tool.name} delay={index * 50}>
              <ToolCard
                name={tool.name}
                description={tool.description}
                url={tool.url}
                platform={tool.platform}
                license={tool.license}
                icon={tool.icon}
              />
            </AnimateOnView>
          ))}
        </div>

        <AnimateOnView delay={200}>
          <WordCounter />
        </AnimateOnView>
      </section>
    </AppShell>
  );
}
