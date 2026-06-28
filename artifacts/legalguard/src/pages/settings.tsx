import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Building2, Shield, Key, Sliders, History, Copy, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  
  // Organization state
  const [workspaceName, setWorkspaceName] = useState("Acme Corp Legal");
  
  // Security state
  const [ssoEnabled, setSsoEnabled] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(true);
  
  // Policies state
  const [riskThreshold, setRiskThreshold] = useState([70]);
  const [autoApproveLowRisk, setAutoApproveLowRisk] = useState(true);

  // Mock API Keys
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: "Production App", key: "sk_live_...a8f9", created: "2023-10-15", lastUsed: "Today" },
    { id: 2, name: "Development Testing", key: "sk_test_...b2c4", created: "2023-11-02", lastUsed: "2 days ago" }
  ]);

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your organization settings have been updated successfully.",
    });
  };

  const copyKey = (key: string) => {
    toast({
      title: "Copied to clipboard",
      description: "API Key copied to clipboard. Keep it secure.",
    });
  };

  const revokeKey = (id: number) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
    toast({
      title: "Key revoked",
      description: "The API key has been permanently revoked.",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your workspace preferences and configurations.</p>
      </div>

      <Tabs defaultValue="organization" className="w-full">
        <TabsList className="mb-4 flex flex-wrap h-auto w-full justify-start border-b rounded-none bg-transparent p-0">
          <TabsTrigger 
            value="organization" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
          >
            <Building2 className="h-4 w-4 mr-2" /> Organization
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
          >
            <Shield className="h-4 w-4 mr-2" /> Security
          </TabsTrigger>
          <TabsTrigger 
            value="policies" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
          >
            <Sliders className="h-4 w-4 mr-2" /> Approval Policies
          </TabsTrigger>
          <TabsTrigger 
            value="api-keys" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
          >
            <Key className="h-4 w-4 mr-2" /> API Keys
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Workspace Details</CardTitle>
              <CardDescription>Basic information about your organization.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 bg-muted rounded-xl border flex items-center justify-center text-muted-foreground font-bold text-xl">
                  {workspaceName.substring(0, 2).toUpperCase()}
                </div>
                <Button variant="outline">Change Logo</Button>
              </div>
              <Separator />
              <div className="space-y-2 max-w-md">
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input 
                  id="workspace-name" 
                  value={workspaceName} 
                  onChange={(e) => setWorkspaceName(e.target.value)} 
                />
              </div>
              <div className="space-y-2 max-w-md">
                <Label>Billing Plan</Label>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                  <div>
                    <p className="font-medium">Enterprise</p>
                    <p className="text-sm text-muted-foreground">Unlimited contracts, advanced features</p>
                  </div>
                  <Button variant="outline" size="sm">Manage Billing</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 px-6 py-4">
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Authentication & Access</CardTitle>
              <CardDescription>Manage how users access this workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">SAML Single Sign-On (SSO)</Label>
                  <p className="text-sm text-muted-foreground">Allow users to log in via your identity provider.</p>
                </div>
                <Switch checked={ssoEnabled} onCheckedChange={setSsoEnabled} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Require Multi-Factor Auth (MFA)</Label>
                  <p className="text-sm text-muted-foreground">Enforce 2FA for all workspace members.</p>
                </div>
                <Switch checked={mfaEnabled} onCheckedChange={setMfaEnabled} />
              </div>
              <Separator />
              <div className="space-y-3">
                <Label className="text-base">Password Policy</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <span className="text-sm">Minimum length</span>
                    <span className="text-sm font-medium">12 characters</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <span className="text-sm">Require numbers</span>
                    <span className="text-sm font-medium">Yes</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <span className="text-sm">Require symbols</span>
                    <span className="text-sm font-medium">Yes</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <span className="text-sm">Expiration</span>
                    <span className="text-sm font-medium">90 days</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 px-6 py-4">
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>ArmorIQ Settings</CardTitle>
              <CardDescription>Configure the AI guardrails and approval workflows.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-base">Global Risk Threshold</Label>
                  <span className="font-bold text-primary">{riskThreshold}%</span>
                </div>
                <p className="text-sm text-muted-foreground">Contracts with a risk score above this threshold will automatically require manual review.</p>
                <div className="pt-4">
                  <Slider 
                    value={riskThreshold} 
                    onValueChange={setRiskThreshold} 
                    max={100} 
                    step={1} 
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Lenient (0)</span>
                    <span>Strict (100)</span>
                  </div>
                </div>
              </div>
              
              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-approve low risk actions</Label>
                  <p className="text-sm text-muted-foreground">Automatically process routine contracts that score under 20% risk.</p>
                </div>
                <Switch checked={autoApproveLowRisk} onCheckedChange={setAutoApproveLowRisk} />
              </div>

            </CardContent>
            <CardFooter className="border-t bg-muted/20 px-6 py-4">
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage keys for programmatic access to LegalGuard AI.</CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Generate New Key
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.name}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{key.key}</TableCell>
                      <TableCell>{key.created}</TableCell>
                      <TableCell>{key.lastUsed}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => copyKey(key.key)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => revokeKey(key.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {apiKeys.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No API keys generated yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
