export const addDays = (date, days) => {
  date.setDate(date.getDate() + days)
  return date
}
