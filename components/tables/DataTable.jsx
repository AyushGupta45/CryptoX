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
import { Skeleton } from "../ui/skeleton";

const DataTable = ({ data, symbol }) => {
  const displayedData = data ? data.slice(-7).reverse() : [];
  const coinInfo = coindata.find((coin) => coin.symbol === symbol);
  const coinName = coinInfo ? coinInfo.name : "Unknown";

  return (
    <div>
      {!data || data.length === 0 ? (
        <div className="flex justify-center items-center">
          <Skeleton className="w-[350px] h-[325px]" />
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mt-1 mb-4 text-gray-700">
            {coinName} Dataframe
          </h1>
          <Table className="w-[350px] text-xs border-collapse border border-gray-300">
            <TableHeader>
              <TableRow className="bg-gray-100 border-b border-gray-300">
                <TableHead className="p-2 text-center text-gray-700 font-medium border border-gray-300">
                  Open
                </TableHead>
                <TableHead className="p-2 text-center text-gray-700 font-medium border border-gray-300">
                  High
                </TableHead>
                <TableHead className="p-2 text-center text-gray-700 font-medium border border-gray-300">
                  Low
                </TableHead>
                <TableHead className="p-2 text-center text-gray-700 font-medium border border-gray-300">
                  Close
                </TableHead>
                <TableHead className="p-2 text-center text-gray-700 font-medium border border-gray-300">
                  Volume
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
                    {formatDecimal(row.open)}
                  </TableCell>
                  <TableCell className="p-2 text-center text-gray-600 border border-gray-300">
                    {formatDecimal(row.high)}
                  </TableCell>
                  <TableCell className="p-2 text-center text-gray-600 border border-gray-300">
                    {formatDecimal(row.low)}
                  </TableCell>
                  <TableCell className="p-2 text-center text-gray-600 border border-gray-300">
                    {formatDecimal(row.close)}
                  </TableCell>
                  <TableCell className="p-2 text-center text-gray-600 border border-gray-300">
                    {formatDecimal(row.volume)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};

export default DataTable;
