
interface ModalProps {
  failedRecords: any[];
  setModalOpen: (open: boolean) => void;
}
export default function Modal({ failedRecords, setModalOpen }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Failed Imports ({failedRecords.length})</h3>
            <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto p-5">
            {failedRecords.map((record) => (
              <div key={record._id} className="mb-4 last:mb-0 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-1 truncate">
                  <strong>URL:</strong> {record.jobId}
                </div>
                <div className="text-xs text-red-600 dark:text-red-400">
                  {record.reason.replace('E11000 duplicate key error collection: ', '')}
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t px-5 py-3">
            <button onClick={() => setModalOpen(false)} className="w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-900">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}