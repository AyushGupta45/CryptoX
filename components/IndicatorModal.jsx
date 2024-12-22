import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PrimaryIndicators, SecondaryIndicators } from "@/constants";

export const IndicatorModal = ({
  open,
  onClose,
  primaryIndicators,
  setPrimaryIndicators,
  secondaryIndicators,
  setSecondaryIndicators,
}) => {
  const [search, setSearch] = useState("");

  const filteredPrimaryIndicators = PrimaryIndicators.filter((indicator) =>
    indicator.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSecondaryIndicators = SecondaryIndicators.filter((indicator) =>
    indicator.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleIndicator = (indicator, type) => {
    const isSelected =
      type === "primary"
        ? primaryIndicators.some((item) => item.name === indicator.name)
        : secondaryIndicators.some((item) => item.name === indicator.name);

    const updated = isSelected
      ? type === "primary"
        ? primaryIndicators.filter((item) => item.name !== indicator.name)
        : secondaryIndicators.filter((item) => item.name !== indicator.name)
      : type === "primary"
      ? [...primaryIndicators, indicator]
      : [...secondaryIndicators, indicator];

    type === "primary"
      ? setPrimaryIndicators(updated)
      : setSecondaryIndicators(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Indicators</DialogTitle>
          <DialogDescription>Select indicators..</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Search indicators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="max-h-96 overflow-y-auto">
            <div className="">
              <h3 className="font-semibold mb-2">Primary Indicators</h3>
              {filteredPrimaryIndicators.map((indicator) => (
                <div
                  key={indicator.name}
                  className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50 px-2 rounded"
                  onClick={() => toggleIndicator(indicator, "primary")}
                >
                  <Checkbox
                    checked={primaryIndicators.some(
                      (item) => item.name === indicator.name
                    )}
                  />

                  <div className="flex justify-center items-center">
                    <p className="font-medium">
                      {indicator.name}{" "}
                      <span className="text-sm text-gray-500">
                        ({indicator.description})
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Secondary Indicators</h3>
              {filteredSecondaryIndicators.map((indicator) => (
                <div
                  key={indicator.name}
                  className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50 px-2 rounded"
                  onClick={() => toggleIndicator(indicator, "secondary")}
                >
                  <Checkbox
                    checked={secondaryIndicators.some(
                      (item) => item.name === indicator.name
                    )}
                  />

                  <div className="flex justify-center items-center">
                    <p className="font-medium">
                      {indicator.name}{" "}
                      <span className="text-sm text-gray-500">
                        ({indicator.description})
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
