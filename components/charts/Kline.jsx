import { useEffect, useState, useCallback } from "react";
import { dispose, init } from "klinecharts";
import { Button } from "@/components/ui/button";
import { IndicatorModal } from "../IndicatorModal";
import { FaChartArea, FaChartBar } from "react-icons/fa";

const CHART_ID = "kline-chart";

const Kline = ({ axis, data }) => {
  const [chart, setChart] = useState(null);
  const [chartType, setChartType] = useState("candle");
  const [primaryIndicators, setPrimaryIndicators] = useState([]);
  const [secondaryIndicators, setSecondaryIndicators] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()}`;
  };

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
            labels: [
              "Date: ",
              "Open: ",
              "Close: ",
              "High: ",
              "Low: ",
              "Volume: ",
            ],
            values: (kLineData) => [
              formatTimestamp(kLineData.timestamp),
              kLineData.open?.toFixed(2) || "--",
              kLineData.close?.toFixed(2) || "--",
              kLineData.high?.toFixed(2) || "--",
              kLineData.low?.toFixed(2) || "--",
              kLineData.volume?.toFixed(2) || "--",
            ],
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
      <div className="flex items-center justify-end gap-2 mb-2">
        <Button onClick={() => setModalOpen(true)}>Manage Indicators</Button>
        <Button onClick={toggleChartType} className="flex items-center">
          {chartType === "candle" ? <FaChartArea /> : <FaChartBar />}
          <span className="ml-1 capitalize">
            {chartType === "candle" ? "Switch to Area" : "Switch to Candle"}
          </span>
        </Button>
      </div>
      <div id={CHART_ID} style={{ height: "85%" }} />

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
