"use client"

import AssetsTable from "@/components/tables/AssetsTable";
import React from "react";
import { useFetchBalance } from "@/hooks/usefetchBalance";

const Portfolio = () => {
  const balance  = useFetchBalance();

  return (
    <div>
      <AssetsTable className="overflow-auto" balance={balance} />
    </div>
  );
};

export default Portfolio;
