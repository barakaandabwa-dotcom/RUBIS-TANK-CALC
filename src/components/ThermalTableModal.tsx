import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import thermalCsv from "@/assets/thermal_factors.csv?raw";

export function ThermalTableModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const lines = thermalCsv.trim().split(/\r?\n/);
  const headers = lines[0].split(",");
  const rows = lines.slice(1).map((l) => l.split(","));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Thermal Factors</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto border rounded-md max-h-[60vh]">
          <table className="w-full text-sm">
            <thead className="bg-muted sticky top-0">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="px-2 py-2 text-left border-b">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx} className="hover:bg-muted/50">
                  {r.map((c, i) => (
                    <td key={i} className="px-2 py-1 border-b">{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
