import Link from "next/link";
import { Button } from "@components/ui/button";

export default function CallToAction() {
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-[#AFDDE5]/20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center text-[#003135]">
            Ready to Elevate Your Virtual Events?
          </h2>
          <p className="text-[#024950] text-center max-w-[600px]">
            Experience the power of NexiMeet and transform the way you connect
            with your audience. Sign up today and unlock a world of
            possibilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/virtualMeetHome">
              <Button className="bg-[#003135] text-white hover:bg-[#024950]">
                Get Started
              </Button>
            </Link>
            <Button className="bg-[#FD3995] text-white hover:bg-[#F5A623]">
              Contact us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
