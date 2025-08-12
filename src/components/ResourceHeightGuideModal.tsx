import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function ResourceHeightGuideModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Height % Reference Table (Resource)</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto rounded-md">
          <img src="/lovable-uploads/90689b3d-ca3f-423c-b6cd-a21941be012e.png" alt="Percentage height reference table" className="w-full h-auto" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
