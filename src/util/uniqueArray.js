export const uniqueArray = (arr) => {
  const uniqueIds = [];

  const unique = arr.filter((element) => {
    const isDuplicate = uniqueIds.includes(element.id);

    if (!isDuplicate) {
      uniqueIds.push(element.id);

      return true;
    }

    return false;
  });

  return unique;
};
