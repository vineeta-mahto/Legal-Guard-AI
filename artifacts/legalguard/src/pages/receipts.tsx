import React, { useState } from "react";
import { 
  useListReceipts 
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, ShieldCheck, Download, Copy, RefreshCw, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Receipts() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  // We are omitting params handling for simplicity if not fully required
  const { data: receipts, isLoading, isError } = useListReceipts();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied to your clipboard.`,
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Cryptographic Receipts</h1>
          <p className="text-muted-foreground mt-1">Verifiable proof of AI analysis and contract execution.</p>
        </div>
      </div>

      <div className="flex items-center max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by receipt ID or document name..." 
          className="pl-9 bg-card"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
        </div>
      ) : isError ? (
        <div className="py-12 text-center text-destructive flex flex-col items-center">
          <ShieldCheck className="h-8 w-8 mb-2" />
          <p>Failed to load receipts.</p>
        </div>
      ) : receipts?.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center border border-dashed rounded-xl bg-card">
          <ShieldCheck className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">No receipts yet</h3>
          <p className="text-muted-foreground">Receipts are generated automatically for critical actions.</p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {receipts?.filter(r => 
            !search || 
            r.documentName.toLowerCase().includes(search.toLowerCase()) || 
            r.receiptId.toLowerCase().includes(search.toLowerCase())
          ).map((receipt) => (
            <motion.div key={receipt.id} variants={item}>
              <Card className="h-full flex flex-col shadow-sm hover:shadow-md transition-shadow border-border/50">
                <CardHeader className="pb-3 border-b border-border/30 bg-muted/20">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-success" />
                      <span className="font-semibold text-sm">LegalGuard Receipt</span>
                    </div>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      {receipt.verificationStatus}
                    </Badge>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded border">
                      {receipt.receiptId}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 py-4 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm line-clamp-1" title={receipt.documentName}>
                        {receipt.documentName}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground pl-6">
                      {new Date(receipt.timestamp).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-muted/30 p-2 rounded">
                      <span className="block text-xs text-muted-foreground mb-1">Requested By</span>
                      <span className="font-medium truncate">{receipt.requestedBy}</span>
                    </div>
                    <div className="bg-muted/30 p-2 rounded">
                      <span className="block text-xs text-muted-foreground mb-1">Approved By</span>
                      <span className="font-medium truncate">{receipt.approvedBy || "System"}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="block text-xs text-muted-foreground mb-1">Transaction Hash</span>
                    <div className="flex items-center gap-2 bg-muted/50 p-2 rounded border border-border/50">
                      <span className="text-xs font-mono truncate flex-1" title={receipt.transactionHash}>
                        {receipt.transactionHash}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 shrink-0"
                        onClick={() => copyToClipboard(receipt.transactionHash, "Transaction Hash")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 pb-4 px-4 gap-2 flex-wrap">
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs">
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs">
                    <RefreshCw className="h-3.5 w-3.5" />
                    Verify
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
