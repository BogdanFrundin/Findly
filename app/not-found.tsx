import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap narrow page" style={{ marginInline: "auto", textAlign: "center" }}>
      <p className="eyebrow bur mt48">404</p>
      <h1 className="h1 mt12">Такої сторінки немає</h1>
      <p className="lead mt12" style={{ marginInline: "auto" }}>Можливо, річ уже зняли з продажу. Спробуйте знайти схожу.</p>
      <Link className="btn mt24" href="/search">До пошуку</Link>
    </main>
  );
}
