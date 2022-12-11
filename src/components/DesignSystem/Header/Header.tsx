import { PropsWithChildren } from "react";

type HeaderProps = PropsWithChildren & {
  size?: "sm" | "lg" | "md" | "xs";
  className?: string;
  fontWeight?: string;
};

export default function Header({
  size,
  children,
  fontWeight,
  className,
}: HeaderProps) {
  const classString = `font-${fontWeight || "semibold"} text-${size || "xs"} ${
    className || ""
  }`;
  const content = children;
  if (size === "lg") {
    return <h1 className={classString}>{content}</h1>;
  }
  if (size === "md") {
    return <h2 className={classString}>{content}</h2>;
  }
  if (size === "sm") {
    return <h3 className={classString}>{content}</h3>;
  }
  if (size === "xs") {
    return <h4 className={classString}>{content}</h4>;
  }
  return <h5>{content}</h5>;
}
