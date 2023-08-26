---
title: Solar Eclipse Prediction
summary: A simple method to efficiently predict locally visible solar eclipses, designed to be run on a smartphone.
date: 2023-08-11
category: trail-sense
---

Solar eclipse prediction at a given location can be a computationally expensive task. This article will cover a simple method to efficiently find solar eclipses, designed to be run on a smartphone. On most smartphones, it can predict the next solar eclipse in under 1 second with accuracy matching posted eclipse times. This method is used in the Trail Sense application.

## Background

This article is around the method to efficiently search for the next solar eclipse, it does not cover how to calculate astronomical values. If you are looking for a method to calculate the values used, see the references section for sources.

### Solar Eclipses
Solar eclipses occur when the moon passes between the sun and the earth, blocking the sun's light from reaching the earth. There are three types of solar eclipses:

- **Total**: The moon completely blocks the sun, leaving only the sun's corona visible.
- **Annular**: The moon is too far away to completely block the sun, leaving a ring of the sun visible.
- **Partial**: The moon only partially blocks the sun, leaving a portion of the sun visible.

Solar eclipses can only occur during a new moon.

### Eclipse Magnitude
The magnitude of an eclipse is the fraction of the sun's diameter that is covered by the moon. For example, a magnitude of 0.5 means that half of the sun's diameter is covered by the moon. The magnitude of an eclipse is always between 0 and 1.

### Eclipse Obscuration
The obscuration of an eclipse is the fraction of the sun's area that is covered by the moon. For example, an obscuration of 0.5 means that half of the sun's area is covered by the moon. The obscuration of an eclipse is always between 0 and 1.

### Angular Distance
The angular distance between the sun and moon is the angle between disks of the sun and moon as seen from the earth. The angular distance can be used to determine if an eclipse is happening. Given you know the positions of the sun and moon and the size of the sun and moon disks, you can calculate the angular distance.

## Solution

The solar eclipse prediction algorithm used by Trail Sense is composed of two parts:

1. Find the next time an eclipse is happening
2. Find the start, peak, and end of the eclipse

This article only covers the algorithm used to search for the next solar eclipse at a given location. Details on how to determine the following are omitted, but can be found in astronomical algorithms books. You will need to ensure the algorithm chosen can accurately calculate the position of the sun and moon from a given location. See the references section for sources:

- Positions of the sun and moon [1]
- Calculation of the next potential solar eclipse (global) [1]
- Calculation of the angular distance between the sun and moon [[2](https://doi.org/10.11578/dc.20190909.1)]
- Calculation of the magnitude/obscuration of the eclipse [[2](https://doi.org/10.11578/dc.20190909.1)]

## Find the next time an eclipse is happening
This will find the next time that an eclipse is occurring. It does not find the start, peak, and end of the eclipse, but the time found here will have a visible eclipse. The second step will work to find the start, peak, and end of the eclipse.

For each potential solar eclipse (calculated using the algorithm described by Meeus [1]), we need to check if it is visible at the location provided. This can be done by searching around the calculated eclipse peak time for visibility.

The following pseudo-code shows how to find the next eclipse time.

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

## Find the start, peak, and end of the eclipse
Once we know a time in which an eclipse is visible, we can search for the start, peak, and end of the eclipse.

To find the start time, take the eclipse time and search backwards until the magnitude is 0 or the sun or moon is set. While searching, keep track of the maximum magnitude and the time it occurred.

To find the end time, take the eclipse time and search forwards until the magnitude is 0 or the sun or moon is set. During the search, track the maximum magnitude and the time it occurred.

If the duration of the eclipse is smaller than the minimum duration, return no eclipse, otherwise return the start, peak, and end times.

The following pseudo-code shows how to find the start, peak, and end times.

The following pseudo-code returns true when the eclipse is visible:
<code>function isEclipseVisible(time):
    if sun is set:
        return false
    if moon is set:
        return false
    if magnitude > 0:
        return true
    return false
</code>

The following pseudo-code shows how to find the start, peak, and end times. For efficiency, I used binary search, but any search algorithm can be used. The following assumptions can be made:

- Eclipse is not visible at minTime or maxTime
- Eclipse is visible at eclipseTime

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
This algorithm has proven to be both accurate and fast. As mentioned, most searches complete within a second and the results match the NASA eclipse catalog.

For example, if the search was started on 2023-10-15, it would find the eclipse on 2024-04-08 with a precision of 1 minute in 110 iterations (across 176 days).

Most of the iterations were spent searching for the start, peak, and end of the eclipse. Efforts to improve this algorithm should be focused around that.

## References
1. Meeus, J. (1998, January 1). Astronomical Algorithms.
2. Reda, I. (2010, March). Solar Eclipse Monitoring for Solar Energy Applications Using the Solar and Moon Position Algorithms. Retrieved from [https://doi.org/10.11578/dc.20190909.1](https://doi.org/10.11578/dc.20190909.1)