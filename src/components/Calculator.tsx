import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { calculate, RANGES } from "@/utils/calculations";
import { ResultsCard } from "./ResultsCard";
import { VCFTableModal } from "./VCFTableModal";
import { SCFTableModal } from "./SCFTableModal";
import { PressureTableModal } from "./PressureTableModal";
import { AboutModal } from "./modals/AboutModal";
import { HelpModal } from "./modals/HelpModal";
import { HeightCapacityModal } from "./HeightCapacityModal";
import { ResourceHeightGuideModal } from "./ResourceHeightGuideModal";
import percentCsv from "@/assets/Percent_Height.csv?raw";
import { parsePercentHeightCsv } from "@/utils/interpolation";
import { TankGauge } from "./TankGauge";

const PERCENT_TABLE = parsePercentHeightCsv(percentCsv);

export default function Calculator() {
  const { toast } = useToast();

  const [density, setDensity] = useState<number | "">(0.55);
  const [productTemperature, setProductTemperature] = useState<number | "">(20.0);
  const [shellTemperature, setShellTemperature] = useState<number | "">(20.0);
  const [heightMm, setHeightMm] = useState<number | "">(0);
  const [pressure, setPressure] = useState<number | "">(17);
  const [showVCFToggle, setShowVCFToggle] = useState(false);

  const [percent, setPercent] = useState<number>(0);

  const [openVCF, setOpenVCF] = useState(false);
  const [openSCF, setOpenSCF] = useState(false);
  const [openPCF, setOpenPCF] = useState(false);
  const [openAbout, setOpenAbout] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const [openHeight, setOpenHeight] = useState(false);

  const [result, setResult] = useState<ReturnType<typeof calculate> | null>(null);

  const reset = () => {
    setDensity(0.55);
    setProductTemperature(20.0);
    setShellTemperature(20.0);
    setHeightMm(0);
    setPressure(17);
    setShowVCFToggle(false);
    setPercent(0);
    setResult(null);
  };
  const onCalculate = () => {
    if (density === "" || productTemperature === "" || shellTemperature === "" || heightMm === "") {
      toast({ title: "Missing input", description: "Product density, product temperature, shell temperature and height are required.", variant: "destructive" });
      return;
    }
    try {
      const res = calculate({
        density: Number(density),
        productTemperature: Number(productTemperature),
        shellTemperature: Number(shellTemperature),
        heightMm: Number(heightMm),
        pressure: pressure === "" ? undefined : Number(pressure),
      });
      setResult(res);
    } catch (e: any) {
      toast({ title: "Validation error", description: e.message, variant: "destructive" });
    }
  };

  const header = (
    <header className="w-full mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/lovable-uploads/276648f6-6e8a-4575-a788-75ee76afecef.png"
            alt="Murban Engineering logo"
            className="h-10 w-10 rounded-full object-contain shadow"
            style={{
              background: 'transparent',
              mixBlendMode: 'multiply'
            }}
            loading="eager"
          />
          <div>
            <span className="text-lg md:text-xl font-semibold tracking-tight">Murban Engineering</span>
            <br />
            <span className="text-base md:text-lg font-medium text-muted-foreground">RUBIS TANK </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setOpenHelp(true)}>Help</Button>
          <Button variant="secondary" onClick={() => setOpenAbout(true)}>About / Calibration</Button>
        </div>
      </div>
      <div className="mt-3">
        
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--ink))]">Tank Mass Calculator</h1>
      </div>
      <p className="text-muted-foreground mt-2">Single tank: 01 — LPG Bullet Tank</p>
    </header>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto">
        {header}
        {/* Fill Level Slider */}
        <section aria-label="Fill level gauge" className="mb-6 rounded-2xl border bg-muted/30 p-4">
          <div className="flex flex-col gap-3">
            <TankGauge
              percent={percent}
              heightMm={typeof heightMm === "number" ? heightMm : Number(heightMm)}
              capacityL={(() => { const row = PERCENT_TABLE.find(r => r.percent === percent); return row ? row.capacity_L : undefined; })()}
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="font-medium">Fill Level: {percent}%</div>
              <div className="text-sm text-muted-foreground">
                Height: {typeof heightMm === "number" ? heightMm.toFixed(2) : Number(heightMm).toFixed(2)} mm •
                Capacity: {(() => { const row = PERCENT_TABLE.find(r => r.percent === percent); return row ? row.capacity_L.toFixed(2) : "-"; })()} L
              </div>
            </div>
            <Slider
              value={[percent]}
              min={0}
              max={100}
              step={1}
              onValueChange={(v) => {
                const p = v[0] ?? 0;
                setPercent(p);
                const row = PERCENT_TABLE.find(r => r.percent === p);
                if (row) setHeightMm(Number(row.height_mm.toFixed(2)));
              }}
            />
          </div>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-2xl shadow-md transition-all hover:shadow-xl hover:-translate-y-0.5 hover-scale">
            <CardHeader>
              <CardTitle>Manual Inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="density">Product Density (kg/L)</Label>
                  <Input id="density" type="number" step="0.001" min={RANGES.density.min} max={RANGES.density.max}
                    placeholder="0.550" value={density}
                    onChange={(e) => setDensity(e.target.value === "" ? "" : Number(e.target.value))} />
                </div>
                <div>
                  <Label htmlFor="productTemperature">Product Temperature (°C)</Label>
                  <Input id="productTemperature" type="number" step="0.1" min={RANGES.productTemperature.min} max={RANGES.productTemperature.max}
                    placeholder="20.0" value={productTemperature}
                    onChange={(e) => setProductTemperature(e.target.value === "" ? "" : Number(e.target.value))} />
                </div>
                <div>
                  <Label htmlFor="shellTemperature">Shell Temperature (°C)</Label>
                  <Input id="shellTemperature" type="number" step="0.1"
                    placeholder="20.0" value={shellTemperature}
                    onChange={(e) => setShellTemperature(e.target.value === "" ? "" : Number(e.target.value))} />
                </div>
                <div>
                  <Label htmlFor="height">Height (mm)</Label>
                  <Input id="height" type="number" step="0.01" min={RANGES.heightMm.min} max={RANGES.heightMm.max}
                    placeholder="0.00" value={heightMm}
                    onChange={(e) => setHeightMm(e.target.value === "" ? "" : Number(e.target.value))} />
                </div>
                <div>
                  <Label htmlFor="pressure">Pressure (bar)</Label>
                  <Input id="pressure" type="number" step="0.1" value={pressure}
                    onChange={(e) => setPressure(e.target.value === "" ? "" : Number(e.target.value))} />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Switch id="showVCF" checked={showVCFToggle} onCheckedChange={setShowVCFToggle} />
                  <Label htmlFor="showVCF">Show Product Temperature (VCF) table</Label>
                </div>
                {showVCFToggle && (
                  <Button variant="outline" onClick={() => setOpenVCF(true)}>Open Product Temperature Table</Button>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button onClick={onCalculate}>Calculate</Button>
                <Button variant="secondary" onClick={reset}>Reset</Button>
                <Button variant="outline" onClick={() => setOpenSCF(true)}>Shell Correction Factors</Button>
                <Button variant="outline" onClick={() => setOpenPCF(true)}>Pressure Factors</Button>
                <Button variant="outline" onClick={() => setOpenHeight(true)}>Height↔Capacity Table</Button>
              </div>
            </CardContent>
          </Card>

          <ResultsCard result={result} />
        </div>

        <section className="mt-8">
          <Card className="rounded-2xl shadow-md transition-all hover:shadow-xl hover:-translate-y-0.5 hover-scale">
            <CardHeader>
              <CardTitle>Tank Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 text-sm md:text-base">
                <Info label="Client" value="Rubis, Zambia" />
                <Info label="Revision Date" value="30th July, 2025" />
                <Info label="Revision No." value="rev 01" />
                <Info label="Project No." value="20257001039TC" />
                <Info label="Tank" value="Tank 01" />
                <Info label="Tank Owner" value="Rubis, Zambia" />
                <Info label="Location" value="Zambia" />
                <Info label="Tank Description" value="LPG Bullet Tank" />
                <Info label="Nominal Diameter" value="2130 mm" />
                <Info label="Cylinder Length" value="11600 mm" />
                <Info label="Tank Nominal Capacity" value="39557 Liters" />
                <Info label="Date of Calibration" value="29/07/2025" />
                <Info label="Validity" value="10 Years" />
                <Info label="Overall Uncertainty" value="+0.0113%" />
                <Info label="Method of Calibration" value="API MPMS CHAPTER 2" />
                <Info label="Tank calibrated by" value="Murban Engineering Limited" />
                <Info label="Certificate No." value="20257001039TC-01" />
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <VCFTableModal open={openVCF} onOpenChange={setOpenVCF} />
      <SCFTableModal open={openSCF} onOpenChange={setOpenSCF} />
      <PressureTableModal open={openPCF} onOpenChange={setOpenPCF} />
      <AboutModal open={openAbout} onOpenChange={setOpenAbout} />
      <HelpModal open={openHelp} onOpenChange={setOpenHelp} />
      <HeightCapacityModal open={openHeight} onOpenChange={setOpenHeight} />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3 shadow-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
