"use client";

import React from "react";

const MarketPage = ({ params: { slug } }) => {
  
  return (
    <div>
      <h1>{slug.toUpperCase()} Chart</h1>
    </div>
  );
};

export default MarketPage;
