import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDecimal } from "@/utils/functions";
import { coindata } from "@/constants";

const getSignal = (signal) => {
  switch (signal.toUpperCase()) {
    case "BUY":
    case "YES":
      return "text-green-500 bg-green-100 border-green-500";
    case "SELL":
    case "NO":
      return "text-red-500 bg-red-100 border-red-500";
    case "NONE":
      return "text-blue-500 bg-blue-100 border-blue-500";
    default:
      return "";
  }
};

const DataTable = ({ data, symbol }) => {
  const displayedData = data.slice(-12).reverse();
  const coinInfo = coindata.find((coin) => coin.symbol === symbol);
  const coinName = coinInfo ? coinInfo.name : "Unknown";

  return (
    <div>
      <h1 className="text-3xl font-bold mt-1 mb-4 text-gray-700">{coinName} Dataframe</h1>
      <Table className="text-xs border-collapse border border-gray-300">
        <TableHeader>
          <TableRow className="bg-gray-100 border-b border-gray-300">
            <TableHead
              rowSpan={2}
              className="p-2 text-center text-gray-700 font-medium border border-gray-300"
            >
              Price
            </TableHead>
            <TableHead
              rowSpan={2}
              className="p-2 text-center text-gray-700 font-medium border border-gray-300"
            >
              Volume
            </TableHead>
            <TableHead
              colSpan={3}
              className="p-2 text-center text-gray-700 font-medium border border-gray-300"
            >
              MACD
            </TableHead>
            <TableHead
              rowSpan={2}
              className="p-2 text-center text-gray-700 font-medium border border-gray-300"
            >
              RSI
            </TableHead>
            <TableHead
              rowSpan={2}
              className="p-2 text-center text-gray-700 font-medium border border-gray-300"
            >
              EMA
            </TableHead>
            <TableHead
              rowSpan={2}
              className="p-2 text-center text-gray-700 font-medium border border-gray-300"
            >
              Signal
            </TableHead>
          </TableRow>
          <TableRow className="bg-gray-100 border-b border-gray-300">
            <TableHead className="p-2 text-center text-gray-700 font-medium border border-gray-300">
              MACD
            </TableHead>
            <TableHead className="p-2 text-center text-gray-700 font-medium border border-gray-300">
              Signal
            </TableHead>
            <TableHead className="p-2 text-center text-gray-700 font-medium border border-gray-300">
              Histogram
            </TableHead>

          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedData.map((row, index) => (
            <TableRow
              key={index}
              className={`border-b border-gray-300 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <TableCell className="p-2 text-center text-gray-600 border border-gray-300">
                {formatDecimal(row.close)}
              </TableCell>
              <TableCell className="p-2 text-center text-gray-600 border border-gray-300">
                {formatDecimal(row.volume)}
              </TableCell>
              <TableCell className="p-2 text-center text-gray-600 border border-gray-300">
                {row.macd ? formatDecimal(row.macd.MACD) : "N/A"}
              </TableCell>
              <TableCell className="p-2 text-center text-gray-600 border border-gray-300">
                {row.macd ? formatDecimal(row.macd.signal) : "N/A"}
              </TableCell>
              <TableCell className="p-2 text-center text-gray-600 border border-gray-300">
                {row.macd ? formatDecimal(row.macd.histogram) : "N/A"}
              </TableCell>
              <TableCell className="p-2 text-center text-gray-600 border border-gray-300">
                {row.rsi ? formatDecimal(row.rsi) : "N/A"}
              </TableCell>
              <TableCell className="p-2 text-center text-gray-600 border border-gray-300">
                {row.ema ? formatDecimal(row.ema) : "N/A"}
              </TableCell>
              <TableCell className="p-2 m-auto">
                <div
                  className={`font-medium px-1 py-0.5 rounded-sm text-center border ${getSignal(
                    "Yes"
                  )}`}
                >
                  Yes
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
