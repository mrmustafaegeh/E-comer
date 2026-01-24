export default function Modal({ onClose }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center z-50"
    >
      <div
        className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-11/12"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing when clicking content
      >
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          The Form Has Been Submitted Successfully
        </h1>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
