const asc = (listToSort) => {
  const sortedList = listToSort.sort((a, b) => {
    if (a.user > b.user) {
      return 1;
    }

    if (a.user < b.user) {
      return -1;
    }

    return 0;
  });
  return sortedList;
};

const desc = (listToSort) => {
  const sortedList = listToSort.sort((a, b) => {
    if (b.user > a.user) {
      return 1;
    }

    if (b.user < a.user) {
      return -1;
    }

    return 0;
  });
  return sortedList;
};

const sortList = (listToSort, sequence) => {
  if (sequence === 'asc') {
    return asc(listToSort);
  }

  return desc(listToSort);
};

export default sortList;
