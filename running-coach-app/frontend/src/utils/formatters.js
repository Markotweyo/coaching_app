/**
 * Formats a pace value (in seconds per kilometer) to MM:SS format
 * @param {number} pace - Pace in seconds per kilometer
 * @returns {string} Formatted pace string (e.g., "5:30")
 */
export const formatPace = (pace) => {
  if (!pace) return '0:00';
  
  const minutes = Math.floor(pace / 60);
  const seconds = Math.floor(pace % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Formats a distance value (in kilometers) to a string with 1 decimal place
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance string (e.g., "5.2")
 */
export const formatDistance = (distance) => {
  if (!distance) return '0.0';
  return distance.toFixed(1);
};

/**
 * Formats a duration value (in seconds) to HH:MM:SS format
 * @param {number} duration - Duration in seconds
 * @returns {string} Formatted duration string (e.g., "1:30:00")
 */
export const formatDuration = (duration) => {
  if (!duration) return '0:00:00';
  
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Formats a date to a localized string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
}; 