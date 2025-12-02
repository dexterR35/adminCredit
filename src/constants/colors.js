/**
 * Color constants for the application
 * Centralized color management for consistent theming
 */

export const colors = {
  // Primary colors
  primary: {
    DEFAULT: '#6366f1', // indigo-500
    light: '#818cf8', // indigo-400
    dark: '#4f46e5', // indigo-600
    darker: '#4338ca', // indigo-700
  },
  
  // Secondary colors
  secondary: {
    DEFAULT: '#8b5cf6', // violet-500
    light: '#a78bfa', // violet-400
    dark: '#7c3aed', // violet-600
  },
  
  // Status colors
  success: {
    DEFAULT: '#10b981', // emerald-500
    light: '#34d399', // emerald-400
    dark: '#059669', // emerald-600
    bg: '#065f46', // emerald-900
    border: '#047857', // emerald-700
  },
  
  error: {
    DEFAULT: '#ef4444', // red-500
    light: '#f87171', // red-400
    dark: '#dc2626', // red-600
    bg: '#991b1b', // red-900
    border: '#b91c1c', // red-700
  },
  
  warning: {
    DEFAULT: '#f59e0b', // amber-500
    light: '#fbbf24', // amber-400
    dark: '#d97706', // amber-600
    bg: '#78350f', // amber-900
    border: '#92400e', // amber-700
  },
  
  info: {
    DEFAULT: '#3b82f6', // blue-500
    light: '#60a5fa', // blue-400
    dark: '#2563eb', // blue-600
    bg: '#1e3a8a', // blue-900
    border: '#1e40af', // blue-700
  },
  
  // Neutral colors (dark theme)
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Background colors
  background: {
    primary: '#111827', // gray-900
    secondary: '#1f2937', // gray-800
    tertiary: '#374151', // gray-700
  },
  
  // Border colors
  border: {
    primary: '#6366f1', // indigo-500 (primary)
    secondary: '#4f46e5', // indigo-600
    default: '#374151', // gray-700
    light: '#4b5563', // gray-600
    dark: '#1f2937', // gray-800
  },
  
  // Text colors
  text: {
    primary: '#ffffff',
    secondary: '#e5e7eb', // gray-200
    tertiary: '#9ca3af', // gray-400
    muted: '#6b7280', // gray-500
  },
  
  // Button colors mapping (includes hex values and Tailwind classes)
  button: {
    submit: {
      bg: '#6366f1', // colors.primary.DEFAULT
      border: '#6366f1', // colors.primary.DEFAULT
      hover: '#4f46e5', // colors.primary.dark
      text: '#ffffff', // colors.text.primary
      tailwind: 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700',
    },
    default: {
      bg: '#374151', // colors.gray[700]
      border: '#4b5563', // colors.gray[600]
      hover: '#4b5563', // colors.gray[600]
      text: '#ffffff', // colors.text.primary
      tailwind: 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600',
    },
    delete: {
      bg: '#ef4444', // colors.error.DEFAULT
      border: '#ef4444', // colors.error.DEFAULT
      hover: '#dc2626', // colors.error.dark
      text: '#ffffff', // colors.text.primary
      tailwind: 'bg-red-600 border-red-600 text-white hover:bg-red-700',
    },
    modal: {
      bg: '#6366f1', // colors.primary.DEFAULT
      border: '#6366f1', // colors.primary.DEFAULT
      hover: '#4f46e5', // colors.primary.dark
      text: '#ffffff', // colors.text.primary
      tailwind: 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 text-sm',
    },
    success: {
      bg: '#10b981', // colors.success.DEFAULT
      border: '#10b981', // colors.success.DEFAULT
      hover: '#059669', // colors.success.dark
      text: '#ffffff', // colors.text.primary
      tailwind: 'bg-green-600 border-green-600 text-white hover:bg-green-700',
    },
    error: {
      bg: '#ef4444', // colors.error.DEFAULT
      border: '#ef4444', // colors.error.DEFAULT
      hover: '#dc2626', // colors.error.dark
      text: '#ffffff', // colors.text.primary
      tailwind: 'bg-red-600 border-red-600 text-white hover:bg-red-700',
    },
    edit: {
      bg: '#f59e0b', // colors.warning.DEFAULT
      border: '#f59e0b', // colors.warning.DEFAULT
      hover: '#d97706', // colors.warning.dark
      text: '#ffffff', // colors.text.primary
      tailwind: 'bg-amber-600 border-amber-600 text-white hover:bg-amber-700',
    },
    info: {
      bg: '#3b82f6', // colors.info.DEFAULT
      border: '#3b82f6', // colors.info.DEFAULT
      hover: '#2563eb', // colors.info.dark
      text: '#ffffff', // colors.text.primary
      tailwind: 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700',
    },
    logOut: {
      bg: '#1f2937', // colors.gray[800]
      border: '#374151', // colors.gray[700]
      hover: '#374151', // colors.gray[700]
      text: '#e5e7eb', // colors.text.secondary
      tailwind: 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700',
    },
    logIn: {
      bg: '#1f2937', // colors.gray[800]
      border: '#374151', // colors.gray[700]
      hover: '#374151', // colors.gray[700]
      text: '#e5e7eb', // colors.text.secondary
      tailwind: 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700',
    },
    disabled: {
      bg: '#1f2937', // colors.gray[800]
      border: '#374151', // colors.gray[700]
      text: '#6b7280', // colors.text.muted
      opacity: 0.5,
      tailwind: 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed opacity-50',
    },
  },
  
  // Badge colors mapping (includes hex values and Tailwind classes)
  badge: {
    default: {
      bg: '#374151', // colors.gray[700]
      text: '#e5e7eb', // colors.text.secondary
      border: '#4b5563', // colors.gray[600]
      tailwind: 'bg-gray-700 text-gray-300 border border-gray-600',
    },
    success: {
      bg: '#065f464D', // colors.success.bg with transparency
      text: '#34d399', // colors.success.light
      border: '#04785780', // colors.success.border with transparency
      tailwind: 'bg-green-900/30 text-green-400 border border-green-700/50',
    },
    error: {
      bg: '#991b1b4D', // colors.error.bg with transparency
      text: '#f87171', // colors.error.light
      border: '#b91c1c80', // colors.error.border with transparency
      tailwind: 'bg-red-900/30 text-red-400 border border-red-700/50',
    },
    warning: {
      bg: '#78350f4D', // colors.warning.bg with transparency
      text: '#fbbf24', // colors.warning.light
      border: '#92400e80', // colors.warning.border with transparency
      tailwind: 'bg-amber-900/30 text-amber-400 border border-amber-700/50',
    },
    info: {
      bg: '#1e3a8a4D', // colors.info.bg with transparency
      text: '#60a5fa', // colors.info.light
      border: '#1e40af80', // colors.info.border with transparency
      tailwind: 'bg-blue-900/30 text-blue-400 border border-blue-700/50',
    },
    green: {
      bg: '#065f464D', // colors.success.bg with transparency
      text: '#34d399', // colors.success.light
      border: '#04785780', // colors.success.border with transparency
      tailwind: 'bg-green-900/30 text-green-400 border border-green-700/50',
    },
    red: {
      bg: '#991b1b4D', // colors.error.bg with transparency
      text: '#f87171', // colors.error.light
      border: '#b91c1c80', // colors.error.border with transparency
      tailwind: 'bg-red-900/30 text-red-400 border border-red-700/50',
    },
  },
};

// Export default primary color for easy access
export const PRIMARY_COLOR = colors.primary.DEFAULT;
export const PRIMARY_BORDER = colors.border.primary;

// Helper functions to get button and badge Tailwind classes
export const getButtonClasses = (type) => colors.button[type]?.tailwind || colors.button.default.tailwind;
export const getBadgeClasses = (variant) => colors.badge[variant]?.tailwind || colors.badge.default.tailwind;

// Helper functions to get button and badge color objects (for inline styles if needed)
export const getButtonColors = (type) => colors.button[type] || colors.button.default;
export const getBadgeColors = (variant) => colors.badge[variant] || colors.badge.default;

export default colors;

