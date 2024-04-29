const getNumberOfTasks = async (array) => {
  let total = 0;
  for (const task of array) {
    total++;
  }

  return total;
};

const getNumberOfCompletedTasks = async (array) => {
  let completedTotal = 0;
  for (const task of array) {
    if (task.isCompleted == true) completedTotal++;
  }

  return completedTotal;
};

const getDaysBetweenDates = (dateFromDB) => {
  let dateNow = new Date();

  dateNow.setHours(0, 0, 0, 0);

  let Difference_In_Time = dateNow.getTime() - dateFromDB.getTime();

  // To calculate the no. of days between two dates
  let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
  return Difference_In_Days;
};

module.exports = {
  getNumberOfCompletedTasks,
  getNumberOfTasks,
  getDaysBetweenDates,
};
