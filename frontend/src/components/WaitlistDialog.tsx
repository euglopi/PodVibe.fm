import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WaitlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WaitlistDialog({ open, onOpenChange }: WaitlistDialogProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to join waitlist");
      }

      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => {
        onOpenChange(false);
        setTimeout(() => setSubmitted(false), 300);
      }, 2000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && !mutation.isPending) {
      mutation.mutate(email);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl bg-white p-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8"
            >
              <DialogHeader className="mb-6">
                <DialogTitle className="font-serif text-3xl mb-2">
                  Join the Waitlist
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground font-light">
                  Be the first to experience wisdom without the wait.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-base border-gray-200 focus:border-black transition-colors rounded-none"
                    required
                    disabled={mutation.isPending}
                    data-testid="input-email"
                  />
                  {mutation.isError && (
                    <p className="text-sm text-red-600 font-light" data-testid="text-error">
                      {mutation.error.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={mutation.isPending}
                  data-testid="button-submit"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    "Get Early Access"
                  )}
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-12 text-center"
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-serif text-2xl mb-2" data-testid="text-success">
                Welcome aboard
              </h3>
              <p className="text-muted-foreground font-light">
                We'll be in touch soon.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
