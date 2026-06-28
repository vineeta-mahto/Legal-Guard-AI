import React from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/dashboard";
import Assistant from "@/pages/assistant";
import Contracts from "@/pages/contracts";
import ContractsUpload from "@/pages/contracts-upload";
import ContractDetail from "@/pages/contract-detail";
import Approvals from "@/pages/approvals";
import ApprovalDetail from "@/pages/approval-detail";
import AuditTrail from "@/pages/audit-trail";
import Receipts from "@/pages/receipts";
import Notifications from "@/pages/notifications";
import Team from "@/pages/team";
import Settings from "@/pages/settings";

import AppLayout from "@/components/layout/AppLayout";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      
      {/* App Routes */}
      <Route path="/dashboard">
        {() => <AppLayout><Dashboard /></AppLayout>}
      </Route>
      <Route path="/assistant">
        {() => <AppLayout><Assistant /></AppLayout>}
      </Route>
      <Route path="/contracts/upload">
        {() => <AppLayout><ContractsUpload /></AppLayout>}
      </Route>
      <Route path="/contracts/:id">
        {() => <AppLayout><ContractDetail /></AppLayout>}
      </Route>
      <Route path="/contracts">
        {() => <AppLayout><Contracts /></AppLayout>}
      </Route>
      
      <Route path="/approvals/:id">
        {() => <AppLayout><ApprovalDetail /></AppLayout>}
      </Route>
      <Route path="/approvals">
        {() => <AppLayout><Approvals /></AppLayout>}
      </Route>
      
      <Route path="/audit-trail">
        {() => <AppLayout><AuditTrail /></AppLayout>}
      </Route>
      <Route path="/receipts">
        {() => <AppLayout><Receipts /></AppLayout>}
      </Route>
      <Route path="/notifications">
        {() => <AppLayout><Notifications /></AppLayout>}
      </Route>
      <Route path="/team">
        {() => <AppLayout><Team /></AppLayout>}
      </Route>
      <Route path="/settings">
        {() => <AppLayout><Settings /></AppLayout>}
      </Route>
      
      {/* Catch-all */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
