import {
  AccessTime,
  AddTask,
  Assessment,
  AssignmentLate,
  Copyright,
  NotificationsActive,
  PeopleAlt,
  PersonSearch,
  SchoolRounded,
} from "@mui/icons-material";
import AssignmentIcon from "@mui/icons-material/Assignment";

export const userMenu = [
  {
    title: "Teachers",
    href: "/main/teacher",
    icon: <SchoolRounded />,
    proctor: true,
  },
  {
    title: "Notifications",
    href: "/main/notification",
    icon: <NotificationsActive />,
    proctor: true,
  },
  {
    title: "Duty Status",
    href: "/main/duty-status",
    icon: <Assessment />,
    proctor: false,
  },
  {
    title: "Copy Distribution",
    href: "/main/copy-distribution",
    icon: <AssignmentIcon />,
    proctor: false,
  },
];

export const superuserMenu = [
  {
    title: "Users",
    href: "/main/users",
    icon: <PeopleAlt />,
    proctor: true,
  },
];

export const miscMenu = [
  {
    title: "About Us",
    href: "/main/about-us",
    icon: <Copyright />,
    proctor: true,
  },
];

export const invigilationMenu = [
  {
    title: "Examination Slots",
    href: "/main/slots",
    icon: <AccessTime />,
    proctor: false,
  },
  {
    title: "Approve Invigilations",
    href: "/main/approve-invigilations",
    icon: <AddTask />,
    proctor: true,
  },
  {
    title: "Student Search",
    href: "/main/student-search",
    icon: <PersonSearch />,
    proctor: true,
  },
  {
    title: "UFM List",
    href: "/main/ufm",
    icon: <AssignmentLate />,
    proctor: false,
  },
];
