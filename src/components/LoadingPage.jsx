import React, { useState, useEffect } from "react";

const Loader = () => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // Set a timeout to hide the loader after 1 second
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Clear the timeout if the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    // You can customize the loader UI here
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-green-500 text-white z-[1000] text-2xl font-bold">
        Se incarca...
        {/* You can add additional styling or loading animation here */}
      </div>
    );
  }
  return null;
};

export default Loader;
