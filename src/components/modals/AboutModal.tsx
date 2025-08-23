import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function AboutModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>About / Calibration</DialogTitle>
        </DialogHeader>
        <ol className="space-y-1 text-sm list-decimal list-inside">
          <li>Tank: Tank 01</li>
          <li>Tank Owner: Rubis, Zambia.</li>
          <li>Location: Zambia</li>
          <li>Tank Description: LPG Bullet Tank</li>
          <li>Nominal Diameter: 2130 mm</li>
          <li>Cylinder Length: 11600 mm</li>
          <li>Tank Nominal Capacity: 39557 Liters</li>
          <li>Date of Calibration: 29/07/2025</li>
          <li>Validity: 10 Years</li>
          <li>Overall Uncertainty: +0.0113%</li>
          <li>Method of Calibration: API MPMS CHAPTER 2</li>
          <li>Tank calibrated by: Murban Engineering Limited</li>
          <li>Certificate No.: 20257001039TC-01</li>
        </ol>
      </DialogContent>
    </Dialog>
  );
}
