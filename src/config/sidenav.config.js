import {
  AccessTime,
  AddTask,
  Assessment,
  AssignmentLate,
  NotificationsActive,
  PersonSearch,
  SchoolRounded,
} from "@mui/icons-material";
import AssignmentIcon from "@mui/icons-material/Assignment";

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
  {
    title: "Duty Status",
    href: "/main/duty-status",
    icon: <Assessment />,
  },
  {
    title: "Copy Distribution",
    href: "/main/copy-distribution",
    icon: <AssignmentIcon />,
  },
];

export const invigilationMenu = [
  {
    title: "Examination Slots",
    href: "/main/slots",
    icon: <AccessTime />,
  },
  {
    title: "Approve Invigilations",
    href: "/main/approve-invigilations",
    icon: <AddTask />,
  },
  {
    title: "Student Search",
    href: "/main/student-search",
    icon: <PersonSearch />,
  },
  {
    title: "UFM List",
    href: "/main/ufm",
    icon: <AssignmentLate />,
  },
];
