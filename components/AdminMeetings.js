"use client";
import React, { useState, useEffect } from "react";
import { Video, Plus, X, Users, Calendar, Clock, Video as VideoIcon, CheckCircle2, Zap, Trash2, Copy } from "lucide-react";
import { useAuth } from "./AuthContext";
import JitsiMeetingRoom from "./JitsiMeetingRoom";

export default function AdminMeetings() {
  const { token, user, interns, brandManagers, showToast } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Active meeting state
  const [activeMeeting, setActiveMeeting] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMeetings();
  }, [token]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const fetchMeetings = async () => {
    try {
      const res = await fetch("/api/admin/meetings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMeetings(data.meetings);
      }
    } catch (err) {
      console.error("Failed to fetch meetings:", err);
    } finally {
      setLoading(false);
    }
  };

  const allAvailableUsers = [
    ...(interns || []).map(i => ({ ...i, roleLabel: "Intern" })),
    ...(brandManagers || []).map(b => ({ ...b, roleLabel: "Brand Manager" }))
  ];

  const handleSelectAll = () => {
    if (selectedParticipants.length === allAvailableUsers.length) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants(allAvailableUsers.map(u => u._id));
    }
  };

  const toggleParticipant = (id) => {
    if (selectedParticipants.includes(id)) {
      setSelectedParticipants(selectedParticipants.filter(p => p !== id));
    } else {
      setSelectedParticipants([...selectedParticipants, id]);
    }
  };

  const handleInstantMeetingSetup = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    
    setTitle(`Instant Sync - ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`);
    setScheduledDate(`${yyyy}-${mm}-${dd}`);
    setScheduledTime(`${hh}:${min}`);
    setDescription("Instant Meeting started by Admin.");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedParticipants.length === 0) {
      showToast("error", "Select at least one participant");
      return;
    }

    setSubmitting(true);
    const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);

    try {
      const res = await fetch("/api/admin/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          scheduledAt: scheduledAt.toISOString(),
          participants: selectedParticipants
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast("success", "Meeting scheduled successfully");
        setMeetings([data.meeting, ...meetings]);
        setIsModalOpen(false);
        setTitle("");
        setDescription("");
        setScheduledDate("");
        setScheduledTime("");
        setSelectedParticipants([]);
      } else {
        showToast("error", data.message || "Failed to schedule meeting");
      }
    } catch (err) {
      showToast("error", "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    if (!confirm("Are you sure you want to delete this meeting?")) return;
    try {
      const res = await fetch(`/api/admin/meetings?meetingId=${meetingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setMeetings(meetings.filter(m => m._id !== meetingId));
        showToast("success", "Meeting deleted successfully");
      } else {
        showToast("error", data.message || "Failed to delete meeting");
      }
    } catch (err) {
      showToast("error", "An error occurred");
    }
  };

  const handleEndMeeting = async () => {
    try {
      const res = await fetch("/api/admin/meetings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          meetingId: activeMeeting._id,
          status: "Completed"
        })
      });

      const data = await res.json();
      if (data.success) {
        setMeetings(meetings.map(m => m._id === data.meeting._id ? data.meeting : m));
        setActiveMeeting(null);
        showToast("success", "Meeting ended for everyone");
      } else {
        showToast("error", data.message || "Failed to end meeting");
      }
    } catch (err) {
      showToast("error", "An error occurred");
    }
  };

  if (activeMeeting) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        <div className="flex justify-between items-center p-4 bg-black border-b border-white/10 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F05E23]/20 flex items-center justify-center text-[#F05E23]">
              <VideoIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black tracking-widest uppercase text-sm">{activeMeeting.title}</h2>
              <p className="text-[10px] text-white/50 tracking-wider">Jitsi 8x8 Premium Room</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveMeeting(null)}
              className="px-6 py-2 rounded-xl bg-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all"
            >
              Leave Room
            </button>
            <button 
              onClick={handleEndMeeting}
              className="px-6 py-2 rounded-xl bg-red-500/20 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              End Meeting For All
            </button>
          </div>
        </div>
        <div className="flex-1">
          <JitsiMeetingRoom 
            roomName={activeMeeting.roomName} 
            userInfo={user} 
            onLeave={() => setActiveMeeting(null)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Meetings HQ</h2>
          <p className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest mt-1">Schedule & Join Live 8x8 Video Sessions</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button 
            onClick={handleInstantMeetingSetup}
            className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black px-4 sm:px-5 py-3 rounded-xl font-black uppercase tracking-widest text-[9px] sm:text-[10px] hover:shadow-lg transition-all active:scale-95"
          >
            <Zap className="w-3 sm:w-4 h-3 sm:h-4 text-amber-500" /> Instant Meeting
          </button>
          <button 
            onClick={() => {
               setTitle("");
               setDescription("");
               setScheduledDate("");
               setScheduledTime("");
               setSelectedParticipants([]);
               setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#F05E23] text-white px-4 sm:px-5 py-3 rounded-xl font-black uppercase tracking-widest text-[9px] sm:text-[10px] hover:shadow-lg hover:shadow-[#F05E23]/30 transition-all active:scale-95"
          >
            <Plus className="w-3 sm:w-4 h-3 sm:h-4" /> Schedule
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-[#F05E23] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : meetings.length === 0 ? (
        <div className="bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-10 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-slate-200 dark:bg-white/10 rounded-full flex items-center justify-center text-slate-400 dark:text-white/30 mb-6">
            <Video className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white mb-2">No Meetings Scheduled</h3>
          <p className="text-[10px] font-bold text-slate-500 dark:text-white/40 max-w-md mx-auto uppercase tracking-wider">You don't have any upcoming or past meetings. Schedule one to collaborate with your team in real-time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <div key={meeting._id} className="bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:shadow-2xl transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#F05E23]/10 to-transparent rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-[#F05E23]/10 text-[#F05E23] rounded-2xl">
                    <VideoIcon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-green-500/10 text-green-500 rounded-lg border border-green-500/20">
                      {meeting.status}
                    </span>
                    <button 
                      onClick={() => handleDeleteMeeting(meeting._id)}
                      className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg border border-red-500/20 transition-all cursor-pointer"
                      title="Delete Meeting"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-wider mb-2">{meeting.title}</h3>
                <p className="text-[10px] text-slate-500 dark:text-white/50 line-clamp-2 mb-4 font-bold">{meeting.description || "No description provided."}</p>
                
                <div className="mt-auto space-y-3 pt-4 border-t border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40">
                    <Calendar className="w-3.5 h-3.5 text-[#F05E23]" />
                    {new Date(meeting.scheduledAt).toLocaleDateString()}
                    <span className="px-1 text-black/20 dark:text-white/20">•</span>
                    <Clock className="w-3.5 h-3.5 text-[#F05E23]" />
                    {new Date(meeting.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40">
                      <Users className="w-3.5 h-3.5" />
                      {meeting.participants?.length || 0} Invited
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const appId = process.env.NEXT_PUBLIC_JAAS_APP_ID;
                          const link = appId 
                            ? `https://8x8.vc/${appId}/${meeting.roomName}`
                            : `https://meet.jit.si/${meeting.roomName}`;
                          navigator.clipboard.writeText(link);
                          showToast("Meeting link copied!");
                        }}
                        className="p-2.5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/50 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-white transition-all shadow-sm"
                        title="Copy Meeting Link"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setActiveMeeting(meeting)}
                        className="px-5 py-2.5 bg-[#F05E23] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-md shadow-[#F05E23]/20"
                      >
                        Join Room
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111] border border-black/10 dark:border-white/10 rounded-[2rem] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
            <div className="flex justify-between items-center p-6 sm:p-8 border-b border-black/5 dark:border-white/5 bg-slate-50 dark:bg-white/5">
              <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Schedule Meeting</h3>
                <p className="text-[10px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-widest mt-1">Setup a secure Jitsi 8x8 Video Session</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-black/5 dark:bg-white/10 rounded-full flex items-center justify-center text-slate-500 dark:text-white/50 hover:bg-[#F05E23] hover:text-white transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[9px] font-black uppercase text-[#F05E23] pl-1 tracking-widest">Meeting Title</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 outline-none font-bold text-sm text-slate-800 dark:text-white" placeholder="E.g. Weekly Sync with Marketing Team" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-[#F05E23] pl-1 tracking-widest">Date</label>
                  <input type="date" required value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 outline-none font-bold text-sm text-slate-800 dark:text-white" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-[#F05E23] pl-1 tracking-widest">Time</label>
                  <input type="time" required value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 outline-none font-bold text-sm text-slate-800 dark:text-white" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[9px] font-black uppercase text-[#F05E23] pl-1 tracking-widest">Description (Optional)</label>
                  <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 outline-none font-bold text-sm text-slate-800 dark:text-white" placeholder="Agenda or topics to discuss..." />
                </div>

                <div className="space-y-4 md:col-span-2 pt-4 border-t border-black/5 dark:border-white/5">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-black uppercase text-[#F05E23] pl-1 tracking-widest">Select Participants</label>
                    <button type="button" onClick={handleSelectAll} className="text-[9px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-lg hover:bg-blue-500 hover:text-white transition-all">
                      {selectedParticipants.length === allAvailableUsers.length ? "Deselect All" : "Select All"}
                    </button>
                  </div>
                  
                  <div className="space-y-6 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                    
                    {/* Brand Managers Section */}
                    {brandManagers && brandManagers.length > 0 && (
                      <div>
                        <h4 className="text-[9px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest mb-3 pl-1">Brand Managers</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {brandManagers.map(user => {
                            const isSelected = selectedParticipants.includes(user._id);
                            return (
                              <div 
                                key={user._id} 
                                onClick={() => toggleParticipant(user._id)}
                                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-blue-500/10 border-blue-500/30 shadow-md shadow-blue-500/5' : 'bg-slate-50 dark:bg-white/5 border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20'}`}
                              >
                                <div>
                                  <p className={`text-xs font-black uppercase tracking-wider ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-white'}`}>{user.name}</p>
                                </div>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Interns Section */}
                    {interns && interns.length > 0 && (
                      <div>
                        <h4 className="text-[9px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest mb-3 pl-1">Interns</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {interns.map(user => {
                            const isSelected = selectedParticipants.includes(user._id);
                            return (
                              <div 
                                key={user._id} 
                                onClick={() => toggleParticipant(user._id)}
                                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-blue-500/10 border-blue-500/30 shadow-md shadow-blue-500/5' : 'bg-slate-50 dark:bg-white/5 border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20'}`}
                              >
                                <div>
                                  <p className={`text-xs font-black uppercase tracking-wider ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-white'}`}>{user.name}</p>
                                </div>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {allAvailableUsers.length === 0 && (
                      <div className="p-4 text-center text-xs font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest">
                        No team members available.
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full mt-6 bg-gradient-to-r from-[#F05E23] to-[#ff7e47] text-white py-4 sm:py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-[#F05E23]/20"
              >
                {submitting ? "Scheduling..." : "Schedule Meeting"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
