import React from "react";
import { useLocation, useParams } from "wouter";
import { 
  useGetContract, 
  useGetContractAnalysis,
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
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Lock,
  MessageSquare,
  Download,
  AlertCircle
} from "lucide-react";

export default function ContractDetail() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const id = Number(params.id);

  const { data: contract, isLoading: contractLoading } = useGetContract(id, {
    query: { enabled: !!id, queryKey: getGetContractQueryKey(id) }
  });
  
  const { data: analysis, isLoading: analysisLoading } = useGetContractAnalysis(id, {
    query: { enabled: !!id, queryKey: ['getContractAnalysis', id] }
  });

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
          <Button variant="outline" onClick={() => setLocation('/contracts')}>Go Back</Button>
        </div>
      </div>
    );
  }

  const riskColor = analysis.riskLevel.toLowerCase() === 'high' 
    ? 'text-destructive' 
    : analysis.riskLevel.toLowerCase() === 'medium'
      ? 'text-warning'
      : 'text-success';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/contracts')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
              {contract.name}
              <Badge variant="outline">{contract.status.replace('_', ' ')}</Badge>
            </h1>
            <p className="text-muted-foreground">{contract.client}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="secondary" className="gap-2" onClick={() => setLocation('/assistant')}>
            <MessageSquare className="h-4 w-4" />
            Ask AI
          </Button>
          <Button className="gap-2 bg-success text-success-foreground hover:bg-success/90">
            <CheckCircle2 className="h-4 w-4" />
            Approve Draft
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel - 60% */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>AI Risk Analysis</CardTitle>
              <CardDescription>Automated review powered by LegalGuard AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
                {/* Gauge */}
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
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-primary/5 text-primary">Confidence: {analysis.confidenceScore}%</Badge>
                  </div>
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

        {/* Right Panel - 40% */}
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
                  <p className="font-medium">{contract.assignedTo || 'Unassigned'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-destructive/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1.5 bg-destructive/10 rounded-bl-lg">
              <Lock className="h-4 w-4 text-destructive" />
            </div>
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                Blocked by ArmorIQ
              </CardTitle>
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
