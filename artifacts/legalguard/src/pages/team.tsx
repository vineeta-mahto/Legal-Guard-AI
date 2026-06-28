import React, { useState } from "react";
import { 
  useListTeamMembers,
  useInviteTeamMember,
  useRemoveTeamMember,
  getListTeamMembersQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, UserPlus, MoreHorizontal, Trash2, Shield, Check } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function Team() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [inviteOpen, setInviteOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Viewer");

  const { data: members, isLoading } = useListTeamMembers();
  
  const inviteMutation = useInviteTeamMember();
  const removeMutation = useRemoveTeamMember();

  const handleInvite = () => {
    inviteMutation.mutate({ data: { name, email, role } }, {
      onSuccess: () => {
        setInviteOpen(false);
        setName("");
        setEmail("");
        setRole("Viewer");
        queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
        toast({ title: "Invitation sent successfully" });
      }
    });
  };

  const handleRemove = (id: number, memberName: string) => {
    if (confirm(`Are you sure you want to remove ${memberName} from the workspace?`)) {
      removeMutation.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
          toast({ title: "Member removed" });
        }
      });
    }
  };

  const getRoleBadge = (role: string) => {
    switch(role.toLowerCase()) {
      case 'admin': return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-0">Admin</Badge>;
      case 'reviewer': return <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-0">Reviewer</Badge>;
      case 'lawyer': return <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-0">Lawyer</Badge>;
      default: return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-0">Viewer</Badge>;
    }
  };

  const permissions = [
    { name: "View Contracts", admin: true, reviewer: true, lawyer: true, viewer: true },
    { name: "Upload Contracts", admin: true, reviewer: true, lawyer: true, viewer: false },
    { name: "Approve Actions", admin: true, reviewer: true, lawyer: false, viewer: false },
    { name: "Override ArmorIQ", admin: true, reviewer: false, lawyer: false, viewer: false },
    { name: "Manage Team", admin: true, reviewer: false, lawyer: false, viewer: false },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Team Management</h1>
          <p className="text-muted-foreground mt-1">Manage workspace members and roles.</p>
        </div>
        <Button onClick={() => setInviteOpen(true)} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle>Workspace Members</CardTitle>
          <CardDescription>Active members and their roles in this workspace.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members?.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.avatar || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium leading-none">{member.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(member.role)}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1.5 text-sm">
                        <div className={`w-2 h-2 rounded-full ${member.status === 'Active' ? 'bg-success' : 'bg-warning'}`} />
                        {member.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{member.actionsCount} actions</p>
                        <p className="text-xs text-muted-foreground">{member.approvalsCount} approvals</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleRemove(member.id, member.name)}>
                            <Trash2 className="h-4 w-4 mr-2" /> Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Role Permissions
          </CardTitle>
          <CardDescription>What each role is allowed to do within LegalGuard AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Permission</TableHead>
                  <TableHead className="text-center">Admin</TableHead>
                  <TableHead className="text-center">Reviewer</TableHead>
                  <TableHead className="text-center">Lawyer</TableHead>
                  <TableHead className="text-center">Viewer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((perm, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{perm.name}</TableCell>
                    <TableCell className="text-center">
                      {perm.admin ? <Check className="h-4 w-4 text-success mx-auto" /> : <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell className="text-center">
                      {perm.reviewer ? <Check className="h-4 w-4 text-success mx-auto" /> : <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell className="text-center">
                      {perm.lawyer ? <Check className="h-4 w-4 text-success mx-auto" /> : <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell className="text-center">
                      {perm.viewer ? <Check className="h-4 w-4 text-success mx-auto" /> : <span className="text-muted-foreground">-</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Add a new member to your workspace and assign their role.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input 
                placeholder="Jane Doe" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input 
                type="email" 
                placeholder="jane@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Reviewer">Reviewer</SelectItem>
                  <SelectItem value="Lawyer">Lawyer</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleInvite} 
              disabled={!name || !email || inviteMutation.isPending}
            >
              {inviteMutation.isPending ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
