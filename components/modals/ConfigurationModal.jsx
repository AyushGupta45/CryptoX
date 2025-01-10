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
import { Checkbox } from "../ui/checkbox";

const ConfigurationModal = ({ isOpen, config, onClose, onUpdate }) => {
  const [localConfig, setLocalConfig] = useState(null);
  const [strategy, setStrategy] = useState(null);

  useEffect(() => {
    if (config) {
      setLocalConfig({ ...config });
    }
  }, [config]);

  useEffect(() => {
    const getStrategy = async () => {
      if (!localConfig?.symbol) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/strategy/get-strategy/${localConfig.symbol}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch strategy data");
        }

        const data = await response.json();
        setStrategy(data);
      } catch (error) {
        console.error("Error fetching strategy:", error.message);
      }
    };

    getStrategy();
  }, [localConfig?.symbol]);

  const handleSave = async () => {
    if (!localConfig) return;

    try {
      const allowedResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/config/updateConfigAllowedAmount/${localConfig.symbol}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ allowedAmount: localConfig.allowedAmount }),
        }
      );

      if (!allowedResponse.ok) {
        throw new Error("Failed to update allowed amount.");
      }

      const strategyResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/strategy/update-strategy/${localConfig.symbol}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ indicators: strategy.indicators }),
        }
      );

      if (!strategyResponse.ok) {
        throw new Error("Failed to update strategy indicators.");
      }

      const updatedConfig = await allowedResponse.json();
      const updatedStrategy = await strategyResponse.json();

      onUpdate({ ...updatedConfig, ...updatedStrategy });
      onClose();
    } catch (error) {
      console.error("Error saving configuration:", error.message);
    }
  };

  const handleCheck = async (symbol, indicatorKey) => {
    if (!symbol || !indicatorKey) return;

    try {
      const currentEnabled = strategy.indicators[indicatorKey]?.enabled;
      const updatedEnabled = !currentEnabled;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/strategy/update-indicator`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            symbol,
            indicator: indicatorKey,
            enabled: updatedEnabled,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update indicator status.");
      }

      setStrategy((prev) => ({
        ...prev,
        indicators: {
          ...prev.indicators,
          [indicatorKey]: {
            ...prev.indicators[indicatorKey],
            enabled: updatedEnabled,
          },
        },
      }));
    } catch (error) {
      console.error("Error updating indicator status:", error.message);
    }
  };

  if (!localConfig) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg" onOpenAutoFocus={(e) => e.preventDefault()} aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="border-b">
            <div className="text-3xl mb-1 font-bold text-gray-700">
              Strategy
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Configure Strategy for {localConfig.name}
            </p>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 p-0 border-4 border-gray-100/70">
            <div className="font-medium text-sm text-gray-700 bg-gray-100/70 p-2">
              Configure Allowed Amount{" "}
            </div>
            <div className="p-2 pt-0 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor={`allowedAmount-${localConfig._id}`}
                  className="w-40 text-gray-600 text-sm"
                >
                  Allowed Amount:
                </label>
                <div>
                  <Input
                    id={`allowedAmount-${localConfig._id}`}
                    type="number"
                    value={localConfig.allowedAmount || ""}
                    onChange={(e) =>
                      setLocalConfig((prev) => ({
                        ...prev,
                        allowedAmount: e.target.value,
                      }))
                    }
                    className="w-20 h-7 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {strategy && (
            <div className="flex flex-col gap-4">
              {/* EMA Section */}
              <div className="flex flex-col gap-2 p-0 border-4 border-gray-100/70">
                <div className="flex items-center gap-1 font-medium text-sm text-gray-700 bg-gray-100/70 p-2">
                  <Checkbox
                    id="ema-enabled"
                    checked={strategy.indicators?.ema?.enabled || false}
                    onClick={() => handleCheck(localConfig.symbol, "ema")}
                    className="mr-1.5"
                  />
                  EMA
                  <span className="text-sm text-gray-500">
                    (Exponential Moving Average)
                  </span>
                </div>
                <div className="p-2 pt-0 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="ema-period"
                      className="w-32 text-gray-600 text-sm"
                    >
                      Period:
                    </label>
                    <div>
                      <Input
                        id="ema-period"
                        type="number"
                        value={strategy.indicators?.ema?.period || ""}
                        onChange={(e) =>
                          setStrategy((prev) => ({
                            ...prev,
                            indicators: {
                              ...prev.indicators,
                              ema: {
                                ...prev.indicators.ema,
                                period: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-20 h-7 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="ema-target"
                      className="w-32 text-gray-600 text-sm"
                    >
                      Target Value:
                    </label>
                    <div>
                      <Input
                        id="ema-target"
                        type="number"
                        value={strategy.indicators?.ema?.targetValue || ""}
                        onChange={(e) =>
                          setStrategy((prev) => ({
                            ...prev,
                            indicators: {
                              ...prev.indicators,
                              ema: {
                                ...prev.indicators.ema,
                                targetValue: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-20 h-7 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* MACD Section */}
              <div className="flex flex-col gap-2 p-0 border-4 border-gray-100/70">
                <div className="flex items-center gap-1 font-medium text-sm text-gray-700 bg-gray-100/70 p-2">
                  <Checkbox
                    id="macd-enabled"
                    checked={strategy.indicators?.macd?.enabled || false}
                    onClick={() => handleCheck(localConfig.symbol, "macd")}
                    className="mr-1.5"
                  />
                  MACD
                  <span className="text-sm text-gray-500">
                    (Moving Average Convergence Divergence)
                  </span>
                </div>
                <div className="p-2 pt-0 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="macd-fastPeriod"
                      className="w-32 text-gray-600 text-sm"
                    >
                      Fast Period:
                    </label>
                    <div>
                      <Input
                        id="macd-fastPeriod"
                        type="number"
                        value={strategy.indicators?.macd?.fastPeriod || ""}
                        onChange={(e) =>
                          setStrategy((prev) => ({
                            ...prev,
                            indicators: {
                              ...prev.indicators,
                              macd: {
                                ...prev.indicators.macd,
                                fastPeriod: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-20 h-7 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="macd-signal"
                      className="w-32 text-gray-600 text-sm"
                    >
                      Signal Period:
                    </label>
                    <div>
                      <Input
                        id="macd-signal"
                        type="number"
                        value={strategy.indicators?.macd?.signalPeriod || ""}
                        onChange={(e) =>
                          setStrategy((prev) => ({
                            ...prev,
                            indicators: {
                              ...prev.indicators,
                              macd: {
                                ...prev.indicators.macd,
                                signalPeriod: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-20 h-7 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* RSI Section */}
              <div className="flex flex-col gap-2 p-0 border-4 border-gray-100/70">
                <div className="flex items-center gap-1 font-medium text-sm text-gray-700 bg-gray-100/70 p-2">
                  <Checkbox
                    id="rsi-enabled"
                    checked={strategy.indicators?.rsi?.enabled || false}
                    onClick={() => handleCheck(localConfig.symbol, "rsi")}
                    className="mr-1.5"
                  />
                  RSI
                  <span className="text-sm text-gray-500">
                    (Relative Strength Index)
                  </span>
                </div>
                <div className="p-2 pt-0 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="rsi-period"
                      className="w-32 text-gray-600 text-sm"
                    >
                      Period:
                    </label>
                    <div>
                      <Input
                        id="rsi-period"
                        type="number"
                        value={strategy.indicators?.rsi?.period || ""}
                        onChange={(e) =>
                          setStrategy((prev) => ({
                            ...prev,
                            indicators: {
                              ...prev.indicators,
                              rsi: {
                                ...prev.indicators.rsi,
                                period: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-20 h-7 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="rsi-overbought"
                      className="w-32 text-gray-600 text-sm"
                    >
                      Overbought:
                    </label>
                    <div>
                      <Input
                        id="rsi-overbought"
                        type="number"
                        value={strategy.indicators?.rsi?.overbought || ""}
                        onChange={(e) =>
                          setStrategy((prev) => ({
                            ...prev,
                            indicators: {
                              ...prev.indicators,
                              rsi: {
                                ...prev.indicators.rsi,
                                overbought: e.target.value,
                              },
                            },
                          }))
                        }
                        className="w-20 h-7 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
