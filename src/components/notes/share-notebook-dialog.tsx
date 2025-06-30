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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Notebook</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Email to share with</Label>
            <Input
              placeholder="user@example.com"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
            />
          </div>

          <div>
            <Label>Access Level</Label>
            <Select value={access} onValueChange={(val) => setAccess(val as "EDIT" | "VIEW")}>
              <SelectTrigger>
                <SelectValue placeholder="Select access level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EDIT">Edit</SelectItem>
                <SelectItem value="VIEW">View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleShare} disabled={loading}>
            {loading ? "Sharing..." : "Share"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
