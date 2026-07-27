"use client";
import React, { useState, useEffect } from "react";
import { Video, Calendar, Clock, Users, Video as VideoIcon, Copy } from "lucide-react";
import { useAuth } from "./AuthContext";
import JitsiMeetingRoom from "./JitsiMeetingRoom";

export default function ParticipantMeetings({ apiEndpoint }) {
  const { token, user, showToast } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMeeting, setActiveMeeting] = useState(null);

  useEffect(() => {
    fetchMeetings();
  }, [token]);

  const fetchMeetings = async () => {
    try {
      const res = await fetch(apiEndpoint, {
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
          <button 
            onClick={() => setActiveMeeting(null)}
            className="px-6 py-2 rounded-xl bg-red-500/20 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
          >
            Leave Room
          </button>
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
      <div className="flex justify-between items-center mb-2 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Meetings HQ</h2>
          <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest mt-1">Join Your Scheduled Live Video Sessions</p>
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
          <p className="text-[10px] font-bold text-slate-500 dark:text-white/40 max-w-md mx-auto uppercase tracking-wider">You don't have any upcoming meetings. When Admin schedules one, it will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <div key={meeting._id} className="bg-white dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-[2rem] p-6 sm:p-8 relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#F05E23]/10 transition-all duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#F05E23]/10 via-[#F05E23]/5 to-transparent rounded-bl-[100px] -z-0 opacity-70 group-hover:scale-110 transition-transform duration-500"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-5">
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-[#F05E23]/20 to-[#F05E23]/5 text-[#F05E23] rounded-2xl shadow-inner border border-[#F05E23]/10">
                    <VideoIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-4 py-1.5 bg-green-500/10 text-green-500 rounded-full border border-green-500/20 shadow-sm">
                    {meeting.status}
                  </span>
                </div>
                
                <h3 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-2 leading-tight">{meeting.title}</h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-white/40 line-clamp-2 mb-6 font-bold leading-relaxed">{meeting.description || "No description provided."}</p>
                
                <div className="mt-auto space-y-4 pt-5 border-t border-black/5 dark:border-white/5">
                  <div className="flex flex-wrap gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40">
                    <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/5">
                      <Calendar className="w-3.5 h-3.5 text-[#F05E23]" />
                      {new Date(meeting.scheduledAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/5">
                      <Clock className="w-3.5 h-3.5 text-[#F05E23]" />
                      {new Date(meeting.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mt-2">
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30 bg-slate-50 dark:bg-black/20 px-4 py-2 rounded-xl border border-black/5 dark:border-white/5">
                      <Users className="w-3.5 h-3.5 text-[#F05E23]" />
                      Hosted by <span className="text-slate-700 dark:text-white font-black">{meeting.hostId?.name?.split(' ')[0] || "Admin"}</span>
                    </div>
                    <button 
                      onClick={() => setActiveMeeting(meeting)}
                      className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#F05E23] to-[#ff7e47] text-white rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[#F05E23]/30 flex justify-center items-center gap-2"
                    >
                      <VideoIcon className="w-4 h-4" /> Join Room
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
