import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Nav() {
  return (
    <nav>
      <li className="list-none">
        <Link href="/admin">admin</Link>
      </li>
    </nav>
  );
}
