/**
 * Gets the reading speed in minutes.
 *
 * @param text The text of the article.
 * @param cpm (optional) The characters per minute of the reader. Default is 987.
 * @return Object The high and low reading times in minutes (obj.low, obj.high).
 */
function getReadingTimeFromText(text, cpm) {
  if (typeof text != "string") {
    return 0;
  }
  return getReadingTime(text.length, cpm);
}

/**
 * Gets the reading speed in minutes.
 *
 * @param length The length of the article.
 * @param cpm (optional) The characters per minute of the reader. Default is 987.
 * @return Object The high and low reading times in minutes (obj.low, obj.high).
 */
function getReadingTime(length, cpm) {
  if (typeof cpm != "number")
    cpm = 987;
  var cpmVar = 118;
  var cpmLow = cpm - cpmVar;
  var cpmHigh = cpm + cpmVar;

  return {
    low: Math.ceil(length / cpmHigh),
    high: Math.ceil(length / cpmLow)
  };
}

/**
 * Turns the reading time to a string.
 *
 * @param reading_time The reading time object, containing low and high (from the getReadingTime or getReadingTimeFromText methods).
 * @return String The formatted reading time string.
 */
function formatReadingTime(reading_time) {

  if (typeof reading_time != "object" || !('low' in reading_time) || !('high' in reading_time)) {
    return "Unknown";
  }

  if (reading_time.high == reading_time.low) {
    return reading_time.high + " minutes";
  }

  return reading_time.low + " - " + reading_time.high + " minutes";
}

/**
 * Calculates the reading speed in characters per minute.
 *
 * @param text The text of the article.
 * @param time The time in minutes it took to read the article.
 * @return number The reading speed in characters per minute.
 */
function calculateReadingSpeed(text, time) {
  var length = text.length;
  var cpm = length / time;
  return Math.round(cpm);
}
