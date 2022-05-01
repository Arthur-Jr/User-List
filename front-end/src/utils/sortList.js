const sortList = (listToSort, sequence) => {
  const sortedList = listToSort.sort((a, b) => {
    const aKey = Object.values(a)[1].length === 11 ? 'cpf' : 'cnpj';
    const bKey = Object.values(b)[1].length === 11 ? 'cpf' : 'cnpj';

    if (sequence === 'asc') {
      return a[aKey] - b[bKey];
    }

    return b[aKey] - a[bKey];
  });
  return sortedList;
};

export default sortList;
