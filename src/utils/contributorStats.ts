// Function to find mean of given array.
const calcMean = (arr: any) => {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) sum = sum + arr[i];
  return sum / arr.length;
};
// Function to find standard deviation of given array.
const calcStandardDeviation = (arr: any) => {
  let sum = 0;
  for (let i = 0; i < arr.length; i++)
    sum = sum + (arr[i] - calcMean(arr)) * (arr[i] - calcMean(arr));
  return Math.sqrt(sum / (arr.length - 1));
};

// Function to find coefficient of variation.
const calcCoefficientOfVariation = (arr: any) => {
  return calcStandardDeviation(arr) / calcMean(arr);
};

export const CodeContributorStats = (
  data: any,
  distributionPercentage: any
) => {
  const newData: any = {};
  const percentage = parseFloat(distributionPercentage);

  let totalCode = 0;
  for (let i = 0; i < data.length; i++) {
    let adds = 0;
    let deletes = 0;
    for (let j = 0; j < data[i].weeks.length; j++) {
      adds += data[i].weeks[j].a;
      deletes += data[i].weeks[j].d;
    }
    newData[data[i].author.login] = adds + deletes;
    totalCode += adds + deletes;
  }
  for (let i = 0; i < data.length; i++) {
    newData[data[i].author.login] =
      (newData[data[i].author.login] / totalCode) * percentage + '%';
  }
  return newData;
};

export const OptionRepoOwner = (
  repoFullName: string,
  contributors: any,
  distributionPercentage: any,
  daoCreator: string
) => {
  const newData: any = {};
  const percentage = parseInt(distributionPercentage);
  let owner = '';
  if (daoCreator === '') {
    owner = repoFullName.split('/')[0];
  } else if (daoCreator !== '') {
    owner = daoCreator;
  }
  for (let i = 0; i < contributors?.length; i++) {
    if (contributors[i].author.login === owner) {
      newData[contributors[i].author.login] = `${percentage}%`;
    } else {
      newData[contributors[i].author.login] = '0%';
    }
  }
  return newData;
};

export const CodeDurationStats = (data: any, distributionPercentage: any) => {
  const newData: any = {};
  const percentage = parseFloat(distributionPercentage);

  let totalCode = 0;

  for (let i = 0; i < data.length; i++) {
    let adds = 0;
    let deletes = 0;
    const contribArray = [];
    for (let j = 0; j < data[i].weeks.length; j++) {
      adds += data[i].weeks[j].a;
      deletes += data[i].weeks[j].d;
      contribArray.push(data[i].weeks[j].a + data[i].weeks[j].d);
    }
    if (isNaN(calcCoefficientOfVariation(contribArray))) {
      newData[data[i].author.login] = adds + deletes;
    } else if (!isNaN(calcCoefficientOfVariation(contribArray))) {
      newData[data[i].author.login] =
        (adds + deletes) / calcCoefficientOfVariation(contribArray);
    }
    totalCode += newData[data[i].author.login];
  }
  for (let i = 0; i < data.length; i++) {
    newData[data[i].author.login] =
      (newData[data[i].author.login] / totalCode) * percentage + '%';
  }
  return newData;
};
