import {
  HiOutlineClipboardDocumentList,
  HiOutlineDocumentText,
  HiOutlineHome,
  HiOutlineUserGroup,
} from "react-icons/hi2";

export const APP_NAME = "Obtine Credit";

/** Sidebar + header route metadata */
export const NAV_ITEMS = [
  {
    path: "/home",
    label: "Dashboard",
    description: "Overview and activity",
    icon: HiOutlineHome,
  },
  {
    path: "/customers",
    label: "Web Clients",
    description: "obtinecredit.ro/formular",
    icon: HiOutlineUserGroup,
  },
  {
    path: "/contract",
    label: "Contracts",
    description: "obtinecredit.ro/contract",
    icon: HiOutlineDocumentText,
  },
  {
    path: "/newraport",
    label: "Client Record",
    description: "New fisa report",
    icon: HiOutlineClipboardDocumentList,
  },
];

export const getNavItemByPath = (pathname) =>
  NAV_ITEMS.find((item) => item.path === pathname) ?? null;

/** Breadcrumb trail for the top header */
export const getBreadcrumbs = (pathname) => {
  const current = getNavItemByPath(pathname);

  if (!current) {
    return [
      { label: "Admin", path: "/home" },
      { label: "Page", current: true },
    ];
  }

  if (current.path === "/home") {
    return [
      { label: "Admin", path: "/home" },
      { label: current.label, path: "/home", current: true },
    ];
  }

  return [
    { label: "Admin", path: "/home" },
    { label: current.label, path: current.path, current: true },
  ];
};
