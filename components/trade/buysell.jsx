import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useFetchBalance } from "@/hooks/usefetchBalance";

const BuySell = ({ symbol }) => {
  const availableAsset = useFetchBalance();
  const [tradeType, setTradeType] = useState("BUY");
  const [quantity, setQuantity] = useState("");

  const isLoading = availableAsset === null;

  const currentAsset = availableAsset?.find(
    (asset) => asset.symbol === symbol?.toUpperCase()
  );

  const currentAssetAmount = isLoading
    ? "Fetching amount..."
    : currentAsset
    ? currentAsset.amount
    : 0;

  const handleTrade = async () => {
    try {
      const endpoint = `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/api/trade/${tradeType.toLowerCase()}`;
      const payload =
        tradeType === "BUY"
          ? { symbol, quantity: parseFloat(quantity) }
          : { symbol };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("An unexpected error occurred.");
      }

      const data = await response.json();
      toast({
        title: `${tradeType} Order Successful`,
        description: `Trade executed successfully. Order ID: ${data.data.orderId}`,
      });
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

          <p className="text-right text-xs font-medium text-gray-400">
            Total Available Amount: {currentAssetAmount}
          </p>
          <div className="mb-6">
            <label htmlFor={`quantity`} className="w-40 text-gray-600 text-sm">
              Quantity:
            </label>
            <Input
              id="quantity"
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full"
            />
          </div>

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
