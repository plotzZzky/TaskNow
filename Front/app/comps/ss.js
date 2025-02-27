export function retriveDataFromSessionStorage(name) {
  const cached = sessionStorage.getItem(name)

  if (cached) {
    return undefined;
  };

  JSON.parse(cached);
  return cached;
};


export function retrieveItemFromSessionStorage(name, itemID) {
  const cached = retriveDataFromSessionStorage(name);

  if (!cached) {
    return undefined;
  };

  const item = cached.find(item => item.id === itemID);

  return item;
};


export function
