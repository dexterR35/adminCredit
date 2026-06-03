import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { supabase } from "../supabase/client";
import { filterRowsByPeriod } from "../utils/periodFilter";
import { debounce } from "../utils/timing";
import {
  checkAuthStatus,
  Login,
  Logout,
} from "./auth";
import {
  assignWebClientToUser,
  deleteWebClient,
  fetchUsersForAssignment,
  fetchWebClients,
  updateWebClient,
} from "./customers";
import {
  deleteContract,
  fetchContracts,
} from "./contracts";
import {
  addFisaReport,
  deleteFisaReport,
  fetchFisaReports,
} from "./fisaReports";
import { getAllUsers } from "./consultants";

export {
  checkAuthStatus,
  Login,
  Logout,
  getAllUsers,
};

export { FormatTimestamp } from "../utils/date";

const REALTIME_DEBOUNCE_MS = 400;

/** In-memory cache so dashboard/list pages don't flash empty state on remount. */
const dataCache = {
  credit_applications: null,
  contracts: null,
  fisa_reports: null,
};

const dashboardCache = {
  clients: null,
  contracts: null,
};

const useRealtimeTable = (table, enabled = true) => {
  const cached = dataCache[table];
  const [rows, setRows] = useState(() => cached ?? []);
  const [loading, setLoading] = useState(() => enabled && cached === null);
  const debouncedLoadRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setRows([]);
      setLoading(false);
      return undefined;
    }

    let active = true;

    const load = async () => {
      try {
        let data = [];
        if (table === "credit_applications") data = await fetchWebClients();
        if (table === "contracts") data = await fetchContracts();
        if (table === "fisa_reports") data = await fetchFisaReports();
        if (active) {
          setRows(data);
          dataCache[table] = data;
        }
      } catch (error) {
        console.error(`Error fetching ${table}:`, error.message);
        toast.error(`Could not load ${table.replace(/_/g, " ")}.`);
      } finally {
        if (active) setLoading(false);
      }
    };

    const scheduleLoad = () => {
      debouncedLoadRef.current?.();
    };

    debouncedLoadRef.current = debounce(load, REALTIME_DEBOUNCE_MS);

    load();

    const channel = supabase
      .channel(`${table}-changes`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => {
        scheduleLoad();
      })
      .subscribe();

    return () => {
      active = false;
      debouncedLoadRef.current?.cancel();
      supabase.removeChannel(channel);
    };
  }, [table, enabled]);

  return { rows, loading, setRows };
};

/** Dashboard overview: clients + contracts with shared realtime (no duplicate fisa fetch). */
const useDashboardOverview = () => {
  const [clients, setClients] = useState(() => dashboardCache.clients ?? []);
  const [contracts, setContracts] = useState(() => dashboardCache.contracts ?? []);
  const [loading, setLoading] = useState(
    () => dashboardCache.clients === null || dashboardCache.contracts === null
  );
  const debouncedLoadRef = useRef(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [clientRows, contractRows] = await Promise.all([
          fetchWebClients(),
          fetchContracts(),
        ]);
        if (active) {
          setClients(clientRows);
          setContracts(contractRows);
          dashboardCache.clients = clientRows;
          dashboardCache.contracts = contractRows;
        }
      } catch (error) {
        console.error("Error fetching dashboard overview:", error.message);
        toast.error("Could not load dashboard overview.");
      } finally {
        if (active) setLoading(false);
      }
    };

    const scheduleLoad = () => {
      debouncedLoadRef.current?.();
    };

    debouncedLoadRef.current = debounce(load, REALTIME_DEBOUNCE_MS);

    load();

    const clientsChannel = supabase
      .channel("dashboard-credit_applications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "credit_applications" },
        scheduleLoad
      )
      .subscribe();

    const contractsChannel = supabase
      .channel("dashboard-contracts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contracts" },
        scheduleLoad
      )
      .subscribe();

    return () => {
      active = false;
      debouncedLoadRef.current?.cancel();
      supabase.removeChannel(clientsChannel);
      supabase.removeChannel(contractsChannel);
    };
  }, []);

  return { clients, contracts, loading };
};

