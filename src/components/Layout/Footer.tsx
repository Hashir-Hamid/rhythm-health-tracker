
import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-900 shadow-sm mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0 flex items-center">
            <Heart className="h-5 w-5 text-primary mr-2" />
            <span className="text-gray-600 dark:text-gray-300">
              HealthRhythm © {currentYear}
            </span>
          </div>
          <div>
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
