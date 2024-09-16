import Hero from "../sections/Hero/page";
import Features from "../sections/Features/page";
import Testimonials from "../sections/Testimonials/page";
import CallToAction from "../sections/CallToAction/page";
// import Contact from "../sections/Contact/page";

export default function LandingPage() {
  return (
    <>
      <div className="flex flex-col min-h-[100dvh] bg-[#IDC9B7] text-gray-900">
        <main className="flex-1">
          <Hero />
          <Features />
          {/* <VirtualExperience />
          <BrandPresence />
          <Analytics /> */}
          <Testimonials />
          <CallToAction />
          {/* <Contact /> */}
        </main>
      </div>
    </>
  );
}
