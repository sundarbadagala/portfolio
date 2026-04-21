import HeroSection from "./sections/Hero";
import SkillsSection from "./sections/Skills";
import ExperienceSection from "./sections/Experience";
import ContactSection from "./sections/Contact";
// import Projects from "./sections/Projects";

function LandingPage() {
  return (
    <>
      <HeroSection />
      <SkillsSection />
      <ExperienceSection />
      {/* <Projects/> */}
      <ContactSection />
    </>
  );
}

export default LandingPage;
