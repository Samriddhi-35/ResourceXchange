const RefreshButton = () => {
  return (
    <button className="h-[66px] flex items-center justify-center bg-[#2D7797] text-white rounded-lg shadow-md px-4 py-4 hover:bg-gray-600 transition-colors duration-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="mr-2"
      >
        <path
          d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"
          fill="white"
        />
      </svg>
      Refresh
    </button>
  );
};

export default RefreshButton;

// TODO: Implement refresh button functionality
