'use client';
import { useState, useEffect } from 'react';
import { getStatus } from '../app/components/monitoring';

interface StatusData {
  failedJobs: number;
  failedRecords: any[]; // [] → better as any[] or Record[]
  fileName: string;
  timestamp: string;
  totalFetched: number;
  totalImported: number;
  newJobs: number;
  updatedJobs: number;
}

export default function Header() {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getStatus()
      .then((data) => {
        if (mounted) {
          console.log('Status data:', data);
          setStatus(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load status:', err);
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

 
  const getTimeAgo = (timestamp: string): string => {
    const diffMs = Date.now() - new Date(timestamp).getTime();
    if (diffMs < 0) return 'just now';

    const minutesTotal = Math.floor(diffMs / 60000);
    if (minutesTotal < 1) return 'just now';

    const hours = Math.floor(minutesTotal / 60);
    const minutes = minutesTotal % 60;

    if (hours > 0) {
      if (minutes > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} min${minutes > 1 ? 's' : ''} ago`;
      }
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }

    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  };

  // Exact Indian format: 04 Feb 2026, 03:18 pm
  const formatExactDateTime = (ts?: string) => {
    if (!ts) return '—';
    try {
      return new Date(ts).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div
      className={`
        relative w-full h-screen
        bg-gradient-to-br from-teal-50 via-white to-emerald-50/80
        dark:from-teal-950/70 dark:via-gray-950 dark:to-emerald-950/60
        backdrop-blur-xl
        border-b border-teal-200/50 dark:border-teal-900/50
        shadow-lg
        
        flex items-center justify-center
        sticky top-0 z-20
      `}
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#374151_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full py-12 lg:py-16">
        {loading ? (
          <div className="text-center space-y-8 animate-pulse">
            <div className="h-12 w-96 bg-gray-300/50 dark:bg-gray-600/40 rounded-xl mx-auto" />
            <div className="h-8 w-80 bg-gray-300/40 rounded-lg mx-auto" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-300/30 rounded-3xl" />
              ))}
            </div>
          </div>
        ) : status ? (
          <div className="space-y- text-center lg:text-left">
            {/* Main Title + Time Ago */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                System Monitoring
              </h1>

              <div className="mt-4 text-xl sm:text-2xl font-medium text-gray-700 dark:text-gray-300 flex flex-col sm:flex-row sm:items-center sm:justify-center lg:justify-start gap-3">
                <span>Last update:</span>
                <span className="font-semibold text-teal-700 dark:text-teal-300">
                  {getTimeAgo(status.timestamp)}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-lg hidden sm:inline">•</span>
                <span className="text-gray-600 dark:text-gray-300 font-medium">
                  {formatExactDateTime(status.timestamp)}
                </span>
              </div>
            </div>

            {/* File name */}
            <div className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto lg:mx-0">
              <span className="font-semibold text-teal-700 dark:text-teal-300">File:</span>{' '}
              <span className="break-all sm:break-normal">{status.fileName || '—'}</span>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 lg:gap-8 pt-6 lg:pt-8">
              <StatCard label="Fetched" value={status.totalFetched} color="text-teal-600 dark:text-teal-400" />
              <StatCard label="Imported" value={status.totalImported} color="text-emerald-600 dark:text-emerald-400" />
              <StatCard label="New Jobs" value={status.newJobs} color="text-indigo-600 dark:text-indigo-400" />
              <StatCard
                label="Failed"
                value={status.failedJobs}
                color={status.failedJobs > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}
                alert={status.failedJobs > 0}
              />
            </div>

            {/* Failed warning */}
            {status.failedJobs > 0 && (
              <div className="mt-8 inline-block px-6 py-4 rounded-2xl bg-red-50/80 dark:bg-red-950/50 border border-red-300/60 dark:border-red-800/50 backdrop-blur-lg text-red-800 dark:text-red-200 text-base sm:text-lg font-medium">
                <span className="font-bold mr-2">⚠️</span>
                {status.failedJobs} job{status.failedJobs > 1 ? 's' : ''} failed • {status.failedRecords?.length || 0} record issue
                {status.failedRecords?.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-xl sm:text-2xl text-red-600 dark:text-red-400 font-medium">
            Failed to load system status
          </div>
        )}
      </div>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: number;
  color: string;
  alert?: boolean;
};

function StatCard({ label, value, color, alert = false }: StatCardProps) {
  return (
    <div
      className={`
        rounded-3xl p-6 lg:p-8 text-center backdrop-blur-xl shadow-xl border
        transition-all hover:scale-[1.03] hover:shadow-2xl
        ${alert
          ? 'bg-red-50/70 border-red-300/60 dark:bg-red-950/40 dark:border-red-700/60'
          : 'bg-white/50 border-teal-200/40 dark:bg-gray-800/40 dark:border-teal-800/40'
        }
      `}
    >
      <div className="text-sm lg:text-base uppercase tracking-wider font-semibold text-gray-600 dark:text-gray-400 mb-3">
        {label}
      </div>
      <div className={`text-4xl lg:text-5xl font-black ${color}`}>
        {value.toLocaleString('en-IN')}
      </div>
    </div>
  );
}