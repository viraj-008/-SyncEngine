'use client';
import { AudioLines } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getStatus } from './monitoring';
import { useState, useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [statusData, setStatusData] = useState<string | null>(null);

  useEffect(() => {
    getStatus().then(data => {
      setStatusData(data.timestamp);
    });
  }, []);

  const getTimeAgo = (timestamp: string) => {
    const diffMs = Date.now() - new Date(timestamp).getTime();
    const min = Math.floor(diffMs / 60000);

    if (min < 1) return "just now";
    if (min < 60) return `${min}m ago`;

    const hours = Math.floor(min / 60);
    const remMin = min % 60;

    if (remMin === 0) return `${hours}h ago`;
    return `${hours}h ${remMin}m ago`;
  };

  return (
   <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 dark:border-gray-800/60 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-sm">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="flex h-16 items-center justify-between">
      
      <div className="flex items-center">
        <Link href="/" className="flex items-center gap-2.5">
        
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-sm">
                <AudioLines />
          </div>
          
          <h1 className="text-md sm:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            SyncEngine Admin
          </h1>
        </Link>
      </div>

      {/* Center - Navigation (desktop) */}
      <nav className="hidden md:flex items-center space-x-8">
        <Link
          href="/jobs"
          className={`text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-lg ${
            pathname === '/jobs'
              ? 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/30 font-semibold'
              : 'text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          All Jobs
        </Link>

        <Link
          href="/import-log"
          className={`text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-lg ${
            pathname === '/import-log' || pathname === '/import-history'
              ? 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/30 font-semibold'
              : 'text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          Import History
        </Link>
      </nav>

      {/* Right side - Status & Mobile nav */}
      <div className="flex items-center gap-4">
        {/* Desktop Status */}
        <div className="hidden md:flex items-center gap-2.5 text-gray-600 dark:text-gray-400">
          <span className="font-medium whitespace-nowrap">Last Import:</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {statusData ? getTimeAgo(statusData) : "No data"}
          </span>
        </div>

        {/* Mobile - Show navigation links horizontally */}
        <div className="flex md:hidden items-center gap-4">
          <Link
            href="/jobs"
            className={`text-xs sm:text-sm font-medium px-2 py-1.5 rounded-lg ${
              pathname === '/jobs'
                ? 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/30'
                : 'text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
            }`}
          >
            Jobs
          </Link>
          
          <Link
            href="/import-log"
            className={`text-xs sm:text-sm font-medium px-2 py-1.5 rounded-lg ${
              pathname === '/import-log' || pathname === '/import-history'
                ? 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/30'
                : 'text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
            }`}
          >
            History
          </Link>

          {statusData && (
            <div className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
              {(() => {
                const timeAgo = getTimeAgo(statusData);
                const parts = timeAgo.split(' ');
                if (parts.length <= 2) return timeAgo;
                return `${parts[0]}${parts[1].charAt(0)}`;
              })()}
            </div>
          )}
        </div>
      </div>
    </div>

   
  </div>
</header>
  );
}