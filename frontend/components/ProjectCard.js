import Link from "next/link";

export default function ProjectCard({
  icon,
  title,
  description,
  technologies,
  href,
}) {
  const inner = (
    <>
      <span className="icon">[{icon}]</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="tech">
        {technologies.map((tech) => (
          <span key={tech} className="pill">
            {tech}
          </span>
        ))}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="card card-link">
        {inner}
      </Link>
    );
  }

  return <div className="card">{inner}</div>;
}
