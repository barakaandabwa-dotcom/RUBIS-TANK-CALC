import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function HelpModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Help — Calculation Steps</DialogTitle>
        </DialogHeader>
        <ol className="list-decimal pl-5 space-y-2 text-sm">
          <li>Enter Product Density (kg/L), Product Temperature (°C), Shell Temperature (°C), and Height (cm). Optionally enter Pressure (bar) and toggle pressure correction.</li>
          <li>Product Temperature Factor (VCF) is looked up from the built-in table using bilinear interpolation across Product Temperature and Product Density.</li>
          <li>Reference Volume is read from the Height↔Capacity table (cm → mm) with linear interpolation between mm rows.</li>
          <li>Shell Correction Factor (SCF) is taken exactly from the SCF table at the given Shell Temperature (no interpolation).</li>
          <li>Corrected Volume = Reference Volume × SCF × Product Temperature Factor (VCF).</li>
          <li>Optionally, if "Apply Pressure Correction" is on, PCF is interpolated between integer bars and applied: Corrected Volume ×= PCF.</li>
          <li>Mass (kg) = Corrected Volume × Product Density.</li>
        </ol>
      </DialogContent>
    </Dialog>
  );
}
