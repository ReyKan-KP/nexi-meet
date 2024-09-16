"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Features from "./Feature";
import { Button } from "@components/ui/button";
import Image from "next/image";
import "./Races.css";

gsap.registerPlugin(ScrollTrigger);

const Page = () => {
  const containerRef = useRef(null); // Ref for the div containing the components

  useEffect(() => {
    const container = containerRef.current as HTMLElement | null;
    function getScrollAmount() {
      return container ? -(container.scrollWidth - window.innerWidth) : 0;
    }

    const tween = gsap.to(container, {
      x: getScrollAmount,
      duration: 3,
      ease: "none",
    });

    ScrollTrigger.create({
      trigger: container,
      start: "top 20%",
      end: () => `+=${getScrollAmount() * -1}`,
      pin: true,
      animation: tween,
      scrub: 1,
      invalidateOnRefresh: true,
      // markers: true, // You can remove this in production
    });
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); // Cleanup on unmount
    };
  }, []);

  return (
    <div>
      <Features />
      {/* <div className="h-50vh bg-gray-200"></div>
      <div ref={containerRef} className="flex space-x-4 scroll-container"> */}
        <VirtualExperience />
        <BrandPresence />
        <Analytics />
      {/* </div> */}
    </div>
  );
};

export default Page;

const VirtualExperience = () => {
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
              NexiMeet&apos;s intuitive platform makes it easy to create and
              manage engaging virtual events, from conferences to trade shows.
              Leverage our powerful features to captivate your audience and
              drive meaningful connections.
            </p>
            <Button className="bg-[#574476] text-white hover:bg-[#39AIF14]">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const BrandPresence = () => {
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
};

const Analytics = () => {
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
              Gain valuable insights into your virtual events with
              NexiMeet&apos;s comprehensive analytics dashboard. Track attendee
              engagement, monitor booth performance, and make data-driven
              decisions to optimize your future events.
            </p>
            <Button className="bg-[#574476] text-white hover:bg-[#39AIF14]">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
