---
title: Solar Eclipse Prediction
summary: A simple method to efficiently predict solar eclipses, designed to be run on a smartphone.
date: 2023-08-11
category: trail-sense
---

Solar eclipse prediction can be a computationally expensive task, especially when trying to predict the next eclipse that will be visible at a given location. This article will cover a simple method to efficiently predict solar eclipses, designed to be run on a smartphone. On most smartphones, it can predict the next solar eclipse in under 1 second with accuracy matching posted eclipse times. This method is used in the Trail Sense application.

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

1. Find a time where an eclipse is happening
2. Find the start, peak, and end of the eclipse

This article only discusses the algorithm used to search for the next solar eclipse. Details on how to determine the following are omitted, but can be found in astronomical algorithms books. You will need to ensure the algorithm chosen can accurately calculate the position of the sun and moon from a given location. See the references section for sources:

- Positions of the sun and moon [1]
- Rise and set times of the sun and moon [1]
- Moon phase [1]
- Calculation of the angular distance between the sun and moon [[2](https://doi.org/10.11578/dc.20190909.1)]
- Calculation of the magnitude/obscuration of the eclipse [[2](https://doi.org/10.11578/dc.20190909.1)]

## Find the next time an eclipse is happening
This will find the next time that an eclipse is occurring. It does not find the start, peak, and end of the eclipse, but the time found here will have a visible eclipse. The second step will work to find the start, peak, and end of the eclipse.

Search from the current time to the maximum search duration. The step size is determined as follows, in this order:

- **Moon phase is not new**: Time until the next new moon (approximate)
- **Sun is set**: Time until the next sunrise
- **Moon is set**: Time until the next moonrise
- **Angular distance is greater than 10 degrees**: 2 hours
- **Angular distance is greater than 2 degrees**: 30 minutes
- **No eclipse (magnitude = 0)**: 15 minutes

Otherwise, an eclipse has been found and the current time is returned.

The following pseudo-code shows how to find the next eclipse time.

<code>start = now
while start < maxDuration:
    if moonPhase != New:
        start += timeUntilNextNewMoon(moonPhase)
        continue
    if sun is set:
        start += timeUntilNextSunrise(start)
        continue
    if moon is set:
        start += timeUntilNextMoonrise(start)
        continue
    if angularDistance > 10:
        start += hours(2)
        continue
    if angularDistance > 2:
        start += minutes(30)
    if magnitude > 0:
        return start
    start += minutes(15)
return no eclipse
</code>

## Find the start, peak, and end of the eclipse
Once we know a time in which an eclipse is visible, we can search for the start, peak, and end of the eclipse.

To find the start time, take the eclipse time and search backwards until the magnitude is 0 or the sun or moon is set. While searching, keep track of the maximum magnitude and the time it occurred.

To find the end time, take the eclipse time and search forwards until the magnitude is 0 or the sun or moon is set. While searching, keep track of the maximum magnitude and the time it occurred.

If the duration of the eclipse is smaller than the minimum duration, return no eclipse, otherwise return the start, peak, and end times.

The following pseudo-code shows how to find the start, peak, and end times.

<code>start = eclipseTime
minTime = eclipseTime - 12 hours
end = eclipseTime
maxTime = eclipseTime + 12 hours
peak = eclipseTime
peakMagnitude = 0
</code>

<code>// Find the start
searchTime = start
while searchTime > minTime:
    if sun is set:
        break
    if moon is set:
        break
    if magnitude is 0:
        break
    if magnitude > peakMagnitude:
        peakMagnitude = magnitude
        peak = searchTime
    start = searchTime
    searchTime = searchTime - minutes(15)
</code>

<code>// Find the end
searchTime = end
while searchTime < maxTime:
    if sun is set:
        break
    if moon is set:
        break
    if magnitude is 0:
        break
    if magnitude > peakMagnitude:
        peakMagnitude = magnitude
        peak = searchTime
    end = searchTime
    searchTime = searchTime + minutes(15)
</code>
<code>if end - start < minDuration:
    return no eclipse
return start, peak, end
</code>

## Results
This algorithm has proven to be both accurate and fast. As mentioned, most searches complete within a second and the results match the NASA eclipse catalog.

Further improvements can likely be made to check for more conditions in which an eclipse cannot occur. In addition, I believe more research is needed to see if an algorithm, such as binary search, can be used to find the eclipse start, peak, and end times faster. Another idea could be to have progressively smaller search regions.

## References
1. Meeus, J. (1998, January 1). Astronomical Algorithms.
2. Reda, I. (2010, March). Solar Eclipse Monitoring for Solar Energy Applications Using the Solar and Moon Position Algorithms. Retrieved from [https://doi.org/10.11578/dc.20190909.1](https://doi.org/10.11578/dc.20190909.1)