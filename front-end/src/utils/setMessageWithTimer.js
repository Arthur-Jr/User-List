const setMessageWithTime = (message, stateFunc, timer) => {
  stateFunc(message);
  setTimeout(() => {
    stateFunc('');
  }, timer);
};

export default setMessageWithTime;
