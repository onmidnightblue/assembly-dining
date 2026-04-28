const SmallLoadingSpinner = () => {
  return (
    <div className="flex items-center pointer-events-none py-1 px-2">
      <div className="w-3 h-3 border-2 border-blue-500 rounded-full border-t-transparent animate-spin" />
    </div>
  );
};

export default SmallLoadingSpinner;
