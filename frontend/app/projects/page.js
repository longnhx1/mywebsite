import AppShell from "@/components/AppShell";
import ProjectCard from "@/components/ProjectCard";
import ToolCard from "@/components/ToolCard";
import WordCounter from "@/components/WordCounter";
import AnimateOnView from "@/components/AnimateOnView";
import { projects } from "@/lib/projects";
import { tools } from "@/lib/tools";

export const metadata = {
  title: "Projects & Mini-tools — longn.dev",
  description:
    "Những sản phẩm đã làm và công cụ nhỏ dùng thử ngay trên website.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects & Mini-tools — longn.dev",
    url: "https://longn.dev/projects",
  },
};

export default function ProjectsPage() {
  return (
    <AppShell>
      <section className="view page-enter" style={{ display: "block" }} id="projects">
        <AnimateOnView>
          <p className="eyebrow">góc ứng dụng</p>
          <h2>Projects &amp; Mini-tools</h2>
          <p>
            Những sản phẩm đã làm, và vài công cụ nhỏ dùng thử được ngay tại
            đây.
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
