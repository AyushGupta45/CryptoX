import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ThreeDots } from "react-loader-spinner";
import { formatDecimal } from "@/utils/functions";

const AssetsTable = ({ balance }) => {
  if (!Array.isArray(balance)) {
    return (
      <div className="w-full h-[98%] flex justify-center items-center">
        <ThreeDots
          visible={true}
          height="100"
          width="100"
          color="#4fa94d"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-700">Balance</h1>
      <p className="text-xs text-gray-400 mb-2">Current Balance</p>
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
