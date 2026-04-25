export const getDate = (data: Date | string) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const _ = new Date(data);
  const date = _.getDate();
  const month = _.getMonth();
  const year = _.getFullYear();
  return `${months[month]} ${date},${year}`;
};

export const getRandomColor = () => {
  return (
    "hsl(" +
    360 * Math.random() +
    "," +
    (25 + 70 * Math.random()) +
    "%," +
    (65 + 10 * Math.random()) +
    "%)"
  );
};