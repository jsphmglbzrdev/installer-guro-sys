import React, { useEffect, useState } from "react";

export default function TextMessage({ message, type, duration = 3000 }) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    setVisible(!!message);
    if (message) {
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!visible) return null;

  const baseClasses = "mb-3 p-3 rounded text-sm transition-all duration-300";
  const typeClasses = {
    error: "bg-red-100 text-red-600",
    success: "bg-green-100 text-green-600",
    info: "bg-blue-100 text-blue-600",
  };

  return <div className={`${baseClasses} ${typeClasses[type] || typeClasses.info}`}>
    {message}
  </div>;
}