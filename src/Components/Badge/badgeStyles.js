import {
  BADGE_VARIANT_CLASS,
  BADGE_VARIANT_KEYS,
  LINK_BADGE_PRESETS,
  PHONE_BADGE_PRESET,
  badgeClassName,
  presenceBadgeVariant,
  resolveBadgeVariant,
  statusBadgeVariant,
  yesNoBadgeVariant,
} from "../uiCheck";

/** Compatibility helpers. New styling lives in Components/uiCheck/Badge.jsx. */

export const BADGE_VARIANTS_LIST = BADGE_VARIANT_KEYS;
export const BADGE_BASE = "badge";
export const BADGE_VARIANTS = { ...BADGE_VARIANT_CLASS };
export const BADGE_SIZES = {
  sm: "badge--sm",
  md: "",
  lg: "badge--lg",
};
export const BADGE_BUTTON = "badge--interactive";

export {
  LINK_BADGE_PRESETS,
  PHONE_BADGE_PRESET,
  badgeClassName,
  presenceBadgeVariant,
  resolveBadgeVariant,
  statusBadgeVariant,
  yesNoBadgeVariant,
};
