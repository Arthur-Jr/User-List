const sortList = (listToSort, keyName) => {
  const sortedList = listToSort.sort((a, b) => a[keyName] - b[keyName]);
  return sortedList;
};

export default sortList;
