"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ValidationResult } from "@/lib/validation/validatePolicy";

export function PolicyValidator({ result }: { result: ValidationResult | null }) {
  if (!result) return null;

  return (
    <Card className="bg-zinc-950 border-zinc-800 text-white mt-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-sm font-semibold tracking-wider text-zinc-400">
          <span>MONAD POLICY CHECK</span>
          {result.status === "APPROVED" ? (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30">APPROVED</Badge>
          ) : (
            <Badge className="bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30">BLOCKED</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 font-mono text-sm">
        {result.checks.map((check, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className={check.passed ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
              {check.passed ? "✓" : "✗"}
            </span>
            <span className={check.passed ? "text-zinc-300" : "text-red-300"}>
              {check.condition}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
