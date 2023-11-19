export const compareObjects = (a: any, b: any) => {
  if (typeof a !== typeof b) {
    return false;
  }

  if (typeof a !== "object") {
    return a === b;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    const valueA = a[key];
    const valueB = b[key];

    if (!compareObjects(valueA, valueB)) {
      return false;
    }
  }

  return true;
};
