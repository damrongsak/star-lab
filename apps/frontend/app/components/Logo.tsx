import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-sm">★</span>
      <span className="tracking-tight">StarLab</span>
    </Link>
  );
}

