"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Users, User } from "lucide-react";

const navItems = [
  { href: "/member",    label: "Home",    icon: Home },
  { href: "/dashboard", label: "Runs",    icon: Calendar },
  { href: "/members",   label: "Members", icon: Users },
  { href: "/profile",   label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="nav-bar">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={`nav-item ${active ? "active" : ""}`}
            transitionTypes={["nav-tab"]}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 2} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
