import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useFetchBalance } from "@/hooks/usefetchBalance";
import { formatDecimal } from "@/utils/functions";

const BuySell = ({ symbol }) => {
  const availableAsset = useFetchBalance();
  const [tradeType, setTradeType] = useState("BUY");
  const [quantity, setQuantity] = useState("");
  const [currentAssetAmount, setCurrentAssetAmount] = useState(null);

  const isLoading = availableAsset === null;

  useEffect(() => {
    if (!isLoading) {
      const asset = availableAsset?.find(
        (asset) => asset.symbol === symbol?.toUpperCase()
      );
      setCurrentAssetAmount(asset ? asset.amount : 0);
    }
  }, [availableAsset, isLoading, symbol]);

  const handleTrade = async () => {
    try {
      const endpoint = `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/api/trade/${tradeType.toLowerCase()}`;

      const payload = { symbol };
      if (tradeType === "BUY") {
        const tradeQuantity = parseFloat(quantity);
        if (!tradeQuantity || tradeQuantity <= 0) {
          throw new Error("Enter a valid quantity to buy.");
        }
        payload.quantity = tradeQuantity;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "An unexpected error occurred.");
      }

      const data = await response.json();
      setQuantity("");
      toast({
        title: `${tradeType} Order Successful`,
        description: `Trade executed successfully. Order ID: ${data.data.orderId}`,
      });

      if (tradeType === "BUY") {
        setCurrentAssetAmount((prev) => prev + parseFloat(payload.quantity));
      } else if (tradeType === "SELL") {
        setCurrentAssetAmount(0); // Since we're selling all
      }
    } catch (error) {
      console.error("Error during trade:", error);

      toast({
        title: `${tradeType} Order Failed`,
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Card className="w-full shadow-lg pt-6">
        <CardContent>
          <div className="flex justify-center items-center mb-6">
            <div className="flex items-center gap-4 w-full">
              <Button
                onClick={() => setTradeType("BUY")}
                className={`w-full text-base py-5 ${
                  tradeType === "BUY"
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-200 text-gray-700 hover:bg-slate-300"
                }`}
              >
                Buy
              </Button>
              <Button
                onClick={() => setTradeType("SELL")}
                className={`w-full text-base py-5 ${
                  tradeType === "SELL"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Sell
              </Button>
            </div>
          </div>

          <div className="flex justify-end text-xs font-medium text-gray-400 mb-2">
            <p>Available: {isLoading ? "..." : formatDecimal(currentAssetAmount, 4)}</p>
          </div>

          {/* Show quantity input only for Buy */}
          {tradeType === "BUY" && (
            <div className="mb-6 flex justify-center items-center gap-2">
              <label htmlFor="quantity" className="text-gray-600 text-sm">
                Quantity:
              </label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full h-8"
              />
            </div>
          )}

          {/* Place Order Button */}
          <Button
            onClick={handleTrade}
            className={`w-full py-5 ${
              tradeType === "BUY"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            Place {tradeType} Order
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuySell;
