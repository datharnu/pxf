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
    href: "/create-event",
  },
  {
    title: "Join Event",
    href: "/join-event",
  },
  {
    title: "My Events",
    href: "/my-events",
  },
  {
    title: "Blog",
    href: "/blog",
  },
];
