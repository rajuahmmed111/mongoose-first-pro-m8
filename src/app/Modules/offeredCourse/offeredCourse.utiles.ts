import { TSchedule } from './offeredCourse.interface';

export const hasTimeConflict = (
  assignSchedules: TSchedule[],
  newSchedule: TSchedule,
) => {
  for (const schedule of assignSchedules) {
    const existingStartTime = new Date(`2003-07-07T${schedule.startTime}`);
    const existingEndTime = new Date(`2003-07-07T${schedule.endTime}`);
    const newStartTime = new Date(`2003-07-07T${newSchedule.startTime}`);
    const newEndTime = new Date(`2003-07-07T${newSchedule.endTime}`);

    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      console.log('Yes');
      return true;
    }
  }

  return false;
};
