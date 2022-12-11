import { PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren & {
  type: "button" | "submit" | "reset";
  width: string;
};

export default function Button({ type, children, width }: ButtonProps) {
  return (
    <button
      className={`align-end w-${width} mt-2 rounded border border-slate-700 px-3 py-1`}
      type={type}
    >
      {children}
    </button>
  );
}
