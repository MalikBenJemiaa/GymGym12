function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}
formatDate = (date) => {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join("-") +
    " " +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(":")
  );
};
addMonth = (a) => {
  const dateString = formatDate(new Date());
  const date = new Date(dateString);

  // add one month to the date
  date.setMonth(date.getMonth() + a);

  // format the date back into the original string format
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  // console.log(formattedDate);
  return formattedDate; // outputs '2023-06-06 18:16:48'
};
addMonthToMyDate = (a, b) => {
  const dateString = b;
  const date = new Date(dateString);

  // add one month to the date
  date.setMonth(date.getMonth() + a);

  // format the date back into the original string format
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  // console.log(formattedDate);
  return formattedDate; // outputs '2023-06-06 18:16:48'
};
dayWithoutTime = () => {
  const dateTimeString = formatDate(new Date());
  const date = new Date(dateTimeString);
  const dateString = date.toISOString().slice(0, 10);
  // console.log(dateString); // Outputs '2023-05-06'
  return dateString;
};
module.exports = {
  formatDate,
  addMonth,
  dayWithoutTime,
  addMonthToMyDate,
};
