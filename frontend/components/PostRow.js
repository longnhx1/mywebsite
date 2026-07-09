export default function PostRow({
  number,
  title,
  description,
  category,
  categoryLabel,
  tags,
  date,
}) {
  const pillClass =
    category === "exp" ? "tag-pill exp" : "tag-pill";

  return (
    <div className="post-row" data-cat={category}>
      <span className="no">{number}</span>
      <div className="meta">
        <h3>{title}</h3>
        <p className="sub">{description}</p>
      </div>
      {tags?.length > 0 && (
        <div className="post-tags">
          {tags.slice(0, 2).map((tag) => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
        </div>
      )}
      <span className={pillClass}>{categoryLabel}</span>
      <span className="date">{date}</span>
    </div>
  );
}
