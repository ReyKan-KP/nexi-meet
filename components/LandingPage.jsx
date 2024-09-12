import Link from "next/link";
import Image from "next/image";
import { Button } from "@components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card } from "@components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";
import Hero from "@sections/Hero";
import Contact from "@sections/Contact";

export default function Component() {
  return (
    <>
      <div className="flex flex-col min-h-[100dvh] bg-[#IDC9B7] text-gray-900">
        <main className="flex-1">
          <Hero />
          <section className="py-4 md:py-8 lg:py-12 bg-white">
            <div className="container px-4 md:px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="flex flex-col items-start gap-4">
                  <WebcamIcon className="h-12 w-12 text-[#574476]" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Live Streaming
                  </h3>
                  <p className="text-gray-700">
                    Engage your audience with high-quality live streaming
                    capabilities, enabling seamless virtual presentations and
                    panel discussions.
                  </p>
                </div>
                <div className="flex flex-col items-start gap-4">
                  <ActivityIcon className="h-12 w-12 text-[#574476]" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Interactive Sessions
                  </h3>
                  <p className="text-gray-700">
                    Foster meaningful interactions with real-time Q&A, polls,
                    and breakout rooms, creating an immersive experience for
                    your attendees.
                  </p>
                </div>
                <div className="flex flex-col items-start gap-4">
                  <BoxIcon className="h-12 w-12 text-[#574476]" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Customizable Booths
                  </h3>
                  <p className="text-gray-700">
                    Empower your exhibitors with fully customizable virtual
                    booths, allowing them to showcase their products and
                    services in a visually stunning way.
                  </p>
                </div>
              </div>
            </div>
          </section>
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
                    NexiMeet&apos;s intuitive platform makes it easy to create
                    and manage engaging virtual events, from conferences to
                    trade shows. Leverage our powerful features to captivate
                    your audience and drive meaningful connections.
                  </p>
                  <Button className="bg-[#574476] text-white hover:bg-[#39AIF14]">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </section>
          <section className="py-12 md:py-24 lg:py-32 bg-white">
            <div className="container px-4 md:px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-start gap-4 justify-center">
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tighter animate-slideIn">
                    Elevate Your Brand Presence
                  </h2>
                  <p className="text-gray-700">
                    With NexiMeet, you can create visually stunning virtual
                    exhibitor booths that showcase your brand and products in a
                    way that captivates your audience. Customize every aspect to
                    align with your brand identity and messaging.
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
                    NexiMeet&apos;s comprehensive analytics dashboard. Track
                    attendee engagement, monitor booth performance, and make
                    data-driven decisions to optimize your future events.
                  </p>
                  <Button className="bg-[#574476] text-white hover:bg-[#39AIF14]">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </section>
          <section className="py-12 md:py-24 lg:py-32 bg-background">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center gap-8">
                <h2 className="text-3xl font-bold tracking-tighter text-center text-grey-700">
                  What Our Customers Say
                </h2>
                <Carousel
                  opts={{
                    align: "center",
                    loop: true,
                    autoplay: true,
                    autoplayInterval: 5000,
                  }}
                  className="w-full max-w-3xl"
                >
                  <CarouselContent>
                    <CarouselItem>
                      <Card className="p-6 text-center">
                        <div className="flex justify-center mb-4">
                          <Avatar>
                            <AvatarImage src="/images/avatar-1.png" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                        </div>
                        <blockquote className="text-lg text-muted-foreground">
                          &quot;NexiMeet has completely transformed our virtual
                          events. The platform is intuitive, the features are
                          powerful, and the overall experience for our attendees
                          has been exceptional.&quot;
                        </blockquote>
                        <div className="mt-4 font-medium">
                          John Doe, CEO at Acme Corp
                        </div>
                      </Card>
                    </CarouselItem>
                    <CarouselItem>
                      <Card className="p-6 text-center">
                        <div className="flex justify-center mb-4">
                          <Avatar>
                            <AvatarImage src="/images/avatar-4.png" />
                            <AvatarFallback>SA</AvatarFallback>
                          </Avatar>
                        </div>
                        <blockquote className="text-lg text-muted-foreground">
                          &quot;As an event organizer, NexiMeet has made my job
                          so much easier. The platform&apos;s flexibility and
                          customization options have allowed us to create truly
                          unique and engaging virtual experiences for our
                          attendees.&quot;
                        </blockquote>
                        <div className="mt-4 font-medium">
                          Sarah Anderson, Event Manager at XYZ Events
                        </div>
                      </Card>
                    </CarouselItem>
                    <CarouselItem>
                      <Card className="p-6 text-center">
                        <div className="flex justify-center mb-4">
                          <Avatar>
                            <AvatarImage src="/images/avatar-5.png" />
                            <AvatarFallback>MK</AvatarFallback>
                          </Avatar>
                        </div>
                        <blockquote className="text-lg text-muted-foreground">
                          &quot;NexiMeet has been a game-changer for our virtual
                          conferences. The platform&apos;s robust features and
                          seamless user experience have allowed us to create
                          truly engaging and memorable events for our
                          attendees.&quot;
                        </blockquote>
                        <div className="mt-4 font-medium">
                          Michael Kim, Director of Events at Global Tech
                        </div>
                      </Card>
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </div>
          </section>
          <section className="py-12 md:py-24 lg:py-32 bg-[#AFDDE5]/20">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center gap-6">
                <h2 className="text-3xl font-bold tracking-tighter text-center text-[#003135]">
                  Ready to Elevate Your Virtual Events?
                </h2>
                <p className="text-[#024950] text-center max-w-[600px]">
                  Experience the power of NexiMeet and transform the way you
                  connect with your audience. Sign up today and unlock a world
                  of possibilities.
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
          <Contact />
        </main>
      </div>
    </>
  );
}

function ActivityIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
    </svg>
  );
}

function BoxIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function LogInIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" x2="3" y1="12" y2="12" />
    </svg>
  );
}

function WebcamIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="10" r="8" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 22h10" />
      <path d="M12 22v-4" />
    </svg>
  );
}
