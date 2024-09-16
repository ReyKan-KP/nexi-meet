import Image from "next/image";
import { Button } from "@components/ui/button";

export default function VirtualExperience() {
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-gray-100">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-start gap-4">
            <Image
              src="/images/illustrations/ill4.svg"
              alt="Feature 1"
              width={500}
              height={10}
            />
          </div>
          <div className="flex flex-col items-start gap-4 justify-center">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tighter animate-slideIn">
              Seamless Virtual Experiences
            </h2>
            <p className="text-gray-700">
              NexiMeet&apos;s intuitive platform makes it easy to create and manage
              engaging virtual events, from conferences to trade shows. Leverage
              our powerful features to captivate your audience and drive
              meaningful connections.
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
