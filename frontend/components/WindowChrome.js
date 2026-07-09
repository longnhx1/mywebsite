import ThemeToggle from "./ThemeToggle";

export default function WindowChrome({ crumb, children }) {
  return (
    <div className="window window-enter">
      <div className="titlebar">
        <div className="titlebar-left">
          <div className="dots">
            <span className="dot r"></span>
            <span className="dot y"></span>
            <span className="dot g"></span>
          </div>
          <div className="titlebar-path">
            ~/longnhx <span>{crumb}</span>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {children}
    </div>
  );
}
