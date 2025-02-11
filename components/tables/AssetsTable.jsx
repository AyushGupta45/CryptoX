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

const AssetsTable = ({ balance }) => {
  return (
    <div>
      <Table className="text-sm border-collapse border border-gray-300">
        <TableHeader>
          <TableRow className="bg-gray-100 border-b border-gray-300">
            <TableHead className="p-2 text-start text-gray-700 font-medium border border-gray-300">
              Asset
            </TableHead>
            <TableHead className="p-2 text-start text-gray-700 font-medium border border-gray-300">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {balance.map((row, index) => (
            <TableRow
              key={index}
              className={`border-b border-gray-300 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <TableCell className="p-2 text-gray-600 border border-gray-300">
                <div className="flex flex-row justify-start items-center gap-3">
                  <img
                    src={row.image}
                    alt={row.name}
                    className="w-7 h-7 object-contain"
                  />
                  <p>{row.asset}</p>
                </div>
              </TableCell>
              <TableCell className="p-2 text-start text-gray-600 border border-gray-300">
                {formatDecimal(row.amount, 3)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssetsTable;
