import { useEffect, useState } from "react";

/**
 * Load an entity when a URL id is present; clear when the id is removed.
 */
export const useUrlOpenedEntity = ({ id, fetchById, enabled = true }) => {
  const [entity, setEntity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || !id) {
      setEntity(null);
      setError(null);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchById(id)
      .then((row) => {
        if (!cancelled) {
          setEntity(row || null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Error loading entity from URL:", err);
          setEntity(null);
          setError(err);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, enabled, fetchById]);

  return { entity, setEntity, loading, error };
};
