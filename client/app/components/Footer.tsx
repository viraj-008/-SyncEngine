"use client";
import { AudioLines } from "lucide-react";
import Link from "next/link";
import { Mail, Github, Linkedin, Home, History } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full border-t border-gray-200/80 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="mx-auto py-6">
        {/* Top Section */}
        <div className="flex flex-col items-center gap-6 mb-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              <AudioLines />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                SyncEngine
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Admin Dashboard
              </p>
            </div>
          </div>

          {/* Quick Links with Icons (Mobile Friendly) */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link
              href="/jobs"
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              <Home size={16} />
              <span>Jobs</span>
            </Link>
            <Link
              href="/import-log"
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              <History size={16} />
              <span>History</span>
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
           
            <a
              href="https://github.com/viraj-008"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 hover:scale-110 transition-all"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="www.linkedin.com/in/vivek-kumar-24ab832a2"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-4 border-t border-gray-200/50 dark:border-gray-800/50 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {currentYear} SyncEngine
          </p>
        </div>
      </div>
    </footer>
  );
}
