import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HeroReveal from "@/components/HeroReveal";
import About from "@/components/About";
import Skills from "@/components/skills";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero stays pinned while the dark About panel wipes in on scroll */}
        <HeroReveal panel={<About />}>
          <Hero />
        </HeroReveal>

        <Skills />

        {/* Next sections go here: Projects, Experience */}
      </main>
      <Footer />
    </>
  );
}
