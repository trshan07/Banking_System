import React from "react";

const LoanProgress = ({ progress }) => {
  const safeProgress = Math.max(0, Math.min(Number(progress) || 0, 100))

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-green-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${safeProgress}%` }}
      ></div>
    </div>
  );
};

export default LoanProgress;
