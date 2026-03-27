---
title: Sea Level Calibration of Smartphone Barometers
summary: A more robust method of calibrating smartphone barometers while on the move.
date: 2026-03-27
category: trail-sense
---

Many smartphones contain a barometer, which can be used for offline weather forecasting. Unfortunately, barometers are impacted by changes in altitude, which can lead to inaccurate readings while on the move. Elevation can be accounted for by converting the barometer reading to sea level pressure, but this requires an accurate GPS elevation, which can be difficult to obtain. I implemented the following approach in the Trail Sense application on Android.

The first place to start is to ensure I can obtain the most accurate GPS elevation by aggregating multiple readings into one while factoring in their accuracy. I use a joint Gaussian filter algorithm to do this:

<code>def join(mean1, var1, mean2, var2):
    joint = mean1 * var2 + mean2 * var1
    sumVar = var1 + var2
    multVar = var1 * var2
    mean = joint / sumVar
    var = multVar / sumVar
    return (mean, var)
</code>
<code>def join_all(dists):
    if len(dists) == 0:
        return None
    last = dists[0]
    for dist in dists[1:]:
        last = join(last[0], last[1], dist[0], dist[1])
    return last
</code>

The GPS also uses an offline GEOID model, which allows me to convert the elevations to mean sea level (MSL). I won't go in depth here, but it is an image that ships with Trail Sense where X is longitude and Y is latitude (both multiplied by some factor to get the actual pixel index), and the grayscale color (0 to 255) is the normalized height. Once I obtain the pixel color, I can scale and translate it by some predetermined constants to obtain the actual height offset in meters for a given location. This value can be added to the GPS elevation to convert it to MSL.

To make it easier for me to deal with this, I used the decorator pattern to implement this logic so I can just listen for GPS elevation changes and get the improved accuracy and MSL conversion without further complicating my pressure monitor service.

Now that I have a way to obtain a more accurate GPS MSL elevation, I can convert my pressure readings to sea level pressure. I obtain a pressure reading from the barometer (P) and a GPS MSL elevation (D) and plug them into this formula: `P * (1 - D / 44330.0)^(-5.255)`. So now I have a sea level pressure, but there's still a lot of GPS elevation noise (even with the Gaussian filter).

Since I am also interested in how the pressure changes over time, I have a background service which runs at a fixed interval (default 30 minutes) and records these sea level pressure readings. That gives me a time series dataset which I can apply a smoothing algorithm to. After a significant amount of experimentation, I went with the LOESS algorithm, which uses a weighted least squares regression to smooth a set of data points. [[1](https://www.itl.nist.gov/div898/handbook/pmd/section1/pmd144.htm)]

The LOESS algorithm was easy to implement, fast to run, and produced decent results using a span of 0.15 and a single robustness iteration. So all I do is run my sea level pressures (Y) and the reading times (X) through this algorithm, and I get a much better sea level pressure estimate.

I do not have quantitative results for this, but I have found that I get far fewer false storm alerts while traveling or hiking in the mountains. Comparing to local weather stations, I have found that the barometer readings are generally within 1 hPa of my local weather station.

Since my initial implementation of this, I was able to ship a digital elevation model (DEM) with Trail Sense, which drastically reduces the elevation noise. I apply the exact same algorithm, just using DEM elevation instead of GPS elevation, and get even better sea level pressure estimates.

## References
1. NIST. (n.d.). 4.1.4.4. LOESS (aka LOWESS). Retrieved from [https://www.itl.nist.gov/div898/handbook/pmd/section1/pmd144.htm](https://www.itl.nist.gov/div898/handbook/pmd/section1/pmd144.htm)