/** Single home-page data source: one fisa realtime stream + overview stats. */
export const useHomePageData = (period = "all") => {
  const { rows: raports, loading: fisaLoading } = useRealtimeTable("fisa_reports");
  const { clients, contracts, loading: overviewLoading } = useDashboardOverview();

  const filteredRaports = useMemo(
    () => filterRowsByPeriod(raports, period),
    [raports, period]
  );

  const filteredClients = useMemo(
    () => filterRowsByPeriod(clients, period, "submitted_at"),
    [clients, period]
  );

  const filteredContracts = useMemo(
    () => filterRowsByPeriod(contracts, period),
    [contracts, period]
  );

  const onDeleteReport = useCallback(async (id) => {
    try {
      await deleteFisaReport(id);
      toast.success("Report deleted!");
    } catch (error) {
      toast.error(error.message || "Could not delete report.");
      throw error;
    }
  }, []);

  const firstContract = filteredContracts[0];

  return {
    loading: fisaLoading || overviewLoading,
    raports: filteredRaports,
    fisaLoading,
    onDeleteReport,
    totalCustomers: filteredClients.length,
    lastCustomerName: filteredClients[0]?.full_name || null,
    contractsLength: filteredContracts.length,
    lastContractName: firstContract
      ? `${firstContract.first_name || ""} ${firstContract.last_name || ""}`.trim()
      : null,
    fisaTotal: filteredRaports.length,
    lastReportName: filteredRaports[0]?.client_full_name || null,
  };
};

export const FetchCustomersData = () => {
  const { rows: customerData, loading } = useRealtimeTable("credit_applications");

  const updateCustomer = async (id, data) => {
    try {
      await updateWebClient(id, data);
      toast.success("Customer updated!");
    } catch (error) {
      toast.error(error.message || "Could not update customer.");
      throw error;
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await deleteWebClient(id);
      toast.success("Customer deleted!");
    } catch (error) {
      toast.error(error.message || "Could not delete customer.");
      throw error;
    }
  };

  return { customerData, loading, updateCustomer, deleteCustomer };
};

export const FetchContractData = () => {
  const { rows: contracts, loading } = useRealtimeTable("contracts");

  const onDelete = async (id) => {
    try {
      await deleteContract(id);
      toast.success("Contract deleted!");
    } catch (error) {
      toast.error(error.message || "Could not delete contract.");
      throw error;
    }
  };

  return { contracts, loading, onDelete };
};

export const addRaport = async (formData, { isAdmin = false } = {}) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw userError || new Error("Not authenticated");

  try {
    const id = await addFisaReport(formData, user.id, { isAdmin });
    toast.success("Client record saved successfully!");
    return id;
  } catch (error) {
    toast.error(error.message || "Could not save client record.");
    throw error;
  }
};

export const useFetchRaportNew = () => {
  const { rows: raports, loading } = useRealtimeTable("fisa_reports");

  const onDelete = async (id) => {
    try {
      await deleteFisaReport(id);
      toast.success("Report deleted!");
    } catch (error) {
      toast.error(error.message || "Could not delete report.");
      throw error;
    }
  };

  return { raports, loading, onDelete };
};

export const useAssignClient = () => {
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const loadAssignableUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const data = await fetchUsersForAssignment();
      setAssignableUsers(data);
    } catch (error) {
      toast.error(error.message || "Could not load users.");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const assignClient = async (clientId, userId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await assignWebClientToUser(clientId, userId, user?.id);
      toast.success("Client assigned successfully!");
    } catch (error) {
      toast.error(error.message || "Could not assign client.");
      throw error;
    }
  };

  return {
    assignableUsers,
    loadingUsers,
    loadAssignableUsers,
    assignClient,
    /** @deprecated use assignableUsers */
    consultants: assignableUsers,
    /** @deprecated use loadAssignableUsers */
    loadConsultants: loadAssignableUsers,
    /** @deprecated use loadingUsers */
    loadingConsultants: loadingUsers,
  };
};

export const useAuthUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => checkAuthStatus(setUser, setLoading), []);

  return { user, loading, isAdmin: user?.isAdmin === true };
};
