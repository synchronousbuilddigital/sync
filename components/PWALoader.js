"use client";

import dynamic from "next/dynamic";

const PWARegister = dynamic(() => import("./PWARegister"), { ssr: false });
const PullToRefresh = dynamic(() => import("./PullToRefresh"), { ssr: false });
const PWAInstallButton = dynamic(() => import("./PWAInstallButton"), { ssr: false });
const ChatBot = dynamic(() => import("./ChatBot"), { ssr: false });

export default function PWALoader() {
  return (
    <>
      <PWARegister />
      <PullToRefresh />
      <PWAInstallButton floating={true} />
      <ChatBot />
    </>
  );
}
