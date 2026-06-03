import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getConsultantByUserName } from '../../services/Hooks';
import { useTrackLoading } from '../../Components/LoadingProgress';

const ConsultantPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get('username');
  const [consultant, setConsultant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) {
      setConsultant(null);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    const fetchConsultant = async () => {
      setLoading(true);
      try {
        const consultantData = await getConsultantByUserName(username);
        if (!cancelled) setConsultant(consultantData);
      } catch (error) {
        console.error("Error fetching consultant:", error);
        if (!cancelled) {
          setConsultant(null);
          toast.error(error.message || "Could not load consultant.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchConsultant();

    return () => {
      cancelled = true;
    };
  }, [username]);

  useTrackLoading(loading);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="dash-page-header">
          <div>
            <h1 className="dash-page-title">Consultant Profile</h1>
            <p className="dash-page-subtitle">View consultant details and information</p>
          </div>
        </div>
        <div className="dash-card min-h-[220px]" aria-busy="true" aria-label="Loading consultant" />
      </div>
    );
  }

  if (!consultant) {
    return (
      <div className="dash-card text-center">
        <p className="text-gray-600">Consultant not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Consultant Profile</h1>
          <p className="dash-page-subtitle">View consultant details and information</p>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-card-header">
          <div>
            <h2 className="text-lg font-display font-semibold capitalize text-gray-900">
              {consultant.username}
            </h2>
            <p className="text-sm text-gray-500">Consultant account</p>
          </div>
          <span className="inline-flex rounded-lg border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
            Active
          </span>
        </div>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">Email</dt>
            <dd className="mt-1 text-sm font-medium text-gray-900">{consultant.email}</dd>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">Username</dt>
            <dd className="mt-1 text-sm font-medium capitalize text-gray-900">{consultant.username}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ConsultantPage;
