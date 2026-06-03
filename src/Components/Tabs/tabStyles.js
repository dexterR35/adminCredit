/** Tab button states — built on dash-btn / Button, not pill-shaped */

export const tabBadgeClassName = ({ isActive, isCompleted }) => {
  if (isActive) {
    return "flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-primary-600 text-[11px] font-bold text-white";
  }
  if (isCompleted) {
    return "flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-primary-100 text-[11px] font-bold text-primary-700";
  }
  return "flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-gray-100 text-[11px] font-bold text-gray-500";
};

export const tabButtonClassName = ({ isActive, isCompleted, isReachable }) => {
  const base = "shrink-0 !inline-flex !flex-row !items-center !justify-start gap-2 whitespace-nowrap";

  if (isActive) {
    return `${base} !border-primary-300 !bg-primary-50 !text-primary-700 shadow-sm hover:!border-primary-300 hover:!bg-primary-50`;
  }
  if (isCompleted) {
    return `${base} !border-primary-100 !text-primary-700 hover:!border-primary-200 hover:!bg-primary-50/50`;
  }
  if (isReachable) {
    return `${base} hover:!border-gray-300 hover:!bg-gray-50`;
  }
  return `${base} !cursor-not-allowed !border-gray-100 !bg-gray-50 opacity-60 hover:!bg-gray-50 hover:!border-gray-100`;
};

export const tabLabelClassName = ({ isActive }) =>
  `whitespace-nowrap text-xs font-semibold ${isActive ? "text-primary-700" : "text-gray-600"}`;
