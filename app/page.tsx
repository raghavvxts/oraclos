"use client";

import { motion } from "framer-motion";
import { PolicyPanel } from "@/components/PolicyPanel";
import { ChatPanel } from "@/components/ChatPanel";
import { ConnectWallet } from "@/components/ConnectWallet";
import AgentTerminal from "@/components/AgentTerminal";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-[100dvh] w-full flex flex-col p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto overflow-hidden">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between w-full mb-6 shrink-0"
      >
        <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full border border-white/[0.05] shadow-lg">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/[0.1] shadow-inner">
            <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
          </div>
          <span className="font-black text-xl tracking-tight text-white">
            Oraclos
          </span>
        </div>
        <ConnectWallet />
      </motion.header>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex-1 glass-panel rounded-[2rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl shadow-blue-900/20 border border-white/10 min-h-0"
      >
        {/* Left Sidebar: Guardrails and Terminal */}
        <div className="w-full lg:w-[420px] border-b lg:border-b-0 lg:border-r border-white/5 bg-black/20 flex flex-col overflow-hidden shrink-0">
          <div className="flex-1 overflow-y-auto p-8 border-b border-white/5">
            <PolicyPanel />
          </div>
          <div className="h-64 shrink-0 p-4">
            <AgentTerminal />
          </div>
        </div>
        
        {/* Right Main Stage: Chat */}
        <div className="flex-1 p-0 flex flex-col relative bg-transparent min-w-0 overflow-hidden">
          <ChatPanel />
        </div>
      </motion.div>
    </div>
  );
}
