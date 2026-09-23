import LandingNavbar from "@/components/landing/layout/Navbar";
import Footer from "@/components/landing/layout/Footer";
import HeroSection from "@/components/landing/sections/HeroSection";
import PersonaTabs from "@/components/landing/sections/PersonaTabs";
import ReadinessCalculator from "@/components/landing/sections/ReadinessCalculator";
import FeaturesBento from "@/components/landing/sections/FeaturesBento";
import WorkflowSteps from "@/components/landing/sections/WorkflowSteps";
import TestimonialsAndPartners from "@/components/landing/sections/TestimonialsAndPartners";
import FaqSection from "@/components/landing/sections/FaqSection";
import CtaBanner from "@/components/landing/sections/CtaBanner";

export const metadata = {
  title: "CAMPUSLINK — AI-Powered Campus Placement Management Platform",
  description:
    "Bridge the gap between campus ambition and career success. CAMPUSLINK provides deterministic eligibility checking, real-time readiness scoring, AI resume & skill gap analysis, and automated campus hiring drives.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500 selection:text-white dark:bg-slate-950 dark:text-slate-100 flex flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <PersonaTabs />
        <ReadinessCalculator />
        <FeaturesBento />
        <WorkflowSteps />
        <TestimonialsAndPartners />
        <FaqSection />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
