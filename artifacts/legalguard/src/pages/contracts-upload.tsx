import React, { useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { 
  useCreateContract,
  useListContracts,
  getListContractsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { UploadCloud, File, FileText, CheckCircle, X, AlertCircle } from "lucide-react";

export default function ContractsUpload() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const createContract = useCreateContract();
  
  const { data: recentContracts } = useListContracts();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        const extension = selectedFile.name.split('.').pop()?.toUpperCase() || 'UNKNOWN';
        const sizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB';
        
        createContract.mutate({
          data: {
            name: selectedFile.name,
            client: "Pending Review",
            fileType: extension,
            fileSize: sizeMB
          }
        }, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListContractsQueryKey() });
            setLocation('/contracts');
          }
        });
      }
    }, 150);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Upload Contract</h1>
        <p className="text-muted-foreground mt-1">Upload documents for AI analysis and risk assessment.</p>
      </div>

      <Card className="shadow-sm border-2 border-dashed border-border overflow-hidden">
        <CardContent className="p-0">
          <div 
            className={`p-12 flex flex-col items-center justify-center text-center transition-colors ${
              isDragging ? 'bg-primary/5' : 'bg-card'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !selectedFile && fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
            />
            
            {selectedFile ? (
              <div className="w-full max-w-md mx-auto space-y-6">
                <div className="flex items-center p-4 bg-muted rounded-lg border border-border">
                  <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center text-primary mr-4 shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setUploadProgress(0);
                    }}
                    disabled={createContract.isPending || uploadProgress > 0}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Uploading and preparing...</span>
                      <span className="font-medium">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
                
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpload();
                  }}
                  disabled={createContract.isPending || uploadProgress > 0}
                >
                  {createContract.isPending || uploadProgress > 0 ? "Processing..." : "Start Analysis"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4 cursor-pointer">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <UploadCloud className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">Click or drag file to this area to upload</h3>
                  <p className="text-sm text-muted-foreground">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files.</p>
                </div>
                <div className="flex gap-2 justify-center pt-2">
                  <Badge variant="secondary" className="font-mono text-xs">PDF</Badge>
                  <Badge variant="secondary" className="font-mono text-xs">DOCX</Badge>
                  <Badge variant="secondary" className="font-mono text-xs">TXT</Badge>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-medium tracking-tight">Recent Uploads</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentContracts?.slice(0, 3).map(contract => (
            <Card key={contract.id} className="shadow-sm">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="mt-0.5"><File className="h-5 w-5 text-muted-foreground" /></div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{contract.name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(contract.uploadedAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
