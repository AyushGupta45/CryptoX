"use client";

import { useEffect, useState, useCallback } from "react";
import { dispose, init } from "klinecharts";
import { IndicatorModal } from "../IndicatorModal";
import { MdCandlestickChart } from "react-icons/md";
import {
  AiOutlineLineChart,
  AiOutlineAreaChart,
  AiOutlineFieldNumber,
  AiOutlineFunction,
  AiOutlinePercentage,
} from "react-icons/ai";

import { coindata } from "@/constants";

const CHART_ID = "kline-chart";

const Kline = ({ data, symbol }) => {
  const [chart, setChart] = useState(null);
  const [chartType, setChartType] = useState("candle");
  const [yAxisType, setYAxisType] = useState("normal");
  const [primaryIndicators, setPrimaryIndicators] = useState([]);
  const [secondaryIndicators, setSecondaryIndicators] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const coinInfo = coindata.find((coin) => coin.symbol === symbol);
  const coinName = coinInfo ? coinInfo.name : "Unknown";

  useEffect(() => {
    const chartInstance = init(CHART_ID);
    setChart(chartInstance);

    return () => {
      dispose(CHART_ID);
    };
  }, []);

  useEffect(() => {
    if (chart && data.length > 0) {
      chart.applyNewData(
        data.map(({ open, close, high, low, volume, timestamp }) => ({
          open,
          close,
          high,
          low,
          volume,
          timestamp,
        }))
      );
    }
  }, [chart, data]);

  useEffect(() => {
    if (chart) {
      chart.setStyleOptions({
        candle: {
          type:
            chartType === "candle"
              ? "candle_solid"
              : chartType === "line"
              ? "line"
              : "area",
          tooltip: {
            labels: ["Open: ", "Close: ", "High: ", "Low: ", "Volume: "],
            values: (kLineData) => {
              return [
                kLineData.open?.toFixed(2) || "--",
                kLineData.close?.toFixed(2) || "--",
                kLineData.high?.toFixed(2) || "--",
                kLineData.low?.toFixed(2) || "--",
                kLineData.volume?.toFixed(2) || "--",
              ];
            },
          },
        },
        yAxis: {
          type: yAxisType,
          tickText: {
            color: "#888888",
          },
        },
        xAxis: {
          tickText: {
            show: false,
          },
        },
      });
    }
  }, [chart, chartType, yAxisType]);

  const updateIndicators = useCallback(() => {
    if (!chart) return;

    const getMainId = () => "candle_pane";

    chart.removeTechnicalIndicator(getMainId());
    primaryIndicators.forEach((indicator) => {
        chart.createTechnicalIndicator(indicator.name, true, { id: getMainId() });
    });

    const secondaryIds = secondaryIndicators.map((indicator) => `sub-${indicator.name}`);
    secondaryIds.forEach((id) => chart.removeTechnicalIndicator(id)); // Ensure all secondary indicators are removed
    secondaryIndicators.forEach((indicator) => {
        chart.createTechnicalIndicator(indicator.name, false, { id: `sub-${indicator.name}` });
    });
}, [chart, primaryIndicators, secondaryIndicators]);


  useEffect(() => {
    if (chart) updateIndicators();
  }, [chart, updateIndicators]);

  const cycleChartType = () => {
    setChartType((prevType) => {
      if (prevType === "candle") return "line";
      if (prevType === "line") return "area";
      return "candle";
    });
  };

  const toggleYAxisType = () => {
    setYAxisType((prevType) =>
      prevType === "normal" ? "percentage" : "normal"
    );
  };

  return (
    <div className="w-full h-full relative">
      <div className="flex items-center justify-between gap-2 mb-2 text-gray-700">
        <h1 className="text-3xl font-bold">{coinName} Chart</h1>
        <div className="flex gap-4">
          <div
            className="flex flex-col justify-center items-center cursor-pointer w-[70px]"
            onClick={() => setModalOpen(true)}
          >
            <AiOutlineFunction size={26} />
            <span className="text-xs">Indicator</span>
          </div>

          <div
            className="flex flex-col justify-center items-center cursor-pointer w-[70px]"
            onClick={cycleChartType}
          >
            {chartType === "candle" && (
              <>
                <MdCandlestickChart size={26} />
                <span className="text-xs">Candle Chart</span>
              </>
            )}
            {chartType === "line" && (
              <>
                <AiOutlineLineChart size={26} />
                <span className="text-xs">Line Chart</span>
              </>
            )}
            {chartType === "area" && (
              <>
                <AiOutlineAreaChart size={26} />
                <span className="text-xs">Area Chart</span>
              </>
            )}
          </div>

          <div
            className="flex flex-col justify-center items-center cursor-pointer w-[70px]"
            onClick={toggleYAxisType}
          >
            {yAxisType === "percentage" ? (
              <>
                <AiOutlinePercentage size={26} />
                <span className="text-xs">Percentage</span>
              </>
            ) : (
              <>
                <AiOutlineFieldNumber size={26} />
                <span className="text-xs">Normal</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div id={CHART_ID} className="h-[93%]" />

      <IndicatorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        primaryIndicators={primaryIndicators}
        setPrimaryIndicators={setPrimaryIndicators}
        secondaryIndicators={secondaryIndicators}
        setSecondaryIndicators={setSecondaryIndicators}
      />
    </div>
  );
};

export default Kline;
