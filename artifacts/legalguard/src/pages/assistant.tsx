import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Lock, Send, Bot, User, FileText, ShieldCheck, AlertTriangle } from "lucide-react";
import { useGetChatHistory, useSendChatMessage, getGetChatHistoryQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Assistant() {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: history, isLoading } = useGetChatHistory({ contractId: null });
  const sendMessage = useSendChatMessage();

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sendMessage.isPending) return;

    const messageText = input;
    setInput("");

    sendMessage.mutate(
      { data: { message: messageText, contractId: null } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetChatHistoryQueryKey({ contractId: null }),
          });
        },
      }
    );
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6 animate-in fade-in duration-500">
      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col shadow-sm border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Legal Agent</h2>
              <p className="text-xs text-muted-foreground">Always active • ArmorIQ Enabled</p>
            </div>
          </div>
          {sendMessage.isPending && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
              </div>
              AI is thinking…
            </div>
          )}
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-12 w-3/4 bg-muted animate-pulse rounded-lg" />
                <div className="h-12 w-1/2 bg-muted animate-pulse rounded-lg ml-auto" />
              </div>
            ) : history && history.length > 0 ? (
              history.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center ${
                    msg.role === "user" ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary"
                  }`}>
                    {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`max-w-[80%] rounded-xl p-4 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 border border-border"
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>

                    {msg.isBlocked && (
                      <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                        <Lock className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-destructive">Action Blocked by ArmorIQ</p>
                          <p className="text-xs text-destructive/80 mt-1">
                            {msg.blockedAction || "Sensitive action intercepted."} An approval request has been routed to the compliance team.
                          </p>
                        </div>
                      </div>
                    )}

                    {msg.role === "assistant" && !msg.isBlocked && Array.isArray(msg.evidenceRefs) && msg.evidenceRefs.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {(msg.evidenceRefs as string[]).map((ref: string, i: number) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">
                            <FileText className="h-3 w-3" /> {ref}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground mt-20">
                <ShieldCheck className="h-12 w-12 text-primary/40" />
                <p>Start a conversation. ArmorIQ is monitoring for compliance.</p>
                <div className="grid grid-cols-2 gap-2 max-w-sm mt-2">
                  {[
                    "Analyze the indemnification clause",
                    "What are the key risks in this contract?",
                    "Draft a liability cap provision",
                    "Summarize the payment terms",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      className="text-left text-xs p-2.5 rounded-lg border border-border bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sendMessage.isPending && (
              <div className="flex gap-3">
                <div className="h-8 w-8 shrink-0 rounded-full bg-secondary/20 text-secondary flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted/50 border border-border rounded-xl p-4">
                  <div className="flex gap-1.5 items-center h-5">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border bg-card">
          <form onSubmit={handleSend} className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a contract, legal precedent, or draft a clause..."
              className="flex-1 bg-muted/50 border-border focus-visible:ring-primary h-12"
              disabled={sendMessage.isPending}
            />
            <Button
              type="submit"
              className="h-12 w-12 shrink-0 p-0 rounded-xl"
              disabled={!input.trim() || sendMessage.isPending}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </Card>

      {/* Right Context Panel */}
      <div className="w-80 hidden lg:flex flex-col gap-4">
        <Card className="p-4 shadow-sm border-border bg-gradient-to-br from-card to-muted/20">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">ArmorIQ Status</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Vigilant mode is active. All prompt executions and outputs are hashed and logged to the immutable audit trail.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Current Threat Level</span>
              <span className="text-green-500 font-medium">Low</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Policy Engine</span>
              <span className="text-primary font-medium">Strict</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-sm border-border">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> Sensitive Keywords
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {["send to client", "execute contract", "share externally", "sign contract", "release payment"].map(k => (
              <span key={k} className="text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-600">
                {k}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">Typing these phrases will trigger ArmorIQ and create an approval request.</p>
        </Card>

        <Card className="flex-1 shadow-sm border-border p-4 flex flex-col">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" /> Context
          </h3>
          <div className="flex-1 flex items-center justify-center text-center text-sm text-muted-foreground p-6 border-2 border-dashed border-border rounded-xl">
            No specific contract active. Upload or select a contract to analyze context.
          </div>
        </Card>
      </div>
    </div>
  );
}
