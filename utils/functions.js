export const formatDate = (timestamp) => {
  const date = new Date(timestamp);

  const options = { month: "short" };
  const month = date.toLocaleString("en-US", options);

  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  const time = date.toTimeString().split(" ")[0];
  return `${month} ${day}${suffix}, ${time}`;
};

export const formatDecimal = (value) => {
  return parseFloat(value).toFixed(2);
};

export const getSignal = (signal) => {
  switch (signal.toUpperCase()) {
    case "BUY":
    case "YES":
      return "text-green-500 bg-green-100 border-green-500 border-2 text-center";
    case "SELL":
    case "NO":
      return "text-red-500 bg-red-100 border-red-500 border-2 text-center";
    case "NONE":
      return "text-blue-500 bg-blue-100 border-blue-500 border-2 text-center";
    default:
      return "";
  }
};

{/* <TableCell className="p-2 m-auto">
  <div className={`font-medium px-1 py-0.5 rounded-sm ${getSignal("Yes")}`}>
    YES
  </div>
</TableCell>; */}
