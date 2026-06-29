import React, { useState } from "react";
import { useLocation, useParams } from "wouter";
import {
  useGetContract,
  useGetContractAnalysis,
  useUpdateContract,
  getGetContractQueryKey
} from "@workspace/api-client-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Lock,
  MessageSquare,
  Download,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function ContractDetail() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const id = Number(params.id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);

  const { data: contract, isLoading: contractLoading } = useGetContract(id, {
    query: { enabled: !!id, queryKey: getGetContractQueryKey(id) }
  });

  const { data: analysis, isLoading: analysisLoading } = useGetContractAnalysis(id, {
    query: { enabled: !!id, queryKey: ["getContractAnalysis", id] }
  });

  const updateContract = useUpdateContract();

  const handleExportPDF = () => {
    if (!contract || !analysis) return;

    const riskColor = analysis.riskLevel.toLowerCase() === "high"
      ? "#ef4444"
      : analysis.riskLevel.toLowerCase() === "medium"
        ? "#f59e0b"
        : "#22c55e";

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${contract.name} – LegalGuard AI Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; background: #fff; padding: 40px; line-height: 1.6; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 24px; margin-bottom: 32px; }
    .logo { font-size: 20px; font-weight: 800; color: #2563eb; }
    .logo span { color: #1e293b; }
    .meta { font-size: 12px; color: #64748b; text-align: right; }
    h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
    h2 { font-size: 16px; font-weight: 700; color: #1e293b; margin: 24px 0 12px; border-left: 3px solid #2563eb; padding-left: 12px; }
    .badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
    .risk-score { font-size: 48px; font-weight: 900; color: ${riskColor}; }
    .risk-label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
    .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0; }
    .summary-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; }
    .summary-item .label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .summary-item .value { font-size: 14px; font-weight: 600; color: #1e293b; }
    .clause { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 14px; margin-bottom: 12px; }
    .clause-title { font-weight: 700; color: #991b1b; margin-bottom: 4px; }
    .clause-suggestion { background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; margin-top: 8px; font-size: 13px; color: #475569; }
    .obligation { padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
    .missing { color: #64748b; font-size: 13px; padding: 4px 0; }
    .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; font-size: 11px; color: #94a3b8; }
    .flex { display: flex; align-items: center; gap: 16px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">LegalGuard <span>AI</span></div>
      <div style="font-size:11px;color:#64748b;margin-top:4px;">Contract Analysis Report</div>
    </div>
    <div class="meta">
      <div>Generated: ${new Date().toLocaleString()}</div>
      <div>Contract ID: #${contract.id}</div>
      <div>Status: ${contract.status.replace("_", " ").toUpperCase()}</div>
    </div>
  </div>

  <h1>${contract.name}</h1>
  <div style="color:#64748b;font-size:14px;margin-top:4px;">${contract.client}</div>

  <div class="summary-grid" style="margin-top:24px;">
    <div class="summary-item">
      <div class="label">Overall Risk Score</div>
      <div class="risk-score">${analysis.overallRiskScore}</div>
      <div class="risk-label">${analysis.riskLevel} Risk</div>
    </div>
    <div class="summary-item">
      <div class="label">AI Confidence</div>
      <div class="risk-score" style="color:#2563eb;">${analysis.confidenceScore}%</div>
      <div class="risk-label">Confidence Level</div>
    </div>
    <div class="summary-item">
      <div class="label">Uploaded</div>
      <div class="value">${new Date(contract.uploadedAt).toLocaleDateString()}</div>
    </div>
    <div class="summary-item">
      <div class="label">Assigned To</div>
      <div class="value">${contract.assignedTo || "Unassigned"}</div>
    </div>
  </div>

  <h2>Executive Summary</h2>
  <p style="font-size:14px;color:#475569;">${analysis.executiveSummary}</p>

  <h2>Risky Clauses (${analysis.riskyClauses.length})</h2>
  ${analysis.riskyClauses.map(c => `
    <div class="clause">
      <div class="clause-title">${c.title}</div>
      <div style="font-size:13px;color:#7f1d1d;">${c.content}</div>
      ${c.aiSuggestion ? `<div class="clause-suggestion"><strong>AI Suggestion:</strong> ${c.aiSuggestion}</div>` : ""}
    </div>
  `).join("")}

  <h2>Missing Clauses</h2>
  ${analysis.missingClauses.map(c => `<div class="missing">• ${c}</div>`).join("")}

  <h2>Key Obligations</h2>
  ${contract.obligations.map(o => `<div class="obligation">✓ ${o}</div>`).join("")}

  <h2>Deadlines</h2>
  ${contract.deadlines.map(d => `<div class="obligation">• ${d}</div>`).join("")}

  <h2>Sensitive Actions (ArmorIQ Blocked)</h2>
  ${analysis.sensitiveActions.map(a => `<div style="color:#dc2626;font-size:13px;padding:4px 0;">⚠ ${a}</div>`).join("")}

  <div class="footer">
    This report was generated by LegalGuard AI with ArmorIQ governance. 
    Document Hash: ${Math.random().toString(36).slice(2).toUpperCase()}${Math.random().toString(36).slice(2).toUpperCase()} &nbsp;|&nbsp;
    © ${new Date().getFullYear()} LegalGuard AI
  </div>
</body>
</html>`;

    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) {
      toast({ title: "Popup blocked", description: "Please allow popups to export the PDF.", variant: "destructive" });
      return;
    }
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
  };

  const handleApproveDraft = () => {
    updateContract.mutate(
      { id, data: { status: "approved" } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetContractQueryKey(id) });
          setApproveDialogOpen(false);
          toast({
            title: "Contract approved",
            description: `${contract?.name} has been marked as approved.`,
          });
        },
        onError: () => {
          toast({
            title: "Approval failed",
            description: "Could not approve the contract. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (contractLoading || analysisLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-[300px]" />
        <div className="flex flex-col lg:flex-row gap-6">
          <Skeleton className="h-[600px] w-full lg:w-3/5" />
          <Skeleton className="h-[600px] w-full lg:w-2/5" />
        </div>
      </div>
    );
  }

  if (!contract || !analysis) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-destructive">
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="h-8 w-8" />
          <p>Contract not found.</p>
          <Button variant="outline" onClick={() => setLocation("/contracts")}>Go Back</Button>
        </div>
      </div>
    );
  }

  const riskColor = analysis.riskLevel.toLowerCase() === "high"
    ? "text-destructive"
    : analysis.riskLevel.toLowerCase() === "medium"
      ? "text-warning"
      : "text-success";

  const isAlreadyApproved = contract.status === "approved";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Approve Draft Confirmation Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Approve Draft
            </DialogTitle>
            <DialogDescription>
              You are about to approve <strong>{contract.name}</strong>. This will mark the contract as
              approved and log the action to the audit trail. This action can be reviewed in the Approval Center.
            </DialogDescription>
          </DialogHeader>
          {analysis.riskLevel.toLowerCase() === "high" && (
            <div className="flex items-start gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>This contract has a <strong>High Risk</strong> score of {analysis.overallRiskScore}/100. Ensure you have reviewed all risky clauses before approving.</span>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)} disabled={updateContract.isPending}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
              onClick={handleApproveDraft}
              disabled={updateContract.isPending}
            >
              {updateContract.isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Approving…</>
              ) : (
                <><CheckCircle2 className="h-4 w-4" /> Confirm Approval</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/contracts")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
              {contract.name}
              <Badge variant="outline" className={isAlreadyApproved ? "border-green-500 text-green-600 bg-green-50" : ""}>
                {contract.status.replace("_", " ")}
              </Badge>
            </h1>
            <p className="text-muted-foreground">{contract.client}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" className="gap-2" onClick={handleExportPDF}>
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="secondary" className="gap-2" onClick={() => setLocation("/assistant")}>
            <MessageSquare className="h-4 w-4" />
            Ask AI
          </Button>
          <Button
            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => setApproveDialogOpen(true)}
            disabled={isAlreadyApproved}
          >
            <CheckCircle2 className="h-4 w-4" />
            {isAlreadyApproved ? "Approved" : "Approve Draft"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>AI Risk Analysis</CardTitle>
              <CardDescription>Automated review powered by LegalGuard AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
                <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted/20" />
                    <circle
                      cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10"
                      className={riskColor}
                      strokeDasharray={`${analysis.overallRiskScore * 2.827} 282.7`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{analysis.overallRiskScore}</span>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{analysis.riskLevel} RISK</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Executive Summary</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{analysis.executiveSummary}</p>
                  <Badge variant="outline" className="bg-primary/5 text-primary">Confidence: {analysis.confidenceScore}%</Badge>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    Risky Clauses ({analysis.riskyClauses.length})
                  </h4>
                  <div className="space-y-4">
                    {analysis.riskyClauses.map((clause, idx) => (
                      <div key={idx} className="p-4 rounded-lg border border-destructive/20 bg-destructive/5 space-y-2">
                        <div className="flex justify-between items-start">
                          <h5 className="font-medium">{clause.title}</h5>
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-0">High Risk</Badge>
                        </div>
                        <p className="text-sm">{clause.content}</p>
                        {clause.aiSuggestion && (
                          <div className="mt-3 p-3 bg-card rounded-md border border-border text-sm flex gap-2">
                            <MessageSquare className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span className="text-muted-foreground"><strong>AI Suggestion:</strong> {clause.aiSuggestion}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Missing Clauses</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {analysis.missingClauses.map((clause, idx) => (
                      <li key={idx}>{clause}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Contract Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">File Type</p>
                  <p className="font-medium flex items-center gap-1.5"><FileText className="h-4 w-4" /> {contract.fileType}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Size</p>
                  <p className="font-medium">{contract.fileSize}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Uploaded</p>
                  <p className="font-medium">{new Date(contract.uploadedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Assigned To</p>
                  <p className="font-medium">{contract.assignedTo || "Unassigned"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-destructive/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1.5 bg-destructive/10 rounded-bl-lg">
              <Lock className="h-4 w-4 text-destructive" />
            </div>
            <CardHeader>
              <CardTitle className="text-destructive">Blocked by ArmorIQ</CardTitle>
              <CardDescription>Sensitive actions require approval</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {analysis.sensitiveActions.map((action, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                    {action}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full mt-4 text-destructive border-destructive/30 hover:bg-destructive/10">
                Request Exception
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Key Obligations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                {contract.obligations.map((obs, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                {contract.deadlines.map((deadline, idx) => (
                  <li key={idx} className="flex flex-col gap-1 p-3 bg-muted rounded-md">
                    <span className="font-medium">{deadline}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
