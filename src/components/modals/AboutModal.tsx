import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function AboutModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>About / Calibration</DialogTitle>
        </DialogHeader>
        <div className="space-y-1 text-sm">
          <p>Tank: Tank 01</p>
          <p>Tank Owner: Rubis, Zambia.</p>
          <p>Location: Zambia</p>
          <p>Tank Description: LPG Bullet Tank</p>
          <p>Nominal Diameter: 2130 mm</p>
          <p>Cylinder Length: 11600 mm</p>
          <p>Tank Nominal Capacity: 39557 Liters</p>
          <p>Date of Calibration: 29/07/2025</p>
          <p>Validity: 10 Years</p>
          <p>Overall Uncertainty: +0.0113%</p>
          <p>Method of Calibration: API MPMS CHAPTER 2</p>
          <p>Tank calibrated by: Murban Engineering Limited</p>
          <p>Certificate No.: 20257001039TC-01</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
