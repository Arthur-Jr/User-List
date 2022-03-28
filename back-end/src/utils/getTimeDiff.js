module.exports = (oldDate, newDate) => {
  const milliseconds = newDate - oldDate;
  const hour = Math.floor(milliseconds / 3600000);
  const min = Math.floor((milliseconds % 3600000) / 60000);
  const seconds = Math.floor(((milliseconds % 3600000) % 60000) / 1000);

  const hourString = String(hour).padStart(2, '0');
  const minString = String(min).padStart(2, '0');
  const secondsString = String(seconds).padStart(2, '0');

  return `${hourString}:${minString}:${secondsString}`;
};
