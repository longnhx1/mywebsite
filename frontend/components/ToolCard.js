// Component: ToolCard — Card hiển thị tool / phần mềm

export default function ToolCard({ name, description, url, platform, license, icon }) {
  return (
    <a
      href={url}
      className="card tool-card"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="icon tool-icon">{icon}</span>
      <h3>{name}</h3>
      <p>{description}</p>
      <div className="tech">
        <span className="pill">{platform}</span>
        <span className="pill">{license}</span>
      </div>
      <span className="tool-link-hint">Mở trang chủ →</span>
    </a>
  );
}
