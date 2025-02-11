import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatDecimal } from "@/utils/functions";

const TradesTable = ({ trades }) => {
  const displayedTrades = trades ? [...trades].reverse() : [];
  return (
    <div>
      <Table className="text-sm border-collapse border border-gray-300">
        <TableHeader>
          <TableRow className="bg-gray-100 border-b border-gray-300">
            <TableHead className="p-2 text-start text-gray-700 font-medium border border-gray-300">
              Symbol
            </TableHead>
            <TableHead className="p-2 text-start text-gray-700 font-medium border border-gray-300">
              Action
            </TableHead>
            <TableHead className="p-2 text-start text-gray-700 font-medium border border-gray-300">
              Price (USDT)
            </TableHead>
            <TableHead className="p-2 text-start text-gray-700 font-medium border border-gray-300">
              Quantity
            </TableHead>
            <TableHead className="p-2 text-start text-gray-700 font-medium border border-gray-300">
              Timestamp
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {displayedTrades.map((trade, index) => (
            <TableRow
              key={index}
              className={`border-b border-gray-300 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <TableCell className="p-2 text-gray-600 border border-gray-300">
                {trade.symbol}
              </TableCell>
              <TableCell className="p-2 text-gray-600 border border-gray-300">
                {trade.action}
              </TableCell>
              <TableCell className="p-2 text-gray-600 border border-gray-300">
                {formatDecimal(trade.price, 2)}
              </TableCell>
              <TableCell className="p-2 text-gray-600 border border-gray-300">
                {formatDecimal(trade.quantity, 4)}
              </TableCell>
              <TableCell className="p-2 text-gray-600 border border-gray-300">
                {formatDate(trade.timestamp)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TradesTable;
