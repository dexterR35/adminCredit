const normalizeBasePath = (value) => {
  const raw = String(value || "").trim();
  if (!raw || raw === "/" || raw === "." || raw === "./") return "";

  const withLeadingSlash = raw.startsWith("/") ? raw : `/${raw}`;
  return withLeadingSlash.replace(/\/+$/, "");
};

export const getRouterBasename = () => {
  const configured = normalizeBasePath(import.meta.env.VITE_ROUTER_BASENAME);
  if (configured) return configured;

  const viteBase = normalizeBasePath(import.meta.env.BASE_URL);
  if (viteBase) return viteBase;

  if (
    typeof window !== "undefined" &&
    (window.location.pathname === "/admin" ||
      window.location.pathname.startsWith("/admin/"))
  ) {
    return "/admin";
  }

  return "";
};

export const stripRouterBasename = (pathname = "/") => {
  const safePathname = pathname || "/";
  const basename = getRouterBasename();

  if (!basename) return safePathname;
  if (safePathname === basename) return "/";
  if (safePathname.startsWith(`${basename}/`)) {
    return safePathname.slice(basename.length) || "/";
  }

  return safePathname;
};
