import AppShell from "@/components/AppShell";
import Link from "next/link";

export const metadata = {
  title: "Không tìm thấy — longn.dev",
  description: "Trang bạn tìm kiếm không tồn tại.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <AppShell>
      <section className="view not-found-view" style={{ display: "block" }}>
        <p className="eyebrow">404</p>
        <h1>
          Trang không tồn tại
          <span className="cursor"></span>
        </h1>
        <p className="lede">
          Có thể URL sai hoặc trang đã được di chuyển. Thử quay về trang chủ
          hoặc xem blog.
        </p>
        <div className="cta-row">
          <Link href="/" className="btn primary">
            Về trang chủ
          </Link>
          <Link href="/blog" className="btn">
            Xem blog
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
