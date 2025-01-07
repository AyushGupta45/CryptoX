import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FiSettings } from "react-icons/fi";
import MarketSkeleton from "./MarketSkeleton";
import ConfigurationModal from "./ConfigurationModal";

const ConfigurationCards = ({ data: initialData }) => {
  const [data, setData] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const toggleModal = (config) => {
    setSelectedConfig(config);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedConfig(null);
  };

  const handleTradingToggle = async (symbol) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/config/updateConfigTradingEnabled/${symbol}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update trading status");
      }

      setData((prevData) =>
        prevData.map((item) =>
          item.symbol === symbol
            ? { ...item, tradingEnabled: !item.tradingEnabled }
            : item
        )
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  if (!Array.isArray(data)) {
    return <MarketSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item) => (
        <Card key={item._id} className="shadow-lg rounded-lg p-4 w-full">
          <CardHeader className="flex flex-row items-center p-0 mb-3 gap-4 justify-between">
            <div className="flex items-center gap-2">
              <img
                src={item.image}
                alt={item.base}
                className="w-12 h-12 object-contain"
              />
              <div>
                <h3 className="text-lg font-bold">{item.symbol}</h3>
                <p className="text-sm text-gray-500">{`${item.base}`}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Switch
                checked={item.tradingEnabled}
                onCheckedChange={() => handleTradingToggle(item.symbol)}
              />
              <FiSettings
                size={20}
                className="cursor-pointer text-gray-500 hover:text-gray-800"
                onClick={() => toggleModal(item)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor={`minimum-${item._id}`}
                className="text-sm font-medium"
              >
                Minimum
              </label>
              <div>
                <Input
                  id={`minimum-${item._id}`}
                  type="number"
                  value={item.minimum}
                  readOnly
                  className="h-8 w-24 text-sm"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label
                htmlFor={`allowedAmount-${item._id}`}
                className="text-sm font-medium"
              >
                Allowed Amount
              </label>
              <div>
                <Input
                  id={`allowedAmount-${item._id}`}
                  type="number"
                  value={item.allowedAmount}
                  readOnly
                  className="h-8 w-24 text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <ConfigurationModal
        isOpen={modalOpen}
        config={selectedConfig}
        onClose={closeModal}
      />
    </div>
  );
};

export default ConfigurationCards;
