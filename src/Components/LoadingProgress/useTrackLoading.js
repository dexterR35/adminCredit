import { useEffect } from "react";
import { useLoadingProgress } from "../../context/LoadingProgressContext";

/** Shows the global top progress bar while `loading` is true. */
export const useTrackLoading = (loading) => {
  const { trackLoading } = useLoadingProgress();

  useEffect(() => {
    if (!loading) return undefined;
    return trackLoading();
  }, [loading, trackLoading]);
};

export default useTrackLoading;
