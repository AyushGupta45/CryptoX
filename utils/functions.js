export const formatDate = (timestamp) => {
  const date = new Date(timestamp);

  const options = { month: "short" };
  const month = date.toLocaleString("en-US", options);

  const day = date.getDate();
  const year = date.getFullYear();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${month} ${day}${suffix}, ${year}`;
};

export const formatDecimal = (value, places = 2) => {
  return parseFloat(value).toFixed(places);
};

export const getCryptoIcon = (asset) => {
  return `https://www.cryptofonts.com/img/icons/${asset}.svg`;
};
