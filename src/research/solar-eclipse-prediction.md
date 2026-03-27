---
title: Solar Eclipse Prediction
summary: A simple method to efficiently predict locally visible solar eclipses, designed to be run on a smartphone.
date: 2026-03-27
category: trail-sense
---

Solar eclipse prediction at a given location can be a computationally expensive task and is normally done on a server rather than on a smartphone. I wanted to have offline, on-device solar eclipse prediction in the Trail Sense application, so I had to come up with my own approach.

In the simplest definition, a solar eclipse is when the moon passes between the sun and the earth and the shadow is cast onto the observer. If you were to look at the sun during an eclipse (with special glasses), you would see the moon overlapping the sun. The amount of overlap determines how "strong" the eclipse is, and it is possible for the moon to completely cover the sun in a total eclipse. So from a high level, all we need to know is if the moon is overlapping the sun in the sky to determine if a solar eclipse is occurring.

For a given point in time, it is possible to calculate the positions of the sun and moon in the sky for an observer and from that determine their angular distance and magnitude of the eclipse (overlap). [1] [[2](https://doi.org/10.11578/dc.20190909.1)] I won't go into the details of these calculations, but you can check out the references to see how they work.

The naive approach would be to determine the sun and moon's positions in the sky at every point in time to see if they overlap, which would take forever to run. So we need to be more selective about when we check for overlap by eliminating times when an eclipse would be impossible. Luckily, there is already an algorithm in existence which can tell you roughly when the next solar eclipse is occurring somewhere (it doesn't tell you where, though). I won't go into detail about that algorithm, but it is from the Astronomical Algorithms book by Meeus. [1]

So using that algorithm, we can determine when the next solar eclipse is occurring at some place on Earth. We now need to determine if it is visible to the observer, which we can do by calculating the magnitude of the eclipse for the observer's location, using the algorithms mentioned previously. For a partial eclipse, the observer may only see the eclipse for a short period of time, so just checking the peak time may lead to missed eclipses. I use the following algorithm to determine the next eclipse that is visible to the observer:

<code>time = now
while time < maxDuration:
    peak = getNextEclipsePeak(time)
    for searchTime in [peak - 3 hours, peak + 3 hours]:
        if sun is set:
            continue
        if moon is set:
            continue
        if magnitude > 0:
            return searchTime
        searchTime += minutes(15)
    time = peak + 10 days
return NONE
</code>

If that returns a value, then I know at least one time that the eclipse is visible for the observer and can conduct a more detailed search to find the start, end, and peak times. To find the start and end times, we can take the known eclipse visible time and search backwards (for start) and forwards (for end) until the magnitude is 0 or the sun or moon is set. Once we know the start and end times, we can search for the peak, which will be sometime between the two. I use the following algorithms:

<code>function isEclipseVisible(time):
    if sun is set:
        return false
    if moon is set:
        return false
    if magnitude > 0:
        return true
    return false
</code>

For efficiency, I used binary search, but any search algorithm can be used. The following assumptions can be made to constrain the search:

- Eclipse is not visible at minTime or maxTime
- Eclipse is visible at eclipseTime (this is the known visible time we determined earlier)

<code>minTime = eclipseTime - 6 hours
maxTime = eclipseTime + 6 hours
// Use binary search to find when it goes from false to true
start = binarySearchRising(minTime, eclipseTime, precision, (time) => isEclipseVisible(time))
// Use binary search to find when it goes from true to false
end = binarySearchFalling(eclipseTime, maxTime, precision, (time) => isEclipseVisible(time))
// Use binary search to find the peak magnitude
peak = binarySearchPeak(start, end, precision, (time) => magnitude(time))
</code>

The end result is an algorithm that can find the next solar eclipse for an observer, usually in under a second, with results matching the NASA eclipse catalog. For reference, if the search was started on 2023-10-15 for a location in the northeast US, it would find the eclipse on 2024-04-08 with a precision of 1 minute in 110 iterations (across 176 days).

## References
1. Meeus, J. (1998, January 1). Astronomical Algorithms.
2. Reda, I. (2010, March). Solar Eclipse Monitoring for Solar Energy Applications Using the Solar and Moon Position Algorithms. Retrieved from [https://doi.org/10.11578/dc.20190909.1](https://doi.org/10.11578/dc.20190909.1)