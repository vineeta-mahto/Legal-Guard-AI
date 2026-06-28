import React, { useState } from "react";
import { 
  useListAuditEvents 
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Download, Copy, AlertCircle, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function AuditTrail() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");

  const { data: events, isLoading, isError } = useListAuditEvents({
    search: search || undefined,
    status: status !== "all" ? status : undefined
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Hash value has been copied to your clipboard.",
    });
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'executed': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'blocked': return 'bg-destructive';
      default: return 'bg-secondary';
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Audit Trail</h1>
          <p className="text-muted-foreground mt-1">Immutable ledger of all actions and AI decisions.</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-4 border-b border-border/50 bg-muted/30">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by user, action, or hash..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[200px]">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="executed">Executed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="w-full md:w-auto gap-2">
              <Calendar className="h-4 w-4" />
              Date Range
            </Button>
          </div>
        </CardContent>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-8 pl-4 border-l-2 border-border ml-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="relative pl-6">
                  <div className="absolute -left-[13px] top-1 h-6 w-6 rounded-full bg-muted border-4 border-card" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="py-12 text-center text-destructive flex flex-col items-center">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p>Failed to load audit events.</p>
            </div>
          ) : events?.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No audit events found matching your criteria.
            </div>
          ) : (
            <motion.div 
              className="space-y-8 pl-4 border-l-2 border-border ml-2"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {events?.map((event) => (
                <motion.div key={event.id} variants={item} className="relative pl-6">
                  <div className={`absolute -left-[13px] top-1.5 h-6 w-6 rounded-full border-4 border-card ${getStatusColor(event.status)}`} />
                  
                  <div className="bg-card border rounded-lg p-4 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="bg-muted text-foreground">
                            {event.agent}
                          </Badge>
                          <span className="text-sm font-medium">{event.action}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{event.user}</span>
                        </div>
                        
                        {event.details && (
                          <p className="text-sm text-muted-foreground">{event.details}</p>
                        )}
                        
                        {event.contractName && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Contract: </span>
                            <span className="font-medium">{event.contractName}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                        
                        <div className="flex items-center gap-2 mt-2">
                          {event.receiptId && (
                            <Badge variant="secondary" className="font-mono text-xs">
                              {event.receiptId}
                            </Badge>
                          )}
                          <div className="flex items-center bg-muted rounded-md px-2 py-1 gap-2 border">
                            <span className="font-mono text-xs text-muted-foreground truncate max-w-[100px]">
                              {event.hash}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-5 w-5 hover:bg-transparent text-muted-foreground hover:text-foreground"
                              onClick={() => copyToClipboard(event.hash)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
