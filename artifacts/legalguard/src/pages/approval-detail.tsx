import React, { useState } from "react";
import { useLocation, useParams } from "wouter";
import { 
  useGetApproval,
  getGetApprovalQueryKey,
  useApproveAction,
  useRejectAction,
  getListApprovalsQueryKey,
  getGetDashboardSummaryQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileText, User, ShieldAlert, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ApprovalDetail() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const id = Number(params.id);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [notes, setNotes] = useState("");

  const { data: approval, isLoading } = useGetApproval(id, {
    query: { enabled: !!id, queryKey: getGetApprovalQueryKey(id) }
  });

  const approveMutation = useApproveAction();
  const rejectMutation = useRejectAction();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!approval) return null;

  const handleAction = (type: "approve" | "reject") => {
    setActionType(type);
    setNotes("");
    setDialogOpen(true);
  };

  const submitAction = () => {
    if (!actionType) return;
    const mutation = actionType === "approve" ? approveMutation : rejectMutation;
    
    mutation.mutate({ 
      id, 
      data: { notes } 
    }, {
      onSuccess: () => {
        setDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: getGetApprovalQueryKey(id) });
        queryClient.invalidateQueries({ queryKey: getListApprovalsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        toast({
          title: `Request ${actionType === "approve" ? "Approved" : "Rejected"}`,
        });
      }
    });
  };

  const isPending = approval.status === 'Pending';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/approvals')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
              Approval Request #{approval.id}
              <Badge variant="outline" className={`border-0 ${
                approval.status === 'Approved' ? 'bg-success/10 text-success' :
                approval.status === 'Rejected' ? 'bg-destructive/10 text-destructive' :
                'bg-amber-500/10 text-amber-600'
              }`}>
                {approval.status}
              </Badge>
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-xl">{approval.requestedAction}</CardTitle>
              <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {approval.requestedBy}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {new Date(approval.createdAt).toLocaleString()}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Reason for Request</h4>
                <p className="text-sm bg-muted/50 p-4 rounded-lg">{approval.reason}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-primary">
                  <ShieldAlert className="h-4 w-4" /> AI Explanation (ArmorIQ)
                </h4>
                <p className="text-sm bg-primary/5 border border-primary/10 p-4 rounded-lg leading-relaxed">
                  {approval.aiExplanation}
                </p>
              </div>

              {approval.notes && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Resolution Notes</h4>
                  <p className="text-sm bg-muted p-4 rounded-lg border">{approval.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {isPending && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                size="lg" 
                className="flex-1 bg-success hover:bg-success/90 text-white gap-2"
                onClick={() => handleAction('approve')}
              >
                <CheckCircle className="h-5 w-5" /> Approve Action
              </Button>
              <Button 
                size="lg" 
                variant="destructive" 
                className="flex-1 gap-2"
                onClick={() => handleAction('reject')}
              >
                <XCircle className="h-5 w-5" /> Reject
              </Button>
              <Button size="lg" variant="outline" className="flex-1">
                Request Changes
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Risk Level</span>
                <Badge variant="outline" className={`border-0 ${
                  approval.riskLevel === 'High' ? 'bg-destructive/10 text-destructive' :
                  approval.riskLevel === 'Medium' ? 'bg-warning/10 text-warning' :
                  'bg-success/10 text-success'
                }`}>
                  {approval.riskLevel}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Risk Score</span>
                <span className="font-bold">{approval.riskScore}/100</span>
              </div>
              <Separator />
              <div>
                <span className="text-sm text-muted-foreground block mb-1">Estimated Impact</span>
                <p className="text-sm font-medium">{approval.estimatedImpact}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setLocation(`/contracts/${approval.contractId}`)}>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Target Contract
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium text-sm">{approval.contractName}</p>
              <p className="text-sm text-muted-foreground mt-1">{approval.client}</p>
              <Button variant="link" className="px-0 mt-2 h-auto text-primary">View Contract →</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="Add notes for the audit trail..." 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button 
              className={actionType === 'approve' ? 'bg-success hover:bg-success/90 text-white' : 'bg-destructive hover:bg-destructive/90 text-white'}
              onClick={submitAction}
              disabled={approveMutation.isPending || rejectMutation.isPending}
            >
              {approveMutation.isPending || rejectMutation.isPending ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
