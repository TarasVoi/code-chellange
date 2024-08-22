//Implementation A: Using Array and reduce
var sum_to_n_a = function (n) {
  if (n <= 0) {
    return 0;
  }
  return Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a + b, 0);
};

//Implementation B: Using Proxy
var sum_to_n_b = function (n) {
  const handler = {
    get: function (target, prop) {
      if (prop === "value") {
        return target.reduce((sum, num) => sum + num, 0);
      }
      return Reflect.get(...arguments);
    },
  };

  const numbers = new Proxy(
    [...Array(n).keys()].map((i) => i + 1),
    handler
  );
  return numbers.value;
};

// Implementation C: Using the Formula for the Sum of the First n Natural Numbers
var sum_to_n_c = function (n) {
  if (n <= 0) {
    return 0;
  }
  return (n * (n + 1)) / 2;
};
