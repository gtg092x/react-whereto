export const parseRoute = (route) => {
  const parts = route.split('!');
  const path = parts.pop();
  const exact = parts.some(p => p === 'exact');
  const strict = parts.some(p => p === 'strict');
  return {
    path,
    exact,
    strict,
  };
};

export const isFunction = obj => !!(obj && obj.constructor && obj.call && obj.apply);

export const isString = val => typeof val === 'string' || val instanceof String;
