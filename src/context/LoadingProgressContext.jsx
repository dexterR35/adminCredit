import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import LoadingProgressBar from "../Components/LoadingProgress/LoadingProgressBar";

const LoadingProgressContext = createContext(null);

export const LoadingProgressProvider = ({ children }) => {
  const countRef = useRef(0);
  const [active, setActive] = useState(false);

  const trackLoading = useCallback(() => {
    countRef.current += 1;
    setActive(true);

    return () => {
      countRef.current = Math.max(0, countRef.current - 1);
      if (countRef.current === 0) {
        setActive(false);
      }
    };
  }, []);

  const value = useMemo(() => ({ active, trackLoading }), [active, trackLoading]);

  return (
    <LoadingProgressContext.Provider value={value}>
      <LoadingProgressBar active={active} />
      {children}
    </LoadingProgressContext.Provider>
  );
};

LoadingProgressProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useLoadingProgress = () => {
  const context = useContext(LoadingProgressContext);
  if (!context) {
    return {
      active: false,
      trackLoading: () => () => {},
    };
  }
  return context;
};

export default LoadingProgressContext;
