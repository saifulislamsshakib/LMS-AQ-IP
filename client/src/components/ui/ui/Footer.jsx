import { Facebook, Twitter, Github, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-[#0A0A0A] text-gray-700 dark:text-gray-300 mt-100">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo + About */}
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            E-learning
          </h1>
          <p className="mt-3 text-sm">
            Learn new skills online with our expert-led courses. Build your
            future with confidence.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-blue-500">
                Home
              </Link>
            </li>

            <li>
              <Link to="/login" className="hover:text-blue-500">
                Login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-3">Follow Us</h2>
          <div className="flex gap-4">
            <Facebook className="cursor-pointer hover:text-blue-500" />
            <Twitter className="cursor-pointer hover:text-blue-400" />
            <Github className="cursor-pointer hover:text-gray-900 dark:hover:text-white" />
            <Linkedin className="cursor-pointer hover:text-blue-600" />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 text-center py-4 text-sm">
        © 2026 E-learning. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
