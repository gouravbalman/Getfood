/**
 * Determines the current time of day based on the hour.
 * @returns 'Breakfast', 'Lunch', or 'Dinner'.
 */
export function getCurrentTimeOfDay(): 'Breakfast' | 'Lunch' | 'Dinner' {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 11) { // 5 AM to 10:59 AM
    return 'Breakfast';
  } else if (currentHour >= 11 && currentHour < 17) { // 11 AM to 4:59 PM
    return 'Lunch';
  } else { // 5 PM to 4:59 AM
    return 'Dinner';
  }
}
