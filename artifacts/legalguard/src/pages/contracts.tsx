import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  useListContracts 
} from "@workspace/api-client-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, FileText, AlertCircle, UploadCloud } from "lucide-react";

export default function Contracts() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");

  const { data: contracts, isLoading, isError } = useListContracts({
    search: search || undefined,
    status: status !== "all" ? status : undefined
  });

  const getRiskColor = (level: string) => {
    switch(level.toLowerCase()) {
      case 'low': return 'bg-success/10 text-success hover:bg-success/20';
      case 'medium': return 'bg-warning/10 text-warning hover:bg-warning/20';
      case 'high': return 'bg-destructive/10 text-destructive hover:bg-destructive/20';
      default: return 'bg-secondary/10 text-secondary hover:bg-secondary/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'analyzed': return 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20';
      case 'uploaded': return 'bg-slate-500/10 text-slate-600 hover:bg-slate-500/20';
      case 'pending_review': return 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20';
      default: return 'bg-secondary/10 text-secondary hover:bg-secondary/20';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Contracts</h1>
          <p className="text-muted-foreground mt-1">Manage and analyze your legal documents.</p>
        </div>
        <Button onClick={() => setLocation('/contracts/upload')} className="flex items-center gap-2">
          <UploadCloud className="h-4 w-4" />
          Upload Contract
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search contracts..." 
                className="pl-9 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-[200px]">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="analyzed">Analyzed</SelectItem>
                  <SelectItem value="uploaded">Uploaded</SelectItem>
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : isError ? (
            <div className="p-12 text-center text-destructive flex flex-col items-center">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p>Failed to load contracts.</p>
            </div>
          ) : contracts?.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center">
              <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-1">No contracts found</h3>
              <p className="text-muted-foreground mb-4">Upload your first contract to get started</p>
              <Button onClick={() => setLocation('/contracts/upload')} variant="outline">
                Upload Contract
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts?.map((contract) => (
                  <TableRow 
                    key={contract.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setLocation(`/contracts/${contract.id}`)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {contract.name}
                      </div>
                    </TableCell>
                    <TableCell>{contract.client}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`border-0 ${getStatusColor(contract.status)}`}>
                        {contract.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`border-0 ${getRiskColor(contract.riskLevel)}`}>
                        {contract.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{contract.fileSize}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(contract.uploadedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{contract.assignedTo || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
