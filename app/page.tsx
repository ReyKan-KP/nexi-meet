import Image from "next/image";
import "@styles/Landingpage.css";
export default function Home() {
  return (
    <div className="container mx-auto">
  <div className="bg-white flex items-center justify-center min-h-screen">
  <div className="text-center max-w-4xl mx-auto px-4">
    <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-black">
      Welcome to Virtual Hospitality
    </h1>
    <p className="font-sans text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mt-4 max-w-lg mx-auto">
      Hire our professional events team to host up to 10,000 guests in your custom immersive venue.
    </p>
  </div>
</div>

    </div>
  );
}
