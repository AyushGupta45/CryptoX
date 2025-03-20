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
  const completedTrades = trades.filter(
    (trade) => trade.entry !== null && trade.exit !== null
  );
  const displayedTrades = [...completedTrades].reverse();

  return (
    <div>
      <Table className="text-sm border-collapse border border-gray-300 w-full">
        <TableHeader>
          <TableRow className="bg-gray-100 border-b border-gray-300">
            <TableHead className="p-2 text-start text-gray-700 font-medium border border-gray-300">
              Symbol
            </TableHead>
            <TableHead className="p-2 text-start text-gray-700 font-medium border border-gray-300">
              Entry
            </TableHead>
            <TableHead className="p-2 text-start text-gray-700 font-medium border border-gray-300">
              Exit
            </TableHead>
            <TableHead className="p-2 text-start text-gray-700 font-medium border border-gray-300">
              Quantity
            </TableHead>
            <TableHead className="p-2 text-start text-gray-700 font-medium border border-gray-300">
              Investment
            </TableHead>
            <TableHead className="p-2 text-start text-gray-700 font-medium border border-gray-300">
              Timestamp
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {displayedTrades.length > 0 ? (
            displayedTrades.map((trade, index) => (
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
                  {formatDecimal(trade.entry, 4)}
                </TableCell>

                <TableCell className="p-2 text-gray-600 border border-gray-300">
                  {formatDecimal(trade.exit, 4)}
                </TableCell>

                <TableCell className="p-2 text-gray-600 border border-gray-300">
                  {formatDecimal(trade.quantity, 4)}
                </TableCell>

                <TableCell className="p-2 text-gray-600 border border-gray-300">
                  {trade.investment ? formatDecimal(trade.investment, 3) : "-"}
                </TableCell>

                <TableCell className="p-2 text-gray-600 border border-gray-300">
                  {formatDate(trade.updatedAt)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan="6"
                className="text-center p-4 text-gray-500 border border-gray-300"
              >
                No completed trades available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TradesTable;
