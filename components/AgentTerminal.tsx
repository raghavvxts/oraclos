"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_LOGS = [
  "Initializing Oraclos Autonomous Engine...",
  "Connecting to Monad mainnet RPC...",
  "Establishing secure WebSocket to crypto liquidity pools...",
  "Engine ready. Awaiting market anomalies.",
];

const SCAN_MESSAGES = [
  "Scanning BTC/USDT order book depth...",
  "Analyzing ETH volatility index...",
  "Detecting anomaly in SHIB/USD liquidity...",
  "Calculating expected edge on SOL derivatives...",
  "No actionable edge found. Resuming scan...",
  "Cross-referencing Monad on-chain sentiment...",
  "Validating slippage tolerance...",
  "Checking mempool for front-running risks...",
];

export default function AgentTerminal() {
  const [logs, setLogs] = useState<string[]>(INITIAL_LOGS);
  const endOfLogsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prev) => {
        const nextMessage = SCAN_MESSAGES[Math.floor(Math.random() * SCAN_MESSAGES.length)];
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const newLog = `[${timestamp}] ${nextMessage}`;
        
        // Keep only last 20 logs to prevent memory leak
        const newLogs = [...prev, newLog];
        if (newLogs.length > 20) return newLogs.slice(newLogs.length - 20);
        return newLogs;
      });
    }, 4000 + Math.random() * 3000); // Random interval between 4-7 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    endOfLogsRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="flex flex-col h-full font-mono">
      <div className="flex items-center gap-2 mb-4 border-b border-white/[0.08] pb-4">
        <Terminal className="w-5 h-5 text-[#a78bfa]" />
        <h3 className="text-white font-semibold text-sm tracking-widest uppercase">Agent Terminal</h3>
        <div className="ml-auto flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">Live Action</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto text-xs space-y-2 pr-2 custom-scrollbar mask-image-bottom">
        <AnimatePresence initial={false}>
          {logs.map((log, i) => {
            const isTimestamp = log.startsWith('[');
            let timeStr = "";
            let msgStr = log;
            
            if (isTimestamp) {
              const splitIdx = log.indexOf(']') + 1;
              timeStr = log.substring(0, splitIdx);
              msgStr = log.substring(splitIdx);
            }

            return (
              <motion.div 
                key={i + log}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="leading-relaxed"
              >
                {isTimestamp ? (
                  <>
                    <span className="text-[#a1a1aa]">{timeStr}</span>
                    <span className="text-[#d4d4d8]">{msgStr}</span>
                  </>
                ) : (
                  <span className="text-[#7c3aed] font-medium">{log}</span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={endOfLogsRef} />
      </div>
    </div>
  );
}
