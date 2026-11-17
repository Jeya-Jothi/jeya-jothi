import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HeroReveal from "@/components/HeroReveal";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
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

        <Projects />
        <Skills />
        <Experience />

        {/* Next section goes here: Experience */}
      </main>
      <Footer />
    </>
  );
}
