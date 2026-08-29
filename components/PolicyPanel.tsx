"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { oraclePolicyAbi } from "@/lib/abi/OraclePolicy";
import { ShieldCheck } from "lucide-react";

const POLICY_ADDRESS = process.env.NEXT_PUBLIC_ORACLE_POLICY_ADDRESS as `0x${string}`;

export function PolicyPanel() {
  const { address, isConnected } = useAccount();
  const [maxTrade, setMaxTrade] = useState("20");
  const [minConfidence, setMinConfidence] = useState("85");
  const [minEdge, setMinEdge] = useState("10");
  const [autoExecute, setAutoExecute] = useState(true);

  // Read the policy from Monad
  const { data: policyData, refetch } = useReadContract({
    address: POLICY_ADDRESS,
    abi: oraclePolicyAbi,
    functionName: "getPolicy",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Hydrate UI when policy loads
  useEffect(() => {
    if (policyData && typeof policyData === 'object' && 'maxTradeAmount' in policyData) {
      const p = policyData as any;
      if (p.maxTradeAmount > 0n) {
        setMaxTrade(p.maxTradeAmount.toString());
        setMinConfidence(p.minConfidence.toString());
        setMinEdge(p.minEdge.toString());
        setAutoExecute(p.autoExecute);
      }
    } else if (Array.isArray(policyData)) {
      const arr = policyData as any[];
      if (arr.length > 0 && arr[0] > 0n) {
        setMaxTrade(arr[0].toString());
        setMinConfidence(arr[1].toString());
        setMinEdge(arr[2].toString());
        setAutoExecute(arr[3]);
      }
    }
  }, [policyData]);

  // Write policy to Monad
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleSave = () => {
    if (!address) return;
    writeContract({
      address: POLICY_ADDRESS,
      abi: oraclePolicyAbi,
      functionName: "setPolicy",
      args: [BigInt(maxTrade), BigInt(minConfidence), BigInt(minEdge), autoExecute],
    });
  };

  useEffect(() => {
    if (isSuccess) refetch();
  }, [isSuccess, refetch]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="flex flex-col h-full text-zinc-100">
      <div className="mb-10">
        <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
          <ShieldCheck className="w-6 h-6 text-[#7c3aed]" />
          Guardrails
        </h2>
        <p className="text-[#a1a1aa] text-sm mt-2 font-medium">Set your institutional trading policy.</p>
      </div>

      <div className="space-y-8 flex-1">
        <div className="space-y-3">
          <Label htmlFor="maxTrade" className="text-[#d4d4d8] font-medium tracking-wide text-xs uppercase">Max Trade Amount ($)</Label>
          <Input id="maxTrade" value={maxTrade} onChange={(e) => setMaxTrade(e.target.value)} className="glass-input h-14 text-lg px-4" />
        </div>
        <div className="space-y-3">
          <Label htmlFor="minConfidence" className="text-[#d4d4d8] font-medium tracking-wide text-xs uppercase">Min Confidence (%)</Label>
          <Input id="minConfidence" value={minConfidence} onChange={(e) => setMinConfidence(e.target.value)} className="glass-input h-14 text-lg px-4" />
        </div>
        <div className="space-y-3">
          <Label htmlFor="minEdge" className="text-[#d4d4d8] font-medium tracking-wide text-xs uppercase">Min Edge (%)</Label>
          <Input id="minEdge" value={minEdge} onChange={(e) => setMinEdge(e.target.value)} className="glass-input h-14 text-lg px-4" />
        </div>
        <div className="flex items-center justify-between pt-6 pb-2 border-b border-white/[0.08]">
          <Label htmlFor="autoExecute" className="text-[#d4d4d8] font-medium tracking-wide text-xs uppercase">Auto-Execute Trades</Label>
          <Switch id="autoExecute" checked={autoExecute} onCheckedChange={setAutoExecute} />
        </div>
      </div>

      <div className="mt-10">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
          <Button 
            onClick={handleSave} 
            disabled={!isConnected || isPending || isConfirming}
            className="w-full h-14 rounded-full bg-gradient-to-r from-[#7c3aed]/80 to-[#4c1d95]/80 backdrop-blur-2xl hover:from-[#8b5cf6]/90 hover:to-[#5b21b6]/90 text-white shadow-[0_8px_30px_rgba(124,58,237,0.4),inset_0_1px_2px_rgba(255,255,255,0.4)] border border-white/20 disabled:opacity-50 transition-all font-bold text-[15px] tracking-wide uppercase"
          >
            {!isConnected 
              ? "Connect Wallet to Save" 
              : isPending 
                ? "Confirm in Wallet..." 
                : isConfirming 
                  ? "Saving to Monad..." 
                  : "Save Policy"}
          </Button>
        </motion.div>
        {hash && (
          <p className="text-xs text-[#a1a1aa] w-full text-center mt-4">
            Tx: <a href={`https://testnet.monadexplorer.com/tx/${hash}`} target="_blank" rel="noreferrer" className="text-[#8b5cf6] hover:text-[#a78bfa] underline underline-offset-4">{hash.slice(0,12)}...</a>
          </p>
        )}
      </div>
    </div>
  );
}
