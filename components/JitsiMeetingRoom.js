"use client";
import React, { useEffect, useState } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

export default function JitsiMeetingRoom({ roomName, userInfo, onLeave }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const JAAS_APP_ID = process.env.NEXT_PUBLIC_JAAS_APP_ID;

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = localStorage.getItem("sync_token");
        const res = await fetch(`/api/meetings/token?roomName=${roomName}`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        });
        const data = await res.json();
        if (data.success && data.token) {
          setToken(data.token);
        }
      } catch (err) {
        console.error("Failed to fetch token", err);
      } finally {
        setLoading(false);
      }
    };
    fetchToken();
  }, [roomName]);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black/5 dark:bg-white/5 rounded-3xl min-h-[500px]">
        <div className="w-10 h-10 border-4 border-[#F05E23] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Connecting to secure server...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black rounded-3xl overflow-hidden min-h-[600px] border border-black/10 dark:border-white/10 shadow-2xl relative">
      
      {/* Custom App Logo Overlay */}
      <div className="absolute top-6 left-8 z-50 pointer-events-none">
         <img src="/logo.png" alt="Company Logo" className="h-8 md:h-10 object-contain drop-shadow-xl brightness-0 invert opacity-90" />
      </div>

      <JitsiMeeting
        domain={JAAS_APP_ID ? "8x8.vc" : "meet.jit.si"}
        roomName={JAAS_APP_ID ? `${JAAS_APP_ID}/${roomName}` : roomName}
        jwt={token}
        configOverwrite={{
          startWithAudioMuted: true,
          startWithVideoMuted: true,
          disableModeratorIndicator: true,
          enableEmailInStats: false
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_CHROME_EXTENSION_BANNER: false,
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false
        }}
        userInfo={{
          displayName: userInfo?.name || "Participant",
          email: userInfo?.email || ""
        }}
        onApiReady={(externalApi) => {
          externalApi.addListener('readyToClose', () => {
            if (onLeave) onLeave();
          });
          externalApi.addListener('videoConferenceLeft', () => {
            if (onLeave) onLeave();
          });
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
          iframeRef.style.width = '100%';
        }}
      />
    </div>
  );
}
