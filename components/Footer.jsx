import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-10 w-full">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-6 md:mb-0 cursor-pointer">
          <Link href="/">
            <Image
              src="/images/logoWithText.png"
              alt="NexiMeet Logo"
              width={200}
              height={200}
            />
          </Link>
        </div>
        <div className="flex flex-col md:flex-row text-gray-700">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h5 className="font-bold mb-2 hover:text-blue-400">Contact Us</h5>
            <ul>
              <li className="mb-2">
                <Link href="#">
                  <span className="hover:text-blue-400">About Us</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#">
                  <span className="hover:text-blue-400">Careers</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#">
                  <span className="hover:text-blue-400">Blog</span>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span className="hover:text-blue-400">
                    Meet an Event Planner
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-2 hover:text-blue-400">Support</h5>
            <ul>
              <li className="mb-2">
                <Link href="#">
                  <span className="hover:text-blue-400">Help Center</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#">
                  <span className="hover:text-blue-400">Privacy Policy</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#">
                  <span className="hover:text-blue-400">
                    Terms and Conditions
                  </span>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <span className="hover:text-blue-400">
                    Event Manager Portal
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
