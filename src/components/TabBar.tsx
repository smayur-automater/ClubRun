"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Play, Users, User } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
] as const;

const tabsRight = [
  { href: "/clubs", label: "Clubs", icon: Users },
  { href: "/profile", label: "Profile", icon: User },
] as const;

function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="tabbar" aria-label="Main">
      {tabs.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className={`tab-item${isActive(pathname, href) ? " active" : ""}`}>
          <Icon size={22} strokeWidth={isActive(pathname, href) ? 2.4 : 1.8} />
          {label}
        </Link>
      ))}
      <Link href="/record" className="tab-record" aria-label="Record a run">
        <span className="disc">
          <Play size={24} strokeWidth={2.5} fill="currentColor" />
        </span>
      </Link>
      {tabsRight.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className={`tab-item${isActive(pathname, href) ? " active" : ""}`}>
          <Icon size={22} strokeWidth={isActive(pathname, href) ? 2.4 : 1.8} />
          {label}
        </Link>
      ))}
    </nav>
  );
}
