import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function TankViewModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Tank View</DialogTitle>
        </DialogHeader>
        <img src="/RUBISTANK.jpg" alt="Tank view" className="w-full h-auto" />
      </DialogContent>
    </Dialog>
  );
}
