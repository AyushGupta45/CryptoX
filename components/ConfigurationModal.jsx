import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ConfigurationModal = ({ isOpen, config, onClose }) => {
  if (!config) return null;

  const handleSave = () => {
    console.log("Saved!");
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings for {config.symbol}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium">Minimum</label>
            <Input
              type="number"
              defaultValue={config.minimum}
              className="h-8 w-full text-sm mt-1"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium">Allowed Amount</label>
            <Input
              type="number"
              defaultValue={config.allowedAmount}
              className="h-8 w-full text-sm mt-1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationModal;
