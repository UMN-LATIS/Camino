export default (...fns) =>
  (initialValue) =>
    fns.reduce((acc, fn) => fn(acc), initialValue);
