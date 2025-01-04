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