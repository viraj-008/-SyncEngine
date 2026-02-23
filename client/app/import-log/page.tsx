"use client";
import { useEffect, useState } from "react";
import Modal from "../components/modal";
export interface ImportData {
  _id: string;
  fileName: string;
  totalFetched: number;
  totalImported: number;
  newJobs: number;
  updatedJobs: number;
  failedJobs: number;
  failedRecords: any[];
  timestamp: string;
}

const ImportLogsPage = () => {
  const [loading, setLoading] = useState(true);
  const [importLogs, setImportLogs] = useState<ImportData[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modelOpen, setModalOpen] = useState(false);
  const [failedRecords, setFailedRecords] = useState<any[]>([]);
  const limit = 10;

  const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/import-logs?page=${page}&limit=${limit}`;

  useEffect(() => {
    const fetchImportLogs = async () => {
      setLoading(true);
      try {
        const response = await fetch(URL);
        const data = await response.json();
        setImportLogs(data.data || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching import logs:", error);
        setImportLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImportLogs();
  }, [page]);

  console.log("Import Logs:", importLogs);
  const formatDate = (isoDate: string) => {
    try {
      return new Date(isoDate).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getTimeFromDate = (isoDate: string) => {
    try {
      return new Date(isoDate).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "--:--";
    }
  };

  const ViewReson = (failedRecords: any[]) => {
    console.log("Failed Records:", failedRecords);
    setModalOpen(!modelOpen);
    setFailedRecords(failedRecords);
  };
  return (
    <>
      {modelOpen && (
        <Modal failedRecords={failedRecords} setModalOpen={setModalOpen} />
      )}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent mb-4">
              Import History
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Track all your job feed imports — monitor progress, successes, and
              resolve issues efficiently.
            </p>
            <div className="mt-6 w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mx-auto"></div>
          </div>

        
          {loading && (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
              <div className="relative">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600 dark:border-teal-900 dark:border-t-teal-400"></div>

              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Loading import logs
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Fetching your import history...
                </p>
              </div>
            </div>
          )}

          {!loading && importLogs.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900/50">
                <svg
                  className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                No import runs found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                Your import history will appear here once you run your first job
                feed import.
              </p>
            </div>
          )}

          {!loading && importLogs.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800/70 rounded-2xl p-5 shadow-sm border border-gray-200/80 dark:border-gray-700/60">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Total Imports
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {importLogs.length}
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800/70 rounded-2xl p-5 shadow-sm border border-gray-200/80 dark:border-gray-700/60">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Total Jobs
                  </div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {importLogs.reduce(
                      (sum, log) => sum + (log.totalFetched || 0),
                      0,
                    )}
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800/70 rounded-2xl p-5 shadow-sm border border-gray-200/80 dark:border-gray-700/60">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    New Jobs Added
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {importLogs.reduce(
                      (sum, log) => sum + (log.newJobs || 0),
                      0,
                    )}
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800/70 rounded-2xl p-5 shadow-sm border border-gray-200/80 dark:border-gray-700/60">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Failed Jobs
                  </div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {importLogs.reduce(
                      (sum, log) => sum + (log.failedJobs || 0),
                      0,
                    )}
                  </div>
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200/80 dark:border-gray-700/60">
                      <tr>
                        {[
                          "File Name",
                          "Total",
                          "New",
                          "Updated",
                          "Failed",
                          "Imported At",
                        ].map((header) => (
                          <th
                            key={header}
                            className="px-8 py-4 text-left font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                      {importLogs.map((log, index) => (
                        <tr
                          key={log._id}
                          className={`hover:bg-gradient-to-r hover:from-teal-50/40 hover:to-emerald-50/20 dark:hover:from-teal-950/20 dark:hover:to-emerald-950/10 transition-all duration-200 ${
                            index % 2 === 0
                              ? "bg-white/30 dark:bg-gray-800/30"
                              : "bg-gray-50/30 dark:bg-gray-800/50"
                          }`}
                        >
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500/10 to-emerald-500/10 flex items-center justify-center">
                                <svg
                                  className="h-5 w-5 text-teal-600 dark:text-teal-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-gray-900 dark:text-white truncate max-w-[300px]">
                                  {log.fileName || "Unknown File"}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                  Import ID: {log._id.slice(-8)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-4 text-center">
                            <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700/60 text-gray-900 dark:text-white font-bold">
                              {log.totalFetched ?? 0}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-center">
                            <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold">
                              {log.newJobs ?? 0}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-center">
                            <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold">
                              {log.updatedJobs ?? 0}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-center">
                            <span
                              className={`inline-flex items-center justify-center h-10 w-10 rounded-full font-bold ${
                                log.failedJobs > 0
                                  ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                  : "bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-400"
                              }`}
                            >
                              {log.failedJobs ?? 0}
                            </span>
                            {log.failedRecords &&
                              log.failedRecords.length > 0 && (
                                <div className="text-xs text-red-600  dark:text-red-400 mt-1">
                                  <button
                                    className="underline cursor-pointer"
                                    onClick={() => ViewReson(log.failedRecords)}
                                  >
                                    View Reasons
                                  </button>
                                </div>
                              )}
                          </td>
                          <td className="px-8 py-4">
                            <div className="text-gray-900 dark:text-white font-medium">
                              {formatDate(log.timestamp)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {getTimeFromDate(log.timestamp)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {importLogs.map((log) => (
                  <div
                    key={log._id}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all"
                  >
                    {/* Top Section - File Info & Time */}
                    <div className="flex justify-between items-start mb-4 gap-3">
                      <div className="min-w-0 flex-1">
                        {/* File Name - Responsive truncation */}
                        <div className="group relative">
                          <div className="font-semibold text-gray-900 dark:text-white text-sm">
                            <div className="line-clamp-2 sm:line-clamp-1 break-words">
                              {log.fileName || "Unknown File"}
                            </div>
                          </div>

                          {/* Show tooltip only if text is truncated */}
                          {log.fileName && log.fileName.length > 40 && (
                            <div className="hidden group-hover:block absolute z-10 -top-2 left-0 transform -translate-y-full px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg max-w-[280px] break-words whitespace-normal">
                              {log.fileName}
                              <div className="absolute bottom-0 left-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-1">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {log._id.slice(-8)}
                          </div>
                          <div className="hidden xs:inline text-xs text-gray-500 dark:text-gray-400">
                            • {getTimeFromDate(log.timestamp)}
                          </div>
                        </div>
                      </div>

                      {/* Time - Visible only on very small screens */}
                      <div className="xs:hidden text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {getTimeFromDate(log.timestamp)}
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {[
                        {
                          label: "Total",
                          value: log.totalFetched ?? 0,
                          color: "text-gray-900 dark:text-white",
                        },
                        {
                          label: "New",
                          value: log.newJobs ?? 0,
                          color: "text-emerald-600 dark:text-emerald-400",
                        },
                        {
                          label: "Updated",
                          value: log.updatedJobs ?? 0,
                          color: "text-blue-600 dark:text-blue-400",
                        },
                        {
                          label: "Failed",
                          value: log.failedJobs ?? 0,
                          color:
                            log.failedJobs > 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-gray-700 dark:text-gray-400",
                        },
                      ].map((stat, index) => (
                        <div key={index} className="text-center">
                          <div className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {stat.label}
                          </div>
                          <div
                            className={`font-bold text-base xs:text-lg ${stat.color}`}
                          >
                            {stat.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Failed Records Button - Positioned below stats grid */}
                    {log.failedRecords && log.failedRecords.length > 0 && (
                      <div className="mt-2 mb-3 flex justify-end">
                        <button
                          onClick={() => ViewReson(log.failedRecords)}
                          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800/30 transition-colors"
                        >
                        
                          View Failed Reasons
                          <span className="ml-1 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 text-[10px] px-1.5 py-0.5 rounded-full">
                            {log.failedRecords.length}
                          </span>
                        </button>
                      </div>
                    )}

                    {/* Bottom Section - Full Date */}
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center justify-between">
                        <span>Imported: {formatDate(log.timestamp)}</span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">
                          {new Date(log.timestamp).toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex flex-col items-center justify-between gap-6">
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    Page{" "}
                    <span className="text-teal-700 dark:text-teal-300 font-bold">
                      {page}
                    </span>{" "}
                    of {totalPages}
                  </div>

                  <div className="flex gap-3">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-md active:scale-95"
                    >
                      ← Previous
                    </button>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-md active:scale-95"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ImportLogsPage;
