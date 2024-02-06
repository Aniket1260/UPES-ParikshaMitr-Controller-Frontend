import {
  AccessTime,
  NotificationsActive,
  SchoolRounded,
} from "@mui/icons-material";

export const userMenu = [
  {
    title: "Teachers",
    href: "/main/teacher",
    icon: <SchoolRounded />,
  },
  {
    title: "Notifications",
    href: "/main/notification",
    icon: <NotificationsActive />,
  },
];

export const invigilationMenu = [
  {
    title: "Examination Slots",
    href: "/main/slots",
    icon: <AccessTime />,
  },
];
