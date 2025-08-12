import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function AboutModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>About / Calibration</DialogTitle>
        </DialogHeader>
        <div className="space-y-1 text-sm">
          <p>Client: Swahili Beach Hotel</p>
          <p>Revision Date: 30th July, 2025</p>
          <p>Revision No.: rev 01</p>
          <p>Project No.: 20257001032TC</p>
          <p>Tank: 0160750</p>
          <p>Tank Owner: Swahili Beach Hotel</p>
          <p>Location: Diani Beach, Kenya</p>
          <p>Tank Description: LPG Bullet Tank</p>
          <p>Nominal Diameter: 1190 mm</p>
          <p>Cylinder Length: 3700 mm</p>
          <p>Tank Nominal Capacity: 3898 Liters</p>
          <p>Date of Calibration: 30/07/2025</p>
          <p>Validity: 10 Years</p>
          <p>Overall Uncertainty: +0.012%</p>
          <p>Method of Calibration: API MPMS CHAPTER 2</p>
          <p>Tank calibrated by: Murban Engineering Limited</p>
          <p>Certificate No.: 20257001032TC-0160750</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
