import Image from "next/image";
import { Button } from "@components/ui/button";

export default function BrandPresence() {
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-start gap-4 justify-center">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tighter animate-slideIn">
              Elevate Your Brand Presence
            </h2>
            <p className="text-gray-700">
              With NexiMeet, you can create visually stunning virtual exhibitor
              booths that showcase your brand and products in a way that
              captivates your audience. Customize every aspect to align with
              your brand identity and messaging.
            </p>
            <Button className="bg-[#574476] text-white hover:bg-[#39AIF14]">
              Explore Booth
            </Button>
          </div>
          <div className="flex flex-col items-start gap-4">
            <Image
              src="/images/illustrations/ill5.svg"
              alt="Feature 2"
              width={500}
              height={10}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
