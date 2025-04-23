
import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  color = "border-primary",
}) => {
  const sizeClasses = {
    small: "w-4 h-4 border",
    medium: "w-8 h-8 border-2",
    large: "w-12 h-12 border-2",
  };

  return (
    <div className="flex justify-center items-center py-4">
      <div
        className={`${sizeClasses[size]} ${color} border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
