"use client";

import { useEffect, useState } from "react";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  fileName: string;
  link: string;
  mediaUrl?: string;
  createdAt: string;
  lastSeenAt: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const limit = 9;

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/api/get-jobs?page=${page}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setJobs(data.jobs);
        setTotalPages(data.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [page]);


  const getCompanyInitials = (companyName: string) => {
    if (!companyName?.trim()) return "JD";

    return companyName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() || "")
      .join("");
  };

  return (
    <div className="space-y-4 px-2 sm:px-0 mx-auto  min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-10 px-4 sm:px-6">
       <h1 className="text-4xl text-center sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent mb-4">
             All Jobs
      </h1>

      {loading && (
        <div className="flex h-screen flex-col items-center justify-center gap-4 text-gray-500 dark:text-gray-400">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600 dark:border-teal-800 dark:border-t-teal-400"></div>
          <span className="text-base font-medium">Finding best matches...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && jobs.length === 0 && (
        <div className="flex  flex-col items-center justify-center gap-4 text-gray-500 dark:text-gray-400">
          <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-6">
            <svg
              className="h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">No jobs found</p>
            <p className="mt-1 text-sm">
              Please check back later for new opportunities
            </p>
          </div>
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => {    
          return (
                <div
                  key={job._id}
                  className="group relative flex flex-col rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white dark:bg-gray-800/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-lg hover:border-teal-200 dark:hover:border-teal-800/50 transition-all duration-300"
                >
                  <div className="flex ">
                <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg leading-tight text-gray-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors line-clamp-2">
                        {job.title}
                      </h3>
                      <p className="mt-1 text-base font-medium text-gray-700 dark:text-gray-300 ">
                        {job.company}
                      </p>
                    </div>
                  </div>

                  {/* Job Details Chips */}
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-700/60 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                      <span className="text-teal-600 dark:text-teal-400">
                        📍
                      </span>
                      {job.location || "Remote"}
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-700/60 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                      <span className="text-teal-600 dark:text-teal-400">
                        🕒
                      </span>
                      {job.jobType}
                    </div>
                  </div>

                  {/* Source & Time */}
                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 flex-wrap">
                    <span
                      className=""
                      title={job.fileName || "External"}
                    >
                      File Name: {job.fileName || "External"}
                    </span>
                    <span>•</span>
                    <time dateTime={job.lastSeenAt}>
                      {new Date(job.lastSeenAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-col items-center justify-between gap-6 text-sm">
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                Page{" "}
                <span className="text-teal-700 dark:text-teal-300">{page}</span>{" "}
                of {totalPages}
              </div>

              <div className="flex gap-3">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                  ← Prev
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
