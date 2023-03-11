const EmptyList = () => {
  return (
    <div className="mb-2 flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white shadow-card md:h-24 md:w-24">
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-8 md:w-10"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          d="M1,13 L6,2 L18,2 L23,13 L23,22 L1,22 L1,13 Z M1,13 L8,13 L8,16 L16,16 L16,13 L23,13"
        />
      </svg>
    </div>
  );
};

export default EmptyList;
