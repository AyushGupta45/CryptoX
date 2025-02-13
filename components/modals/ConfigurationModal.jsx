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
      const allowedResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/config/updateConfig/${localConfig.symbol}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            allowedBudget: localConfig.allowedBudget,
            riskPercentage: localConfig.riskPercentage,
            stopLoss: localConfig.stopLoss,
            cooldown: localConfig.cooldown,
          }),
        }
      );

      if (!allowedResponse.ok) {
        throw new Error("Failed to update configuration.");
      }

      const updatedConfig = await allowedResponse.json();

      onUpdate({ ...updatedConfig });
      onClose();
    } catch (error) {
      console.error("Error saving configuration:", error.message);
    }
  };

  if (!localConfig) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-lg"
        onOpenAutoFocus={(e) => e.preventDefault()}
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="border-b">
            <div className="text-3xl mb-1 font-bold text-gray-700">
              Preferences
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Configure settings for {localConfig.name}
            </p>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 p-0 border-4 border-gray-100/70">
            <div className="font-medium text-sm text-gray-700 bg-gray-100/70 p-2">
              Customization Options
            </div>
            <div className="p-3 py-4 flex flex-col gap-2">
              <div className="flex flex-row w-full items-center justify-between gap-2">
                <div className="w-1/2 flex items-center justify-start">
                  <div className="flex flex-row items-center gap-2">
                    <label
                      htmlFor={`allowedAmount-${localConfig._id}`}
                      className="w-[105px] text-gray-600 text-sm"
                    >
                      Allowed Budget:
                    </label>
                    <div>
                      <Input
                        id={`allowedAmount-${localConfig._id}`}
                        type="number"
                        value={localConfig.allowedBudget || ""}
                        onChange={(e) =>
                          setLocalConfig((prev) => ({
                            ...prev,
                            allowedBudget: e.target.value,
                          }))
                        }
                        className="w-20  text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-1/2 flex items-center justify-end">
                  <div className="flex flex-row items-center gap-2">
                    <label
                      htmlFor={`allowedAmount-${localConfig._id}`}
                      className=" text-gray-600 text-sm"
                    >
                      Risk Percentage:
                    </label>

                    <div>
                      <Input
                        id={`allowedAmount-${localConfig._id}`}
                        type="number"
                        value={localConfig.riskPercentage || ""}
                        onChange={(e) =>
                          setLocalConfig((prev) => ({
                            ...prev,
                            riskPercentage: e.target.value,
                          }))
                        }
                        className="w-20  text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row w-full items-center justify-between gap-2">
                <div className="w-1/2 flex items-center justify-start">
                  <div className="flex flex-row items-center gap-2">
                    <label
                      htmlFor={`allowedAmount-${localConfig._id}`}
                      className="w-[105px] text-gray-600 text-sm"
                    >
                      Stoploss:
                    </label>
                    <div>
                      <Input
                        id={`allowedAmount-${localConfig._id}`}
                        type="number"
                        value={localConfig.stopLoss || ""}
                        onChange={(e) =>
                          setLocalConfig((prev) => ({
                            ...prev,
                            stopLoss: e.target.value,
                          }))
                        }
                        className="w-20 text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-1/2 flex items-center justify-end">
                  <div className="flex flex-row items-center gap-2">
                    <label
                      htmlFor={`allowedAmount-${localConfig._id}`}
                      className="text-gray-600 text-sm"
                    >
                      Cooldown Period:
                    </label>
                    <div>
                      <Input
                        id={`allowedAmount-${localConfig._id}`}
                        type="number"
                        value={localConfig.cooldown || ""}
                        onChange={(e) =>
                          setLocalConfig((prev) => ({
                            ...prev,
                            cooldown: e.target.value,
                          }))
                        }
                        className="w-20 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
