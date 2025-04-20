export const loadFromLocalStorage = (key: string, defaultValue: [] | number) => {
  const savedData = localStorage.getItem(key)
  return savedData ? JSON.parse(savedData) : defaultValue
}
