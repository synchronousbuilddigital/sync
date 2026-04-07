"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interns, setInterns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [leaves, setLeaves] = useState([]); // Holiday/Leave records
  const router = useRouter();

  const fetchInterns = useCallback(async (authToken) => {
    try {
      const res = await fetch("/api/admin/interns", {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (data.success) setInterns(data.interns);
    } catch (e) {
      console.error("Failed to fetch interns", e);
    }
  }, []);

  const fetchTasks = useCallback(async (role, authToken) => {
    try {
      const endpoint = role === "admin" ? "/api/admin/tasks" : "/api/intern/tasks";
      const res = await fetch(endpoint, {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (data.success) setTasks(data.tasks);
    } catch (e) {
      console.error("Failed to fetch tasks", e);
    }
  }, []);

  const fetchLeaves = useCallback(async (authToken) => {
    try {
      const res = await fetch("/api/intern/leave", {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (data.success) setLeaves(data.leaves);
    } catch (e) {
      console.error("Failed to fetch leaves", e);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("sync_user");
    const storedToken = localStorage.getItem("sync_token");

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(storedToken);
      fetchTasks(parsedUser.role, storedToken);
      fetchLeaves(storedToken);
      if (parsedUser.role === "admin") fetchInterns(storedToken);

      // Real-time updates: Poll every 10 seconds
      const pollInterval = setInterval(() => {
        fetchTasks(parsedUser.role, storedToken);
        fetchLeaves(storedToken);
        if (parsedUser.role === "admin") fetchInterns(storedToken);
      }, 10000);

      setLoading(false);
      return () => clearInterval(pollInterval);
    }
    setLoading(false);
  }, [fetchInterns, fetchTasks, fetchLeaves]);

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
        
        if (data.user.mustChangePassword) {
          router.push("/change-password");
        } else {
          router.push(data.user.role === "admin" ? "/admin" : "/intern");
        }
        
        fetchTasks(data.user.role, data.token);
        if (data.user.role === "admin") fetchInterns(data.token);
        
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: "Login failed" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
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
      router.push(user.role === "admin" ? "/admin" : "/intern");
    }
    return data;
  };

  const addIntern = async (name, email) => {
    const res = await fetch("/api/admin/interns", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name, email })
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

  const updateTaskStatus = async (taskId, status, note = "", isApproved = undefined) => {
    const res = await fetch(`/api/intern/tasks/${taskId}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status, note, isApproved })
    });
    const data = await res.json();
    if (data.success) fetchTasks(user.role, token);
    return data;
  };

  const sendDiscussion = async (taskId, message) => {
    const res = await fetch(`/api/tasks/${taskId}/discussion`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    if (data.success) fetchTasks(user.role, token);
    return data;
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

  return (
    <AuthContext.Provider value={{ 
      user, token, loading, login, logout, changePassword,
      interns, tasks, leaves, addIntern, removeIntern, assignTask, 
      updateTaskStatus, sendDiscussion, sendInvite, 
      applyForLeave, approveLeave 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
