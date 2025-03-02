export function load<T>(key: string) {
  try {
    const value = window.localStorage.getItem(key);
    return value;
  } catch (err) {
    return null;
  }
}

export function save(key: string, value: any) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (err) {
    return false;
  }
}

export function remove(key: string) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (err) {
    return false;
  }
}