import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ConfigurationModal = ({ isOpen, config, onClose, onUpdate }) => {
  const [localConfig, setLocalConfig] = useState(null);

  useEffect(() => {
    if (config) {
      setLocalConfig({ ...config });
    }
  }, [config]);

  const handleSave = async () => {
    if (!localConfig) return;
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/config/updateConfigAllowedAmount/${localConfig.symbol}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ allowedAmount: localConfig.allowedAmount }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to update config.");
      }
  
      const updatedConfig = await response.json();
      onUpdate(updatedConfig);
      onClose();
    } catch (error) {
      console.error("Error updating config:", error.message);
    }
  };
  

  if (!localConfig) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="border-b">
            <h1 className="text-3xl mb-1 font-bold text-gray-700">Strategy</h1>
            <p className="text-xs text-gray-400 mb-4">
              Configure Strategy for {localConfig.name}
            </p>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-2 pb-4 border-b">
            <label
              htmlFor={`allowedAmount-${localConfig._id}`}
              className="font-medium w-48"
            >
              Allowed Amount:
            </label>
            <Input
              className="text-sm"
              id={`allowedAmount-${localConfig._id}`}
              value={localConfig.allowedAmount || ""}
              onChange={(e) =>
                setLocalConfig((prev) => ({
                  ...prev,
                  allowedAmount: e.target.value,
                }))
              }
            />
          </div>

          <DialogFooter className="flex gap-4">
            <Button variant="destructive" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="bg-green-500 hover:bg-green-400 text-white"
              onClick={handleSave}
            >
              Save
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationModal;
