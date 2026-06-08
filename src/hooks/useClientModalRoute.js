import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { CLIENT_MODAL_PARAMS } from "../utils/clientModalRoute";

/**
 * Read/write client modal IDs in the URL (back button, refresh, shareable links).
 */
export const useClientModalRoute = ({
  webClientParam = CLIENT_MODAL_PARAMS.WEB_CLIENT,
  fisaParam = CLIENT_MODAL_PARAMS.FISA,
  includeFisa = true,
  includeWebClient = true,
} = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const webClientId = includeWebClient ? searchParams.get(webClientParam) : null;
  const fisaReportId = includeFisa ? searchParams.get(fisaParam) : null;

  const updateParams = useCallback((mutator, replace = false) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      mutator(next);
      return next;
    }, { replace });
  }, [setSearchParams]);

  const openWebClient = useCallback((id, { tab, replace = false } = {}) => {
    if (!id) return;

    updateParams((next) => {
      if (tab) {
        next.set(CLIENT_MODAL_PARAMS.TAB, tab);
      }
      next.set(webClientParam, id);
      next.delete(CLIENT_MODAL_PARAMS.FISA);
      if (webClientParam !== CLIENT_MODAL_PARAMS.WEB_CLIENT) {
        next.delete(CLIENT_MODAL_PARAMS.WEB_CLIENT);
      }
      if (webClientParam !== CLIENT_MODAL_PARAMS.CUSTOMERS_CLIENT) {
        next.delete(CLIENT_MODAL_PARAMS.CUSTOMERS_CLIENT);
      }
    }, replace);
  }, [updateParams, webClientParam]);

  const openFisaReport = useCallback((id, { tab, replace = false } = {}) => {
    if (!id) return;

    updateParams((next) => {
      if (tab === "reminders") {
        next.set(CLIENT_MODAL_PARAMS.TAB, "reminders");
      } else if (tab === "records") {
        next.delete(CLIENT_MODAL_PARAMS.TAB);
      }
      next.set(fisaParam, id);
      next.delete(CLIENT_MODAL_PARAMS.WEB_CLIENT);
      next.delete(CLIENT_MODAL_PARAMS.CUSTOMERS_CLIENT);
    }, replace);
  }, [updateParams, fisaParam]);

  const closeClientModals = useCallback((replace = true) => {
    updateParams((next) => {
      next.delete(CLIENT_MODAL_PARAMS.WEB_CLIENT);
      next.delete(CLIENT_MODAL_PARAMS.FISA);
      next.delete(CLIENT_MODAL_PARAMS.CUSTOMERS_CLIENT);
    }, replace);
  }, [updateParams]);

  return {
    webClientId,
    fisaReportId,
    openWebClient,
    openFisaReport,
    closeClientModals,
    searchParams,
  };
};
