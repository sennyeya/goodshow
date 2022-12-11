"use client";

import { useEffect, useRef, useState } from "react";

type CounterProps = {
  onCountChanged: (a: number) => void;
  initialCount: number;
  maxCount: number;
};

export default function Counter({
  onCountChanged,
  initialCount,
  maxCount,
}: CounterProps) {
  const [count, setCount] = useState(initialCount);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (input.current) {
      input.current.value = `${count}`;
      input.current.style.width = input.current.value.length + 4 + "ch";
    }
    if (onCountChanged) {
      onCountChanged(count);
    }
  }, [count, onCountChanged]);

  const min = 1;

  return (
    <div className="w-100 flex flex-row align-middle">
      <button
        className="rounded-sm border border-slate-500 px-2 disabled:border-slate-300 disabled:text-slate-300"
        onClick={() => setCount(count - 1)}
        disabled={count <= min}
      >
        -
      </button>
      <div className="w-100 flex rounded-sm border border-slate-500  align-middle ">
        <input
          className="px-2 text-right"
          ref={input}
          max={maxCount}
          min={min}
          type="text"
          onChange={(e) => {
            const newCount = +e.target.value;
            const isANumber = !Number.isNaN(newCount);
            if (isANumber) {
              setCount(newCount);
            }
          }}
        />
      </div>
      <button
        className="ounded-sm border border-slate-500 px-2  disabled:border-slate-300 disabled:text-slate-300"
        onClick={() => setCount(count + 1)}
        disabled={count >= maxCount}
      >
        +
      </button>
    </div>
  );
}
