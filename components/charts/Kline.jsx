import { useEffect, useState, useCallback } from "react";
import { dispose, init } from "klinecharts";
import { IndicatorModal } from "../IndicatorModal";
import { FaRegChartBar } from "react-icons/fa";
import { MdCandlestickChart, MdAreaChart } from "react-icons/md";
import { coindata } from "@/constants";

const CHART_ID = "kline-chart";

const Kline = ({ axis, data, symbol }) => {
  const [chart, setChart] = useState(null);
  const [chartType, setChartType] = useState("candle");
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
          type: chartType === "candle" ? "candle_solid" : "area",
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
          type: axis,
          tickText: {
            color: "#888888",
          },
        },
        xAxis: {
          tickText: {
            color: "#888888",
          },
        },
      });
    }
  }, [chart, chartType, axis]);

  const updateIndicators = useCallback(() => {
    if (!chart) return;

    const getSubId = (type) => `sub-${type}`;
    const getMainId = () => "candle_pane";

    chart.removeTechnicalIndicator(getMainId());
    primaryIndicators.forEach((indicator) => {
      chart.createTechnicalIndicator(indicator.name, true, { id: getMainId() });
    });

    chart.removeTechnicalIndicator(getSubId());
    secondaryIndicators.forEach((indicator) => {
      chart.createTechnicalIndicator(indicator.name, false, {
        id: getSubId(indicator.name),
      });
    });
  }, [chart, primaryIndicators, secondaryIndicators]);

  useEffect(() => {
    if (chart) updateIndicators();
  }, [chart, updateIndicators]);

  const toggleChartType = () => {
    setChartType((prevType) => (prevType === "candle" ? "area" : "candle"));
  };

  return (
    <div className="w-full h-full relative">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="text-2xl font-bold">{coinName} chart</div>
        <div className="flex gap-4">
          <div
            className="flex flex-col justify-center items-center"
            onClick={() => setModalOpen(true)}
          >
            <FaRegChartBar size={26} className="cursor-pointer" />
            <span className="text-xs">Indicator</span>
          </div>

          <div className="flex flex-col justify-center items-center">
            {chartType === "candle" ? (
              <div
                className="flex flex-col justify-center items-center"
                onClick={toggleChartType}
              >
                <MdAreaChart size={26} className="cursor-pointer" />
                <span className="text-xs">Area chart</span>
              </div>
            ) : (
              <div
                className="flex flex-col justify-center items-center"
                onClick={toggleChartType}
              >
                <MdCandlestickChart size={26} className="cursor-pointer" />
                <span className="text-xs">Candle chart</span>
              </div>
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
