export const convertExpiry = ({ amount, measure }) => {
  let addition = 0;
  if (measure === 'day') {
    addition = amount * 86400000;
  } else if (measure === 'week') {
    addition = amount * 604800000;
  } else if (measure === 'year') {
    addition = amount * 31536000000;
  }
  const date = new Date();
  date.setHours(0);
  date.setSeconds(0);
  date.setMinutes(0);
  date.setMilliseconds(0);

  return date.getTime() + addition;
};

export const checkExpiry = expiry => {
  const date = new Date();
  date.setHours(0);
  date.setSeconds(0);
  date.setMinutes(0);
  date.setMilliseconds(0);
  if (expiry >= date.getTime()) return false;
  return true;
};

export const getCurrentTime = () => {
  const date = new Date();
  date.setHours(0);
  date.setSeconds(0);
  date.setMinutes(0);
  date.setMilliseconds(0);
  return date.getTime();
}

export const addToObject = (object, property) => {
  const key = Object.keys(property);
  object[key[0]] = property[key];
  return object;
};