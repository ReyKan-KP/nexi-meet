"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card } from "@components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";

export default function Testimonials() {
  return (
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
            }}
            className="w-full max-w-3xl"
          >
            <CarouselContent>
              <CarouselItem>
                <TestimonialCard
                  avatarSrc="/images/avatar-1.png"
                  avatarFallback="JD"
                  quote="NexiMeet has completely transformed our virtual events. The platform is intuitive, the features are powerful, and the overall experience for our attendees has been exceptional."
                  author="John Doe, CEO at Acme Corp"
                />
              </CarouselItem>
              <CarouselItem>
                <TestimonialCard
                  avatarSrc="/images/avatar-4.png"
                  avatarFallback="SA"
                  quote="As an event organizer, NexiMeet has made my job so much easier. The platform's flexibility and customization options have allowed us to create truly unique and engaging virtual experiences for our attendees."
                  author="Sarah Anderson, Event Manager at XYZ Events"
                />
              </CarouselItem>
              <CarouselItem>
                <TestimonialCard
                  avatarSrc="/images/avatar-5.png"
                  avatarFallback="MK"
                  quote="NexiMeet has been a game-changer for our virtual conferences. The platform's robust features and seamless user experience have allowed us to create truly engaging and memorable events for our attendees."
                  author="Michael Kim, Director of Events at Global Tech"
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ avatarSrc, avatarFallback, quote, author }: {
  avatarSrc: string;
  avatarFallback: string;
  quote: string;
  author: string;
}) {
  return (
    <Card className="p-6 text-center">
      <div className="flex justify-center mb-4">
        <Avatar>
          <AvatarImage src={avatarSrc} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      </div>
      <blockquote className="text-lg text-muted-foreground">
        &quot;{quote}&quot;
      </blockquote>
      <div className="mt-4 font-medium">{author}</div>
    </Card>
  );
}
