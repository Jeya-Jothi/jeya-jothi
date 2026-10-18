import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        {/* Next sections go here: Projects, Experience, Skills, About */}
      </main>
      <Footer />
    </>
  );
}
