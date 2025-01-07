"use client";
import { useEffect, useState } from "react";
import { getCryptoIcon } from "@/utils/functions";
import { coindata } from "@/constants";

export const useConfigurations = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchConfigurations = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/config/get-configs`,
          {
            cache: "no-store",
          }
        );

        if (response.ok) {
          const data = await response.json();

          const mergedData = data.map((item) => {
            const image = getCryptoIcon(item.base.toLowerCase()); // Fetch the image based on the base
            return {
              ...item,
              image,
            };
          });

          setData(mergedData);
        } else {
          console.error("Failed to fetch configurations");
        }
      } catch (error) {
        console.error("Error fetching configurations:", error);
      }
    };

    fetchConfigurations();
  }, []);

  return data;
};
