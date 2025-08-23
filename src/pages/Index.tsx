import { useState } from "react";
import Calculator from "@/components/Calculator";
import { Button } from "@/components/ui/button";
import { HelpModal } from "@/components/modals/HelpModal";
import { TankViewModal } from "@/components/modals/TankViewModal";

const Index = () => {
  const [helpOpen, setHelpOpen] = useState(false);
  const [tankOpen, setTankOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      <div className="p-4 flex justify-end gap-2">
        <Button variant="outline" onClick={() => setTankOpen(true)}>
          Tank View
        </Button>
        <Button variant="outline" onClick={() => setHelpOpen(true)}>
          Help
        </Button>
      </div>
      <Calculator />
      <HelpModal open={helpOpen} onOpenChange={setHelpOpen} />
      <TankViewModal open={tankOpen} onOpenChange={setTankOpen} />
    </main>
  );
};

export default Index;
