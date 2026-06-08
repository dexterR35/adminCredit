/**
 * Light theme colors aligned with viteRCredit / ObtineCredit brand
 */

export const colors = {
  primary: {
    DEFAULT: "#6366f1",
    light: "#818cf8",
    dark: "#4f46e5",
    darker: "#4338ca",
  },

  secondary: {
    DEFAULT: "#8b5cf6",
    light: "#a78bfa",
    dark: "#7c3aed",
  },

  success: {
    DEFAULT: "#059669",
    light: "#10b981",
    dark: "#047857",
    bg: "#ecfdf5",
    border: "#a7f3d0",
  },

  error: {
    DEFAULT: "#dc2626",
    light: "#ef4444",
    dark: "#b91c1c",
    bg: "#fef2f2",
    border: "#fecaca",
  },

  warning: {
    DEFAULT: "#d97706",
    light: "#f59e0b",
    dark: "#b45309",
    bg: "#fffbeb",
    border: "#fde68a",
  },

  info: {
    DEFAULT: "#2563eb",
    light: "#3b82f6",
    dark: "#1d4ed8",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },

  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },

  background: {
    primary: "#f9fafb",
    secondary: "#ffffff",
    tertiary: "#f3f4f6",
    elevated: "#ffffff",
  },

  border: {
    primary: "#6366f1",
    secondary: "#4f46e5",
    default: "#e5e7eb",
    light: "#f3f4f6",
  },

  text: {
    primary: "#111827",
    secondary: "#374151",
    tertiary: "#6b7280",
    muted: "#9ca3af",
  },

  button: {
    submit: {
      tailwind: "bg-primary-600 border-primary-600 text-white hover:bg-primary-700 hover:border-primary-700",
    },
    default: {
      tailwind: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400",
    },
    delete: {
      tailwind: "bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700",
    },
    modal: {
      tailwind: "bg-primary-600 border-primary-600 text-white hover:bg-primary-700 hover:border-primary-700 text-sm",
    },
    logOut: {
      tailwind: "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900",
    },
    logIn: {
      tailwind: "bg-primary-600 border-primary-600 text-white hover:bg-primary-700",
    },
    success: {
      tailwind: "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700",
    },
    error: {
      tailwind: "bg-red-600 border-red-600 text-white hover:bg-red-700",
    },
    edit: {
      tailwind: "bg-amber-500 border-amber-500 text-white hover:bg-amber-600",
    },
    info: {
      tailwind: "bg-blue-600 border-blue-600 text-white hover:bg-blue-700",
    },
    disabled: {
      tailwind: "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60",
    },
  },

};

/** @deprecated Use buttonClassName from Components/Buttons/buttonStyles */
export const getButtonClasses = (type) => colors.button[type]?.tailwind || colors.button.default.tailwind;
/** @deprecated Use badgeClassName from Components/Badge/badgeStyles */
export const getBadgeClasses = (variant) => {
  const map = {
    primary: "badge--accent",
    secondary: "badge--slate",
    danger: "badge--error",
    info: "badge--info",
    default: "badge--default",
    edit: "badge--warning",
  };
  return map[variant] || map.default;
};

export default colors;
