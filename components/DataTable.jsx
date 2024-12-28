import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatDecimal, getSignal } from "@/utils/functions";

const DataTable = ({ data, symbol }) => {
  const displayedData = data.slice(-5).reverse();
  return (
    <Table className="">
      <TableCaption className="text-lg font-semibold text-gray-700 mb-4">
        {symbol} DataFrame
      </TableCaption>
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead className="p-2 text-center text-gray-700 font-medium">
            Price
          </TableHead>
          <TableHead className="p-2 text-center text-gray-700 font-medium">
            Volume
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayedData.map((row, index) => (
          <TableRow key={index}>
            <TableCell className="p-2 text-center text-gray-600">
              {formatDecimal(row.close)}
            </TableCell>
            <TableCell className="p-2 text-center text-gray-600">
              {formatDecimal(row.volume)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;
