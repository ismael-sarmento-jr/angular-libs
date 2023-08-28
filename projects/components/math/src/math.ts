/**
 * @param range an exclusive upper bound number. eg: range equals 10 means getting random number between 0 and 9 inclusive.
 * @param numberOfElements how many pseudorandom numbers should be picked from within the set.
 */
export const getRandomDistinctIndexes = (range, numberOfElements) => {
  if(range < numberOfElements) {
    throw Error('Range cannot be smaller than number of elements requested');
  }
  const indexes = [...Array(range).keys()];
  const randomIndexes = [];
  while(randomIndexes.length < numberOfElements) {
    const factor = Math.pow(10, Math.floor(indexes.length/10) + 1);
    const index = Math.floor(Math.random()*factor/indexes.length);
    randomIndexes.push(...indexes.splice(index, 1));
  }
  return randomIndexes;
};

export const randomColor = () => Math.floor(Math.random()*16777215).toString(16);
