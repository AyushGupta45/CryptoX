import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDecimal, getSignal } from "@/utils/functions";
import { coindata } from "@/constants";

const DataTable = ({ data, symbol }) => {
  const displayedData = data.slice(-15).reverse();
  const coinInfo = coindata.find((coin) => coin.symbol === symbol);
  const coinName = coinInfo ? coinInfo.name : "Unknown";

  return (
    <div>
      <h1 className="text-3xl font-bold -mt-4 mb-3">{coinName} Dataframe</h1>
      <Table className="">
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
    </div>
  );
};

export default DataTable;
