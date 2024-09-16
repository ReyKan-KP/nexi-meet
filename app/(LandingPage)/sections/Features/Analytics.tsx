import Image from "next/image";
import { Button } from "@components/ui/button";

export default function Analytics() {
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-gray-100">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-start gap-4">
            <Image
              src="/images/illustrations/ill6.svg"
              alt="Feature 3"
              width={550}
              height={10}
              className="mx-auto aspect-video overflow-hidden rounded-xl object-contain object-center sm:w-full animate-fadeIn"
              style={{ transform: "translateX(var(--scroll-x))" }}
            />
          </div>
          <div className="flex flex-col items-start gap-4 justify-center">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tighter animate-slideIn">
              Powerful Analytics and Insights
            </h2>
            <p className="text-gray-700">
              Gain valuable insights into your virtual events with NexiMeet&apos;s
              comprehensive analytics dashboard. Track attendee engagement,
              monitor booth performance, and make data-driven decisions to
              optimize your future events.
            </p>
            <Button className="bg-[#574476] text-white hover:bg-[#39AIF14]">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
