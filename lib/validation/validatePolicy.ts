export type TradeProposal = {
  marketName: string;
  marketId: string;
  side: "YES" | "NO";
  marketProbability: number;
  aiProbability: number;
  edge: number;
  confidence: number;
  suggestedAmount: number;
  reasoning: string;
};

export type MonadPolicy = {
  maxTradeAmount: number;
  minConfidence: number;
  minEdge: number;
  autoExecute: boolean;
};

export type ValidationCheck = {
  name: string;
  condition: string;
  passed: boolean;
};

export type ValidationResult = {
  status: "APPROVED" | "BLOCKED";
  checks: ValidationCheck[];
};

export function validateProposalAgainstPolicy(
  proposal: TradeProposal,
  policy: MonadPolicy
): ValidationResult {
  const checks: ValidationCheck[] = [
    {
      name: "Trade Amount",
      condition: `$${proposal.suggestedAmount} <= $${policy.maxTradeAmount} maximum`,
      passed: proposal.suggestedAmount <= policy.maxTradeAmount,
    },
    {
      name: "Confidence",
      condition: `${proposal.confidence}% >= ${policy.minConfidence}% minimum confidence`,
      passed: proposal.confidence >= policy.minConfidence,
    },
    {
      name: "Edge",
      condition: `${proposal.edge}% >= ${policy.minEdge}% minimum edge`,
      passed: proposal.edge >= policy.minEdge,
    },
  ];

  const allPassed = checks.every((check) => check.passed);

  return {
    status: allPassed ? "APPROVED" : "BLOCKED",
    checks,
  };
}
