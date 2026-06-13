export const dateConvertor = (date: string, slot: string) => {
  const dateObj = new Date();
  let year = Number(date.slice(0, 4));
  let month = Number(date.slice(5, 7));
  let day = Number(date.slice(8, 10));
  // console.log("Year = " + year + " object year = " + dateObj.getFullYear());
  // console.log(
  //   "Month = " + (month - 1) + " object month = " + dateObj.getMonth(),
  // );
  // console.log("Day = " + day + " object day = " + dateObj.getDate());
  if (year < dateObj.getFullYear()) {
    return true;
  }
  if (year == dateObj.getFullYear()) {
    if (month - 1 < dateObj.getMonth()) {
      return true;
    }
    if (month - 1 == dateObj.getMonth()) {
      if (day < dateObj.getDate()) {
        return true;
      }
      if (day == dateObj.getDate()) {
        // let startSlot = Number(slot.slice(0, 2));
        // let startMinutes = Number(slot.slice(3, 5));
        let endSlot = Number(slot.slice(8, 10));
        //console.log(`End Slot : ${endSlot}`);
        let endMinutes = Number(slot.slice(11, 13));
        //console.log(`End minutes : ${endMinutes}`);
        if (dateObj.getHours() > endSlot) {
          return true;
        }
        if (dateObj.getHours() == endSlot) {
          if (dateObj.getMinutes() >= endMinutes) {
            return true;
          }
        }
      }
    }
  }
  return false;
};
