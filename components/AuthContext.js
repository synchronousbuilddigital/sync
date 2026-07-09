"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import NotificationToaster from "./NotificationToaster";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [globalToast, setGlobalToast] = useState({ type: "", msg: "" });

  const subscribeToPush = useCallback(async (authToken) => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) return;
    try {
      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();
      const subscription = existing || await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });
      if (subscription && authToken) {
        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${authToken}` },
          body: JSON.stringify({ subscription })
        });
      }
    } catch (e) {
      console.warn("[WebPush] Subscribe failed:", e);
    }
  }, []);

  const requestNotificationPermission = useCallback(async (authToken) => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        try {
          const perm = await Notification.requestPermission();
          if (perm === "granted" && "serviceWorker" in navigator) {
            navigator.serviceWorker.ready.then((reg) => {
              reg.showNotification("Mobile Notifications Enabled 🔔", {
                body: "You will now receive instant push alerts on your phone.",
                icon: "/logo.png",
                badge: "/logo.png",
                vibrate: [200, 100, 200]
              });
            });
            await subscribeToPush(authToken);
          }
          return perm;
        } catch (e) {
          console.warn("Notification permission error:", e);
        }
      } else if (Notification.permission === "granted") {
        // Already granted — ensure push subscription is saved
        await subscribeToPush(authToken);
      }
      return Notification.permission;
    }
    return "unsupported";
  }, [subscribeToPush]);

  const showToast = useCallback((msg, type = "success") => {
    setGlobalToast({ type, msg });
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "SHOW_NOTIFICATION",
          title: type === "error" ? "System Alert ⚠" : "Synchronous Build HQ",
          options: {
            body: msg,
            icon: "/logo.png",
            badge: "/logo.png",
            tag: "sync-notification-" + Date.now()
          }
        });
      } else {
        try {
          new Notification(type === "error" ? "System Alert ⚠" : "Synchronous Build HQ", {
            body: msg,
            icon: "/logo.png"
          });
        } catch (e) { }
      }
    }
  }, []);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [interns, setInterns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskStore, setTaskStore] = useState({ role: null, ownerId: null });
  const [companyName, setCompanyName] = useState("");
  const [leaves, setLeaves] = useState([]); // Holiday/Leave records
  const [projects, setProjects] = useState([]); // Portfolio projects
  const [productionItems, setProductionItems] = useState([]);
  const [partnerLogos, setPartnerLogos] = useState([]);
  const [productionCategories, setProductionCategories] = useState([]);
  const [productionGalleryItems, setProductionGalleryItems] = useState([]);
  const [clientProject, setClientProject] = useState(null); // High-level Brand workflow
  const [adminClientProjects, setAdminClientProjects] = useState([]); // All brands (for admin)
  const [internProjects, setInternProjects] = useState([]); // Projects assigned to intern
  const [companies, setCompanies] = useState([]); // Client companies for task assignment
  const [brandManagers, setBrandManagers] = useState([]); // Brand managers list
  const router = useRouter();

  const parseJsonResponse = async (res, fallbackMessage) => {
    const raw = await res.text();

    try {
      return JSON.parse(raw);
    } catch {
      return {
        success: false,
        message: `${fallbackMessage}${res.ok ? "" : ` (HTTP ${res.status})`}`
      };
    }
  };

  const fetchInterns = useCallback(async (authToken) => {
    try {
      const res = await fetch("/api/admin/interns", {
        headers: { "Authorization": `Bearer ${authToken}` },
        cache: "no-store"
      });
      const data = await res.json();
      if (data.success) setInterns(data.interns);
    } catch (e) {
      console.error("Failed to fetch interns", e);
    }
  }, []);

  const fetchTasks = useCallback(async (role, authToken) => {
    try {
      const endpoint = role === "admin" ? "/api/admin/tasks" : (role === "brand_manager" ? "/api/client/tasks" : "/api/intern/tasks");
      const res = await fetch(endpoint, {
        headers: { "Authorization": `Bearer ${authToken}` },
        cache: "no-store"
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.tasks)) {
        setTasks(data.tasks);
        setTaskStore({ role, ownerId: role === "brand_manager" ? "brand_manager" : role });
        if (data.companyName) setCompanyName(data.companyName);
      } else {
        // Do not wipe tasks or taskStore during background polling if we already have loaded tasks
        setTasks(prev => Array.isArray(prev) && prev.length > 0 ? prev : []);
        setTaskStore(prev => prev?.role ? prev : { role: null, ownerId: null });
        setCompanyName(prev => prev || "");
      }
    } catch (e) {
      console.error("Failed to fetch tasks", e);
      setTasks([]);
    } finally {
      setDataLoading(false);
    }
  }, []);

  const fetchLeaves = useCallback(async (authToken) => {
    try {
      const res = await fetch("/api/intern/leave", {
        headers: { "Authorization": `Bearer ${authToken}` },
        cache: "no-store"
      });
      const data = await res.json();
      if (data.success) setLeaves(data.leaves);
    } catch (e) {
      console.error("Failed to fetch leaves", e);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/projects", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setProjects(data.projects);
    } catch (e) {
      console.error("Failed to fetch projects", e);
    }
  }, []);

  const fetchProductionData = useCallback(async () => {
    try {
      const res = await fetch("/api/public/production", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setProductionItems(data.productionItems || []);
        setPartnerLogos(data.partnerLogos || []);
        setProductionCategories(data.productionCategories || []);
        setProductionGalleryItems(data.productionGalleryItems || []);
      }
    } catch (e) {
      console.error("Failed to fetch production data", e);
    }
  }, []);

  const fetchClientProject = useCallback(async (authToken) => {
    try {
      const res = await fetch("/api/client/project", {
        headers: { "Authorization": `Bearer ${authToken}` },
        cache: "no-store"
      });
      const data = await res.json();
      if (data.success) setClientProject(data.project);
    } catch (e) {
      console.error("Failed to fetch client project", e);
    }
  }, []);

  const fetchAdminClientProjects = useCallback(async (authToken) => {
    try {
      const res = await fetch("/api/admin/client-projects", {
        headers: { "Authorization": `Bearer ${authToken}` },
        cache: "no-store"
      });
      const data = await res.json();
      if (data.success) setAdminClientProjects(data.projects);
    } catch (e) {
      console.error("Failed to fetch admin client projects", e);
    }
  }, []);

  const fetchInternProjects = useCallback(async (authToken) => {
    try {
      const res = await fetch("/api/intern/projects", {
        headers: { "Authorization": `Bearer ${authToken}` },
        cache: "no-store"
      });
      const data = await res.json();
      if (data.success) setInternProjects(data.projects);
    } catch (e) {
      console.error("Failed to fetch intern projects", e);
    }
  }, []);

  const fetchCompanies = useCallback(async (authToken) => {
    try {
      const res = await fetch("/api/admin/companies", {
        headers: { "Authorization": `Bearer ${authToken}` },
        cache: "no-store"
      });
      const data = await res.json();
      if (data.success) setCompanies(data.companies);
    } catch (e) {
      console.error("Failed to fetch companies", e);
    }
  }, []);

  const fetchBrandManagers = useCallback(async (authToken) => {
    try {
      const res = await fetch("/api/admin/clients", {
        headers: { "Authorization": `Bearer ${authToken}` },
        cache: "no-store"
      });
      const data = await res.json();
      if (data.success) setBrandManagers(data.clients);
    } catch (e) {
      console.error("Failed to fetch brand managers", e);
    }
  }, []);

  const createClient = async (name, email, password, companyId) => {
    const res = await fetch("/api/admin/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name, email, password, companyId })
    });
    const data = await res.json();
    if (data.success) fetchBrandManagers(token);
    return data;
  };

  const removeBrandManager = async (id) => {
    const res = await fetch(`/api/admin/clients/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) fetchBrandManagers(token);
    return data;
  };

  const createClientProject = async (projectData) => {
    const res = await fetch("/api/admin/client-projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(projectData)
    });
    const data = await res.json();
    if (data.success) fetchAdminClientProjects(token);
    return data;
  };

  const updateClientProject = async (id, updateData) => {
    const res = await fetch(`/api/admin/client-projects/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });
    const data = await res.json();
    if (data.success) fetchAdminClientProjects(token);
    return data;
  };

  const generateRoadmap = async (id) => {
    const res = await fetch(`/api/admin/client-projects/${id}/generate-roadmap`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) fetchAdminClientProjects(token);
    return data;
  };

  const purgeClientProject = async (id) => {
    const res = await fetch(`/api/admin/client-projects/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) fetchAdminClientProjects(token);
    return data;
  };

  const sendClientMessage = async (message) => {
    const res = await fetch("/api/client/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    if (data.success) fetchClientProject(token);
    return data;
  };

  const sendClientFeed = async (feed) => {
    const res = await fetch("/api/client/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ feed })
    });
    const data = await res.json();
    if (data.success) fetchClientProject(token);
    return data;
  };

  const sendAdminFeed = async (id, feed) => {
    const res = await fetch(`/api/admin/client-projects/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ feed })
    });
    const data = await res.json();
    if (data.success) fetchAdminClientProjects(token);
    return data;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("sync_user");
    const storedToken = localStorage.getItem("sync_token");

    fetchProjects(); // Publicly fetch projects

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(storedToken);
      fetchTasks(parsedUser.role, storedToken);

      if (parsedUser.role !== "brand_manager") {
        fetchProjects();
        fetchLeaves(storedToken);
      }

      if (parsedUser.role === "admin") {
        fetchInterns(storedToken);
        fetchAdminClientProjects(storedToken);
        fetchCompanies(storedToken);
        fetchBrandManagers(storedToken);
      }
      if (parsedUser.role === "intern") {
        fetchInternProjects(storedToken);
      }
      if (parsedUser.role === "client") fetchClientProject(storedToken);

      // Real-time updates: Poll every 10 seconds
      const pollInterval = setInterval(() => {
        fetchTasks(parsedUser.role, storedToken);
        fetchLeaves(storedToken);
        fetchProjects();
        if (parsedUser.role === "admin") {
          fetchInterns(storedToken);
          fetchAdminClientProjects(storedToken);
          fetchCompanies(storedToken);
          fetchBrandManagers(storedToken);
        }
        if (parsedUser.role === "intern") {
          fetchInternProjects(storedToken);
        }
        if (parsedUser.role === "client") fetchClientProject(storedToken);
      }, 10000);

      setLoading(false);
      // Re-subscribe to web push on every page load so subscriptions stay fresh
      setTimeout(() => requestNotificationPermission(storedToken), 2000);
      return () => clearInterval(pollInterval);
    } else {
      fetchProjects(); // Publicly fetch projects if no stored session
    }
    setLoading(false);
    setDataLoading(false); // No stored session — nothing to load
  }, [fetchInterns, fetchTasks, fetchLeaves, fetchBrandManagers]);

  const login = async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("sync_user", JSON.stringify(data.user));
        localStorage.setItem("sync_token", data.token);
        setDataLoading(true); // Reset — fresh data fetch incoming after login
        setTimeout(() => requestNotificationPermission(data.token), 1500);

        if (data.user.mustChangePassword) {
          router.push("/change-password");
        } else {
          router.push(data.user.role === "admin" ? "/admin" : (data.user.role === "client" ? "/client" : (data.user.role === "brand_manager" ? "/brand" : "/intern")));
        }

        fetchTasks(data.user.role, data.token);
        if (data.user.role === "admin") {
          fetchInterns(data.token);
          fetchCompanies(data.token);
          fetchBrandManagers(data.token);
          fetchAdminClientProjects(data.token);
        }
        if (data.user.role === "intern") {
          fetchInternProjects(data.token);
          fetchLeaves(data.token);
        }
        if (data.user.role === "client") {
          fetchClientProject(data.token);
        }

        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: "Login failed" };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setInterns([]);
    setTasks([]);
    setTaskStore({ role: null, ownerId: null });
    setCompanyName("");
    setLeaves([]);
    setClientProject(null);
    setAdminClientProjects([]);
    setInternProjects([]);
    setCompanies([]);
    setBrandManagers([]);
    localStorage.removeItem("sync_user");
    localStorage.removeItem("sync_token");
    router.push("/login");
  };

  const changePassword = async (newPassword) => {
    const res = await fetch("/api/intern/change-password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ newPassword })
    });
    const data = await res.json();
    if (data.success) {
      const updatedUser = { ...user, mustChangePassword: false };
      setUser(updatedUser);
      localStorage.setItem("sync_user", JSON.stringify(updatedUser));
      router.push(updatedUser.role === "admin" ? "/admin" : (updatedUser.role === "client" ? "/client" : (updatedUser.role === "brand_manager" ? "/brand" : "/intern")));
    }
    return data;
  };

  const addIntern = async (name, email, password, department = "Tech") => {
    const res = await fetch("/api/admin/interns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name, email, password, department })
    });
    const data = await res.json();
    if (data.success) fetchInterns(token);
    return data;
  };

  const removeIntern = async (id) => {
    const res = await fetch(`/api/admin/interns/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      fetchInterns(token);
      fetchTasks("admin", token);
    }
    return data;
  };

  const assignTask = async (taskData) => {
    const res = await fetch("/api/admin/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(taskData)
    });
    const data = await res.json();
    if (data.success) fetchTasks("admin", token);
    return data;
  };

  const updateTaskStatus = async (taskId, status, note = "", isApproved = undefined, marketingData = undefined) => {
    const res = await fetch(`/api/intern/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status, note, isApproved, marketingData })
    });
    const data = await res.json();
    if (data.success) fetchTasks(user.role, token);
    return data;
  };

  const sendDiscussion = async (taskId, message) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/discussion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      if (data.success && data.task) {
        setTasks(prev => prev.map(t => {
          if (t._id === taskId) {
            return {
              ...t,
              ...data.task,
              clientProjectId: t.clientProjectId || data.task.clientProjectId,
              marketingData: { ...(t.marketingData || {}), ...(data.task.marketingData || {}) }
            };
          }
          return t;
        }));
        fetchTasks(user.role, token);
      }
      return data;
    } catch (err) {
      console.error("Failed sendDiscussion", err);
      return { success: false, message: "Transmission error" };
    }
  };

  const markChatRead = async (taskId) => {
    try {
      setTasks(prev => prev.map(t => {
        if (t._id === taskId) {
          return { ...t, hasUnreadAdminChat: false, hasUnreadInternChat: false };
        }
        return t;
      }));
      const res = await fetch(`/api/tasks/${taskId}/mark-chat-read`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.task) {
        setTasks(prev => prev.map(t => {
          if (t._id === taskId) {
            return {
              ...t,
              ...data.task,
              hasUnreadAdminChat: false,
              hasUnreadInternChat: false,
              clientProjectId: t.clientProjectId || data.task.clientProjectId,
              marketingData: { ...(t.marketingData || {}), ...(data.task.marketingData || {}) }
            };
          }
          return t;
        }));
      }
    } catch (e) {
      console.error("Failed marking chat read", e);
    }
  };

  const sendInvite = async (internData) => {
    const res = await fetch("/api/admin/send-invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(internData)
    });
    return await res.json();
  };

  const applyForLeave = async (leaveData) => {
    const res = await fetch("/api/intern/leave", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(leaveData)
    });
    const data = await res.json();
    if (data.success) fetchLeaves(token);
    return data;
  };

  const approveLeave = async (id, status, adminNote = "") => {
    const res = await fetch(`/api/admin/leave/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status, adminNote })
    });
    const data = await res.json();
    if (data.success) {
      fetchLeaves(token);
      fetchTasks("admin", token);
    }
    return data;
  };

  const deleteTask = async (taskId) => {
    const res = await fetch(`/api/admin/tasks/${taskId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) fetchTasks("admin", token);
    return data;
  };

  const reassignTask = async (taskId, internId) => {
    const res = await fetch(`/api/admin/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ internId })
    });
    const data = await res.json();
    if (data.success) fetchTasks("admin", token);
    return data;
  };

  const updateTask = async (taskId, updateData) => {
    const res = await fetch(`/api/admin/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });
    const data = await res.json();
    if (data.success) fetchTasks("admin", token);
    return data;
  };

  const addCompany = async (name) => {
    const res = await fetch("/api/admin/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ name })
    });
    const data = await res.json();
    if (data.success) fetchCompanies(token);
    return data;
  };

  const updateCompany = async (id, updateData) => {
    const res = await fetch(`/api/admin/companies/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(updateData)
    });
    const data = await res.json();
    if (data.success) fetchCompanies(token);
    return data;
  };

  const deleteCompany = async (id) => {
    const res = await fetch(`/api/admin/companies/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) fetchCompanies(token);
    return data;
  };

  const announceToAll = async (message) => {
    const res = await fetch("/api/admin/announce", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    });
    return await res.json();
  };

  const addProject = async (projectData) => {
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(projectData)
    });
    const data = await res.json();
    if (data.success) fetchProjects();
    return data;
  };

  const updateProject = async (id, projectData) => {
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(projectData)
    });
    const data = await res.json();
    if (data.success) fetchProjects();
    return data;
  };

  const deleteProject = async (id) => {
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) fetchProjects();
    return data;
  };

  const addProductionItem = async (itemData) => {
    const res = await fetch("/api/admin/production/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(itemData)
    });
    const data = await res.json();
    if (data.success) fetchProductionData();
    return data;
  };

  const updateProductionItem = async (id, itemData) => {
    const res = await fetch(`/api/admin/production/items/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(itemData)
    });
    const data = await res.json();
    if (data.success) fetchProductionData();
    return data;
  };

  const deleteProductionItem = async (id) => {
    const res = await fetch(`/api/admin/production/items/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) fetchProductionData();
    return data;
  };

  const addPartnerLogo = async (logoData) => {
    const res = await fetch("/api/admin/production/logos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(logoData)
    });
    const data = await res.json();
    if (data.success) fetchProductionData();
    return data;
  };

  const updatePartnerLogo = async (id, logoData) => {
    const res = await fetch(`/api/admin/production/logos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(logoData)
    });
    const data = await res.json();
    if (data.success) fetchProductionData();
    return data;
  };

  const deletePartnerLogo = async (id) => {
    const res = await fetch(`/api/admin/production/logos/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) fetchProductionData();
    return data;
  };

  const addProductionCategory = async (categoryData) => {
    const res = await fetch("/api/admin/production/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(categoryData)
    });
    const data = await res.json();
    if (data.success) fetchProductionData();
    return data;
  };

  const updateProductionCategory = async (id, categoryData, oldName) => {
    const res = await fetch("/api/admin/production/categories", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ id, ...categoryData, oldName })
    });
    const data = await res.json();
    if (data.success) fetchProductionData();
    return data;
  };

  const deleteProductionCategory = async (id, name) => {
    const res = await fetch("/api/admin/production/categories", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ id, name })
    });
    const data = await res.json();
    if (data.success) fetchProductionData();
    return data;
  };

  const addProductionGalleryItem = async (itemData) => {
    const res = await fetch("/api/admin/production/gallery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(itemData)
    });
    const data = await res.json();
    if (data.success) fetchProductionData();
    return data;
  };

  const updateProductionGalleryItem = async (id, itemData) => {
    const res = await fetch("/api/admin/production/gallery", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ id, ...itemData })
    });
    const data = await res.json();
    if (data.success) fetchProductionData();
    return data;
  };

  const deleteProductionGalleryItem = async (id) => {
    const res = await fetch("/api/admin/production/gallery", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ id })
    });
    const data = await res.json();
    if (data.success) fetchProductionData();
    return data;
  };

  const updateClientInfo = async (updateData) => {
    const res = await fetch("/api/client/project", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });
    const data = await res.json();
    if (data.success) fetchClientProject(token);
    return data;
  };

  const generateAIStory = async (projectId) => {
    const res = await fetch("/api/client/project/story", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ projectId })
    });
    const data = await res.json();
    if (data.success) {
      if (user.role === 'admin') fetchAdminClientProjects(token);
      else fetchClientProject(token);
    }
    return data;
  };

  const getAIBlockerSuggestion = async (taskId) => {
    const res = await fetch(`/api/intern/tasks/${taskId}/ai-resolve`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    });
    return await res.json();
  };

  const getAIInternRecommendation = async (taskTitle, taskDescription) => {
    const res = await fetch("/api/admin/tasks/ai-recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ taskTitle, taskDescription })
    });
    return await res.json();
  };

  const runAIRiskAnalysis = async (projectId) => {
    const res = await fetch("/api/admin/client-projects/risk-analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ projectId })
    });
    const data = await res.json();
    if (data.success) fetchAdminClientProjects(token);
    return data;
  };

  const getAIFeatureSuggestions = async (projectType, description) => {
    const res = await fetch("/api/client/project/suggest-features", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ projectType, description })
    });
    return await res.json();
  };

  const generateBrandIntel = async (brandData) => {
    const res = await fetch("/api/admin/client-projects/generate-intel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(brandData)
    });
    return await res.json();
  };

  const markFeedbackAsRead = async (id) => {
    const res = await fetch(`/api/admin/client-projects/${id}/feedback/mark-read`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) fetchAdminClientProjects(token);
    return data;
  };

  const brandManagerReviewTask = async (taskId, reviewStatus, remarks) => {
    const res = await fetch(`/api/client/tasks/${taskId}/review`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ brandManagerReviewStatus: reviewStatus, brandManagerRemarks: remarks })
    });
    const data = await res.json();
    if (data.success) fetchTasks("brand_manager", token);
    return data;
  };

  const refreshAdminData = useCallback(() => {
    if (token) {
      fetchInterns(token);
      fetchTasks("admin", token);
      fetchAdminClientProjects(token);
      fetchCompanies(token);
      fetchBrandManagers(token);
      fetchProjects();
      fetchProductionData();
    }
  }, [token, fetchInterns, fetchTasks, fetchAdminClientProjects, fetchCompanies, fetchBrandManagers, fetchProjects, fetchProductionData]);

  const refreshInternData = useCallback(() => {
    if (token) {
      fetchTasks("intern", token);
      fetchLeaves(token);
      fetchInternProjects(token);
    }
  }, [token, fetchTasks, fetchLeaves, fetchInternProjects]);

  const refreshBrandData = useCallback(() => {
    if (token) {
      fetchTasks("brand_manager", token);
    }
  }, [token, fetchTasks]);

  const refreshClientData = useCallback(() => {
    if (token) {
      fetchClientProject(token);
    }
  }, [token, fetchClientProject]);

  const [readNotifIds, setReadNotifIds] = useState([]);
  useEffect(() => {
    if (user) {
      const userId = user.id || user._id;
      if (!userId) return;
      try {
        const stored = JSON.parse(localStorage.getItem(`sync_read_notifs_${userId}`) || "[]");
        setReadNotifIds(stored);
      } catch (e) { }
    }
  }, [user]);

  const notifications = useMemo(() => {
    if (!user) return [];
    const list = [];
    if (user.role === "admin") {
      (tasks || []).forEach(t => {
        const memberName = t.internId?.name || t.assignedTo || 'Team Member';
        if (t.status === "Complete" || t.status === "Working" || t.status === "Review" || t.status === "Need Meeting" || t.status === "Need Credentials" || t.status === "Blocked") {
          list.push({ id: `task-${t._id}-${t.status}`, title: `${memberName} • ${t.status}`, desc: `${memberName} updated "${t.title}" to ${t.status}`, time: t.updatedAt || t.createdAt || Date.now(), type: 'task', taskId: t._id });
        }
        if (t.marketingData?.rawLink || t.marketingData?.editedLink || t.marketingData?.postedLink) {
          list.push({ id: `link-${t._id}`, title: `${memberName} • Links Updated`, desc: `${memberName} submitted asset links for "${t.title}"`, time: t.updatedAt || t.createdAt || Date.now(), type: 'link', taskId: t._id });
        }
        if ((t.discussion || []).length > 0) {
          const lastMsg = t.discussion[t.discussion.length - 1];
          if (lastMsg.sender === "intern") {
            const senderName = lastMsg.senderName || memberName;
            list.push({ id: `chat-${t._id}-${lastMsg.timestamp}`, title: `${senderName} • Mission Log`, desc: `${senderName}: "${lastMsg.content}" on "${t.title}"`, time: lastMsg.timestamp || Date.now(), type: 'chat', taskId: t._id });
          }
        }
      });
      (leaves || []).forEach(l => {
        if (l.status === "Pending") {
          list.push({ id: `leave-${l._id}`, title: "New Leave Request", desc: `${l.internName || 'Intern'} requested leave (${l.startDate} to ${l.endDate})`, time: l.createdAt || Date.now(), type: 'leave' });
        }
      });
    } else if (user.role === "intern") {
      (tasks || []).forEach(t => {
        if (t.status === "Pending") {
          list.push({ id: `assign-${t._id}`, title: "New Task Assigned", desc: `Admin HQ assigned "${t.title}"`, time: t.createdAt || Date.now(), type: 'task', taskId: t._id });
        }
        if (t.marketingData?.editorStatus) {
          list.push({ id: `editor-${t._id}-${t.marketingData.editorStatus}`, title: "Editor Status Update", desc: `Remarks on "${t.title}": ${t.marketingData.editorStatus}`, time: t.updatedAt || t.createdAt || Date.now(), type: 'task', taskId: t._id });
        }
        if ((t.discussion || []).length > 0) {
          const lastMsg = t.discussion[t.discussion.length - 1];
          if (lastMsg.sender === "admin") {
            list.push({ id: `chat-${t._id}-${lastMsg.timestamp}`, title: "Admin Reply in Mission Log", desc: `Admin HQ: "${lastMsg.content}"`, time: lastMsg.timestamp || Date.now(), type: 'chat', taskId: t._id });
          }
        }
      });
      (leaves || []).forEach(l => {
        if (l.status === "Approved" || l.status === "Rejected") {
          list.push({ id: `leave-${l._id}-${l.status}`, title: `Leave ${l.status}`, desc: `Your leave request for ${l.startDate} was ${l.status.toLowerCase()}`, time: l.updatedAt || l.createdAt || Date.now(), type: 'leave' });
        }
      });
    } else if (user.role === "brand_manager" || user.role === "client") {
      (tasks || []).forEach(t => {
        const memberName = t.internId?.name || t.assignedTo || 'Team Member';
        if (t.status === "Review" || t.status === "Complete") {
          list.push({ id: `task-${t._id}-${t.status}`, title: `${memberName} • Task ${t.status}`, desc: `${memberName} marked "${t.title}" ready for review`, time: t.updatedAt || t.createdAt || Date.now(), type: 'task', taskId: t._id });
        }
        if (t.marketingData?.rawLink || t.marketingData?.editedLink || t.marketingData?.postedLink) {
          list.push({ id: `link-${t._id}`, title: `${memberName} • Links Submitted`, desc: `${memberName} submitted asset links for "${t.title}"`, time: t.updatedAt || t.createdAt || Date.now(), type: 'link', taskId: t._id });
        }
        if ((t.discussion || []).length > 0) {
          const lastMsg = t.discussion[t.discussion.length - 1];
          if (lastMsg.sender !== user.role) {
            const senderName = lastMsg.senderName || memberName;
            list.push({ id: `chat-${t._id}-${lastMsg.timestamp}`, title: `${senderName} • Mission Log`, desc: `${senderName}: "${lastMsg.content}" on "${t.title}"`, time: lastMsg.timestamp || Date.now(), type: 'chat', taskId: t._id });
          }
        }
      });
    }
    list.sort((a, b) => new Date(b.time) - new Date(a.time));
    return list.slice(0, 20).map(n => ({ ...n, unread: !readNotifIds.includes(n.id) }));
  }, [user, tasks, leaves, readNotifIds]);

  const unreadNotifCount = useMemo(() => notifications.filter(n => n.unread).length, [notifications]);

  const markAllNotificationsRead = useCallback(() => {
    if (!user) return;
    const userId = user.id || user._id;
    if (!userId) return;
    const allIds = notifications.map(n => n.id);
    const combined = Array.from(new Set([...readNotifIds, ...allIds]));
    setReadNotifIds(combined);
    try {
      localStorage.setItem(`sync_read_notifs_${userId}`, JSON.stringify(combined));
    } catch (e) { }
  }, [user, notifications, readNotifIds]);

  return (
    <AuthContext.Provider value={{
      user, token, loading, dataLoading, login, logout, changePassword, showToast, requestNotificationPermission,
      interns, tasks, taskStore, fetchTasks, fetchInterns, fetchAdminClientProjects, fetchCompanies, fetchBrandManagers, refreshAdminData, refreshInternData, refreshBrandData, refreshClientData, companyName, leaves, projects, addIntern, removeIntern, assignTask,
      updateTaskStatus, deleteTask, updateTask, reassignTask, approveLeave,
      announceToAll, addProject, updateProject, deleteProject, fetchProductionData,
      productionItems, partnerLogos, productionCategories, productionGalleryItems, addProductionItem, updateProductionItem, deleteProductionItem, addPartnerLogo, updatePartnerLogo, deletePartnerLogo, addProductionCategory, updateProductionCategory, deleteProductionCategory, addProductionGalleryItem, updateProductionGalleryItem, deleteProductionGalleryItem,
      clientProject, adminClientProjects, internProjects, createClient, createClientProject,
      updateClientProject, purgeClientProject, sendClientMessage, sendClientFeed, sendAdminFeed, sendDiscussion, markChatRead, updateClientInfo, generateRoadmap,
      generateAIStory, getAIBlockerSuggestion, getAIInternRecommendation, runAIRiskAnalysis, getAIFeatureSuggestions,
      generateBrandIntel, markFeedbackAsRead, brandManagerReviewTask,
      companies, addCompany, updateCompany, deleteCompany,
      brandManagers, removeBrandManager,
      notifications, unreadNotifCount, markAllNotificationsRead
    }}>
      {children}
      <NotificationToaster statusMsg={globalToast} onClose={() => setGlobalToast({ type: "", msg: "" })} />
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
