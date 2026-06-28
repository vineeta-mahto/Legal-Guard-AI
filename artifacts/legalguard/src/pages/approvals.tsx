import React, { useState } from "react";
import { useLocation } from "wouter";
import { 
  useListApprovals,
  getListApprovalsQueryKey,
  useApproveAction,
  useRejectAction,
  getGetDashboardSummaryQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckSquare, XCircle, CheckCircle, Clock, Eye, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Approvals() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [selectedApprovalId, setSelectedApprovalId] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  const { data: approvals, isLoading } = useListApprovals({
    status: activeTab === "all" ? undefined : activeTab
  });

  const approveMutation = useApproveAction();
  const rejectMutation = useRejectAction();

  const handleAction = (id: number, type: "approve" | "reject") => {
    setSelectedApprovalId(id);
    setActionType(type);
    setNotes("");
    setDialogOpen(true);
  };

  const submitAction = () => {
    if (!selectedApprovalId || !actionType) return;

    const mutation = actionType === "approve" ? approveMutation : rejectMutation;
    
    mutation.mutate({ 
      id: selectedApprovalId, 
      data: { notes } 
    }, {
      onSuccess: () => {
        setDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: getListApprovalsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        toast({
          title: `Request ${actionType === "approve" ? "Approved" : "Rejected"}`,
          description: "The audit trail has been updated."
        });
      }
    });
  };

  const pendingCount = approvals?.filter(a => a.status === "Pending").length || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Approval Center</h1>
        <p className="text-muted-foreground mt-1">Review and manage sensitive actions blocked by ArmorIQ.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="pending" className="flex gap-2">
            Pending
            {pendingCount > 0 && activeTab !== "pending" && (
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">{pendingCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <Card className="shadow-sm">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : approvals?.length === 0 ? (
              <div className="p-16 text-center flex flex-col items-center">
                <CheckSquare className="h-12 w-12 text-success/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-1">Everything looks good</h3>
                <p className="text-muted-foreground">No {activeTab !== "all" ? activeTab : ""} approvals found.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requested Action</TableHead>
                    <TableHead>Contract</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvals?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.requestedAction}</TableCell>
                      <TableCell className="text-muted-foreground">{item.contractName}</TableCell>
                      <TableCell>{item.requestedBy}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`border-0 ${
                          item.riskLevel === 'High' ? 'bg-destructive/10 text-destructive' :
                          item.riskLevel === 'Medium' ? 'bg-warning/10 text-warning' :
                          'bg-success/10 text-success'
                        }`}>
                          {item.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`border-0 ${
                          item.status === 'Approved' ? 'bg-success/10 text-success' :
                          item.status === 'Rejected' ? 'bg-destructive/10 text-destructive' :
                          'bg-amber-500/10 text-amber-600'
                        }`}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => setLocation(`/approvals/${item.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {item.status === 'Pending' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-success hover:text-success hover:bg-success/10"
                                onClick={() => handleAction(item.id, "approve")}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleAction(item.id, "reject")}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
            </DialogTitle>
            <DialogDescription>
              Provide optional notes for the audit trail before confirming your decision.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="Add notes..." 
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
