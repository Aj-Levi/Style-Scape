"use state";
import { useEffect, useState } from "react";
import { poppins } from "@/styles/fonts";

// CountUpItem component for displaying statistics
const CountUpItem = ({
  endValue,
  title,
}: {
  endValue: number;
  title: string;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 5000;
    const steps = 120;
    const increment = endValue / steps;

    const timer = setInterval(() => {
      setCount((prevCount) => {
        const newCount = prevCount + increment;
        return newCount >= endValue ? endValue : newCount;
      });
    }, duration / steps);

    return () => clearInterval(timer);
  }, [endValue]);

  return (
    <div className="text-center">
      <p className="text-2xl md:text-3xl font-bold">
        {Math.round(count).toLocaleString()} +
      </p>
      <p className={`${poppins.className} font-normal`}>{title}</p>
    </div>
  );
};

export default CountUpItem