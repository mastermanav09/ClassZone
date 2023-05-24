let FnArray = [];

export const closeUIComponents = () => {
  for (let fn of FnArray) {
    fn(false);
  }

  FnArray = [];
};

export const registerForUIToggle = (fn) => {
  FnArray.push(fn);
};
