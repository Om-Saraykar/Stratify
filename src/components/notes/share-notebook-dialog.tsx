"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useState } from "react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notebookId: string | null;
};

export default function ShareNotebookDialog({
  open,
  onOpenChange,
  notebookId,
}: Props) {
  const [shareEmail, setShareEmail] = useState("");
  const [access, setAccess] = useState<"EDIT" | "VIEW">("EDIT");
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    if (!notebookId || !shareEmail) return;

    setLoading(true);

    const res = await fetch("/api/shared-notebooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notebookId,
        email: shareEmail,
        access,
      }),
    });

    setLoading(false);

    if (res.ok) {
      setShareEmail("");
      onOpenChange(false);
    } else {
      alert("Failed to share notebook");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]"> {/* Added max-width for better desktop display */}
        <DialogHeader>
          <DialogTitle>Share Notebook</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4"> {/* Changed to grid for better control over spacing */}
          <div className="grid grid-cols-4 items-center gap-4"> {/* Aligns label and input */}
            <Label htmlFor="email" className="text-right"> {/* Right-aligns label */}
              Email
            </Label>
            <Input
              id="email"
              placeholder="user@example.com"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4"> {/* Aligns label and select */}
            <Label htmlFor="access" className="text-right"> {/* Right-aligns label */}
              Access Level
            </Label>
            <Select value={access} onValueChange={(val) => setAccess(val as "EDIT" | "VIEW")}>
              <SelectTrigger id="access" className="col-span-3"> {/* Allows select to take up remaining space */}
                <SelectValue placeholder="Select access level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EDIT">Edit</SelectItem>
                <SelectItem value="VIEW">View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter> {/* DialogFooter already provides good spacing for buttons */}
          <Button onClick={handleShare} disabled={loading}>
            {loading ? "Sharing..." : "Share"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}