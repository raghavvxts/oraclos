"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useReadContract } from "wagmi";
import { oraclePolicyAbi } from "@/lib/abi/OraclePolicy";
import { TradeProposal, validateProposalAgainstPolicy, ValidationResult } from "@/lib/validation/validatePolicy";
import { PolicyValidator } from "./validation/PolicyValidator";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowUp } from "lucide-react";

const POLICY_ADDRESS = process.env.NEXT_PUBLIC_ORACLE_POLICY_ADDRESS as `0x${string}`;

export function ChatPanel() {
  const { address } = useAccount();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [proposal, setProposal] = useState<TradeProposal | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  // Read policy from Monad
  const { data: policyData } = useReadContract({
    address: POLICY_ADDRESS,
    abi: oraclePolicyAbi,
    functionName: "getPolicy",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const handleSend = async () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput("");
    setIsLoading(true);
    setProposal(null);
    setValidationResult(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input })
      });
      
      const data: TradeProposal = await res.json();
      setProposal(data);
      setMessages(prev => [...prev, { role: 'assistant', content: `I analyzed the markets and found a high-edge opportunity: ${data.marketName}.` }]);

      // Validate the proposal
      if (policyData) {
        let maxTradeAmount = 0;
        let minConfidence = 0;
        let minEdge = 0;
        let autoExecute = false;

        if (typeof policyData === 'object' && 'maxTradeAmount' in policyData) {
          const p = policyData as any;
          maxTradeAmount = Number(p.maxTradeAmount);
          minConfidence = Number(p.minConfidence);
          minEdge = Number(p.minEdge);
          autoExecute = p.autoExecute;
        } else if (Array.isArray(policyData)) {
          maxTradeAmount = Number(policyData[0]);
          minConfidence = Number(policyData[1]);
          minEdge = Number(policyData[2]);
          autoExecute = policyData[3];
        }

        const monadPolicy = { maxTradeAmount, minConfidence, minEdge, autoExecute };
        const result = validateProposalAgainstPolicy(data, monadPolicy);
        setValidationResult(result);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error fetching proposal." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden border-0 p-8">
      {/* Scrollable Message Area */}
      <div className="flex-1 overflow-y-auto space-y-8 pr-4 z-10 pb-10 scroll-smooth">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-zinc-400"
            >
              <div className="mb-6 flex justify-center">
                <img 
                  src="/logo.jpg" 
                  alt="Oracle Logo" 
                  className="w-20 h-20 rounded-2xl object-cover shadow-[0_0_30px_rgba(59,130,246,0.2)] border border-white/10" 
                />
              </div>
              <p className="text-xl font-medium text-white/90">Ask Oraclos</p>
              <p className="text-sm mt-2 text-zinc-500">e.g. "Find me a high edge crypto market"</p>
            </motion.div>
          ) : (
            messages.map((msg, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-[24px] px-6 py-4 shadow-sm text-[15px] leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-r from-[#7c3aed] to-[#4c1d95] text-white border border-[#a78bfa]/40 shadow-[0_4px_20px_rgba(124,58,237,0.15)] font-medium' 
                    : 'bg-black/40 border border-[#e5e4e2]/10 text-[#e5e4e2]'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-black/40 border border-[#e5e4e2]/10 text-[#a1a1aa] rounded-[24px] px-6 py-5 flex items-center gap-2">
              <div className="w-2 h-2 bg-[#7c3aed]/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-[#7c3aed]/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-[#7c3aed]/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {proposal && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.1 }}
              className="mt-6"
            >
              <div className="bg-black/60 border border-[#7c3aed]/20 rounded-[24px] p-8 space-y-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-3xl relative overflow-hidden">
                {/* Subtle purple glow behind the proposal */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#7c3aed]/10 rounded-full blur-3xl" />
                
                <h4 className="font-semibold text-white flex items-center gap-2 text-lg tracking-tight relative z-10">
                  <Sparkles className="w-5 h-5 text-[#a78bfa]" /> Mathematical Proposal
                </h4>
                
                <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-sm relative z-10">
                  <div>
                    <span className="text-[#a1a1aa] block mb-1.5 text-xs font-semibold tracking-wider uppercase">Market</span>
                    <span className="text-[#ffffff] font-medium text-base">{proposal.marketName}</span>
                  </div>
                  <div>
                    <span className="text-[#a1a1aa] block mb-1.5 text-xs font-semibold tracking-wider uppercase">Direction</span>
                    <span className={proposal.side === "YES" ? "text-emerald-400 font-semibold text-base" : "text-rose-400 font-semibold text-base"}>
                      {proposal.side}
                    </span>
                  </div>
                  
                  <div className="bg-black/40 p-4 rounded-2xl border border-white/[0.05]">
                    <span className="text-[#a1a1aa] block mb-1.5 text-xs font-semibold tracking-wider uppercase">AI Confidence</span>
                    <span className="text-[#a78bfa] font-medium text-2xl tracking-tight">{proposal.confidence}%</span>
                  </div>
                  
                  <div className="bg-black/40 p-4 rounded-2xl border border-white/[0.05]">
                    <span className="text-[#a1a1aa] block mb-1.5 text-xs font-semibold tracking-wider uppercase">Calculated Edge</span>
                    <span className="text-[#ffffff] font-medium text-2xl tracking-tight">+{proposal.edge}%</span>
                  </div>

                  <div className="col-span-2">
                    <span className="text-[#a1a1aa] block mb-1.5 text-xs font-semibold tracking-wider uppercase">Suggested Size</span>
                    <span className="text-white text-xl font-medium">${proposal.suggestedAmount}</span>
                  </div>
                  
                  <div className="col-span-2 mt-2">
                    <span className="text-[#a1a1aa] block mb-2 text-xs font-semibold tracking-wider uppercase">Reasoning</span>
                    <span className="text-[#e4e4e7] text-[15px] leading-relaxed block bg-black/40 p-4 rounded-2xl border border-white/[0.05]">
                      {proposal.reasoning}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Validation Engine */}
              {validationResult ? (
                <div className="mt-6">
                  <PolicyValidator result={validationResult} />
                </div>
              ) : (
                <p className="text-xs text-rose-400 mt-4 text-center">No Monad policy found. Please save a policy first.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="mt-4 z-10 pt-4 relative bg-transparent">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything..." 
            className="w-full bg-black/60 border border-white/[0.1] rounded-[24px] pl-6 pr-14 py-4 text-[15px] text-[#ffffff] placeholder:text-[#a1a1aa] focus:outline-none focus:bg-black/80 focus:border-[#7c3aed]/50 transition-all shadow-inner backdrop-blur-xl"
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="absolute right-2">
            <Button 
              onClick={handleSend} 
              disabled={isLoading || !input.trim()}
              size="icon"
              className="h-10 w-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#4c1d95] text-white hover:from-[#8b5cf6] hover:to-[#5b21b6] disabled:bg-white/10 disabled:text-white/30 shadow-[0_2px_10px_rgba(124,58,237,0.3)]"
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
