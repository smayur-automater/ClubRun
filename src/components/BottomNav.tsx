"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Users, User } from "lucide-react";

const navItems = [
  { href: "/member", label: "Home", icon: Home },
  { href: "/dashboard", label: "Runs", icon: Calendar },
  { href: "/members", label: "Members", icon: Users },
  { href: "/member#profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="nav-bar">
      {navItems.map(({ href, label, icon: Icon }) => {
        const base = href.split("#")[0];
        const active = pathname === base || (base !== "/" && pathname.startsWith(base));
        return (
          <Link key={href} href={href} className={`nav-item ${active ? "active" : ""}`}>
            <Icon size={22} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
