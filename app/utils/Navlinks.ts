export interface NavLink {
  title: string;
  href: string;
}

export const navLinks: NavLink[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Create Event",
    href: "/create",
  },
  {
    title: "Join Event",
    href: "/join",
  },
  {
    title: "My Events",
    href: "/dashboard",
  },
  {
    title: "Blog",
    href: "/blog",
  },
];
