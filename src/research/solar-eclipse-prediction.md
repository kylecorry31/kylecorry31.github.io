---
title: Solar Eclipse Prediction
summary: A simple method to efficiently predict locally visible solar eclipses, designed to be run on a smartphone.
date: 2026-03-27
category: trail-sense
---

Solar eclipse prediction at a given location can be a computationally expensive task and is normally done on a server rather than on a smartphone. Trail Sense uses a custom algorithm to enable fast and accurate offline eclipse prediction.

![Solar eclipse](/assets/images/photos/eclipse-1.webp)

## Solar Eclipses

In the simplest definition, a solar eclipse is when the moon passes between the sun and the Earth and a shadow is cast onto the observer. If you were to look at the sun during an eclipse (with special glasses), you would see the moon overlapping the sun. The amount of overlap determines how "strong" the eclipse is, and it is possible for the moon to completely cover the sun in a total eclipse.

## Algorithm

For a given point in time, it is possible to calculate the positions of the sun and moon in the sky for an observer. From that, the angular distance and magnitude of overlap (if any) can be calculated.<sup>[1] [[2](https://doi.org/10.11578/dc.20190909.1)]</sup>

The naive approach would be to determine the sun and moon's positions in the sky at every point in time to see if they overlap, which would be inefficient. A more efficient algorithm would only check for overlap when an eclipse is possible. The Astronomical Algorithms book covers an algorithm to find the next eclipse that will occur anywhere on Earth, which can be used as a starting point.<sup>[1]</sup>

The next eclipse algorithm provides a time when an eclipse is occurring on the Earth. To determine if the eclipse is visible for the observer, the algorithm needs to calculate the magnitude of the eclipse for several points around the calculated time.

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

If any of the magnitudes are greater than zero, then an eclipse is visible to the observer, and the exact timing can be fine-tuned using a search for start, end, and peak. Trail Sense uses binary search to find these times. The following assumptions can be made to constrain the search:

- Eclipse is not visible at minTime or maxTime
- Eclipse is visible at eclipseTime (this is the known visible time we determined earlier)

<code>function isEclipseVisible(time):
    if sun is set:
        return false
    if moon is set:
        return false
    if magnitude > 0:
        return true
    return false
</code>

<code>minTime = eclipseTime - 6 hours
maxTime = eclipseTime + 6 hours
// Use binary search to find when it goes from false to true
start = binarySearchRising(minTime, eclipseTime, precision, (time) => isEclipseVisible(time))
// Use binary search to find when it goes from true to false
end = binarySearchFalling(eclipseTime, maxTime, precision, (time) => isEclipseVisible(time))
// Use binary search to find the peak magnitude
peak = binarySearchPeak(start, end, precision, (time) => magnitude(time))
</code>

## Results

This algorithm can find the next solar eclipse for a given observer, usually in under a second, with results matching the NASA eclipse catalog. As an example, if the search was started on 2023-10-15 for a location in the northeast US, it would find the eclipse on 2024-04-08 with a precision of 1 minute in 110 iterations (across 176 days).

## References

1. Meeus, J. (1998, January 1). Astronomical Algorithms.
2. Reda, I. (2010, March). Solar Eclipse Monitoring for Solar Energy Applications Using the Solar and Moon Position Algorithms. Retrieved from [https://doi.org/10.11578/dc.20190909.1](https://doi.org/10.11578/dc.20190909.1)