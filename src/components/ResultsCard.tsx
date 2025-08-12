import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function ResultsCard({
  result,
}: {
  result: {
    usedDensity: number;
    usedProductTemperature: number;
    usedShellTemperature: number;
    vcf: number;
    scf: number;
    referenceVolume: number;
    correctedVolume: number;
    pcf?: number;
    correctedVolumeWithPressure: number;
    mass: number;
  } | null;
}) {
  const { toast } = useToast();

  const copyResults = async () => {
    if (!result) return;
    const payload = {
      Reference_Volume_L: result.referenceVolume,
      Product_Density_kg_per_L: result.usedDensity,
      Product_Temperature_C: result.usedProductTemperature,
      Shell_Temperature_C: result.usedShellTemperature,
      Product_Temperature_Factor_VCF: result.vcf,
      Shell_Correction_Factor_SCF: result.scf,
      Corrected_Volume_L: result.correctedVolume,
      PCF_used: result.pcf ?? null,
      Corrected_Volume_with_Pressure_L: result.correctedVolumeWithPressure,
      Mass_kg: result.mass,
    };
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    toast({ title: "Results copied", description: "Full precision JSON copied to clipboard." });
  };

  const exportCsv = () => {
    if (!result) return;
    const rows = [
      ["Reference Volume (L)", result.referenceVolume],
      ["Product Density (kg/L)", result.usedDensity],
      ["Product Temperature (°C)", result.usedProductTemperature],
      ["Shell Temperature (°C)", result.usedShellTemperature],
      ["Product Temperature Factor (VCF)", result.vcf],
      ["Shell Correction Factor (SCF)", result.scf],
      ["Corrected Volume (L)", result.correctedVolume],
      ["PCF used", result.pcf ?? ""],
      ["Corrected Volume with Pressure (L)", result.correctedVolumeWithPressure],
      ["Mass (kg)", result.mass],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tank_mass_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const printPage = () => window.print();

  return (
    <Card className="animate-fade-in rounded-2xl shadow-md transition-all hover:shadow-xl hover:-translate-y-0.5 hover-scale">
      <CardHeader>
        <CardTitle>Results</CardTitle>
      </CardHeader>
      <CardContent>
        {!result ? (
          <p className="text-muted-foreground">Enter inputs and click Calculate to see results.</p>
        ) : (
          <div className="space-y-2">
            <Row label="Reference Volume (L)" value={result.referenceVolume.toFixed(3)} />
            <Row label="Product Temperature Factor (VCF)" value={result.vcf.toFixed(6)} />
            <Row label="Shell Correction Factor (SCF)" value={result.scf.toFixed(6)} />
            <Row label="Corrected Volume (L)" value={result.correctedVolume.toFixed(3)} />
            {result.pcf !== undefined && (
              <Row label="PCF used" value={result.pcf.toFixed(6)} />
            )}
            <Row label="Product Density used (kg/L)" value={result.usedDensity.toFixed(3)} />
            
            <Row label="Mass (kg)" value={result.mass.toFixed(3)} highlight />

            <div className="flex flex-wrap gap-3 pt-2">
              <Button onClick={copyResults}>Copy results</Button>
              <Button variant="secondary" onClick={exportCsv}>Export CSV</Button>
              <Button variant="outline" onClick={printPage}>Print</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between border-b py-1 ${highlight ? "font-semibold" : ""}`}>
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
