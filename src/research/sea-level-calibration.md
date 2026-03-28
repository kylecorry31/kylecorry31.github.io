---
title: Sea Level Calibration of Smartphone Barometers
summary: A more robust method of calibrating smartphone barometers while on the move.
date: 2026-03-27
category: trail-sense
---

Trail Sense's sea level calibration algorithm can be used to improve offline weather forecasting by providing a cleaner barometric pressure signal that is adjusted for the user's elevation. Because barometric pressure varies with altitude, raw measurements from a smartphone's sensors can be inaccurate when the user is changing elevation, so a calibration procedure is needed.

## Background

Many modern smartphones contain a barometer to measure atmospheric pressure. This sensor was originally added to smartphones to enable faster GPS locks, but it can have other uses today.<sup>[[1](https://www.engadget.com/2011-10-20-galaxy-nexus-barometer-explained-sam-champion-not-out-of-a-job.html)]</sup> Barometers can also be used for short-term weather forecasting by sensing the movement of weather fronts via changes in pressure.<sup>[[2](https://en.wikipedia.org/wiki/Barometer)]</sup> However, pressure also changes when the altitude of the sensor changes, which can obscure the pressure changes caused by weather fronts. To combat this, the pressure can be converted to sea level using the barometric formula. The conversion requires an elevation reading, which can be obtained using the GPS sensor.

GPS-derived elevation readings are subject to significant noise, which can degrade the accuracy of sea level-corrected pressures. Additional processing techniques are required to make this reading usable. GPS elevations on Android are returned in meters above the WGS84 reference ellipsoid and can be converted to mean sea level (MSL) using a geoid model.<sup>[[3](https://developer.android.com/reference/android/location/Location)] [[4](https://en.wikipedia.org/wiki/Global_Positioning_System)]</sup>

## Elevation Estimate

To reduce the noise in GPS elevation data, multiple readings can be combined using a joint Gaussian filter. This filter considers the elevation value and how accurate Android reports it to be to construct a better estimate of the actual elevation. The algorithm is as follows:

<code>def join(mean1, var1, mean2, var2):
    joint = mean1 * var2 + mean2 * var1
    sumVar = var1 + var2
    multVar = var1 * var2
    mean = joint / sumVar
    var = multVar / sumVar
    return (mean, var)

def join_all(dists):
    if len(dists) == 0:
        return None
    last = dists[0]
    for dist in dists[1:]:
        last = join(last[0], last[1], dist[0], dist[1])
    return last
</code>

In addition to filtering, the elevation needs to be converted to be relative to MSL. This requires a geoid model, which is essentially a map of latitude and longitude to a correction factor. Trail Sense ships this as an image where X is longitude, Y is latitude, and the red channel contains a normalized offset amount. The red pixel value is read for the given location and scaled/shifted by a predefined constant to map it to meters. This value is added to the GPS elevation to convert it to MSL.

Trail Sense also offers the option to use a digital elevation model (DEM) instead of the GPS. The DEM can obtain the elevation given a latitude and longitude. This model is a lot less noisy than the GPS, but the resolution is very coarse, so rugged terrain may not work well.

## Pressure Conversion

Once a somewhat accurate MSL elevation is obtained, the pressure readings can be converted to sea level pressure using the following formula:

<code>P * (1 - D / 44330.0)^(-5.255)</code>

where <code class="inline-code">P</code> is the pressure in hPa and <code class="inline-code">D</code> is the MSL elevation in meters. [[5](https://en.wikipedia.org/wiki/Barometric_formula)]

## Time Series Smoothing

Despite the filtering done to the GPS elevation, it still has a lot of residual noise, which means the sea level pressures are inaccurate. To improve the estimate, Trail Sense records the sea level pressure at a fixed interval (default 30 minutes) and then smooths the time series data. It uses the LOESS algorithm, which applies a weighted least squares regression to smooth the data (span of 0.15, 1 robustness interval).<sup>[[6](https://www.itl.nist.gov/div898/handbook/pmd/section1/pmd144.htm)]</sup> This algorithm was easy to implement, fast to run, and produced decent results.

## Results

There are no quantitative results for this algorithm, but users have provided positive feedback that it has accurate detection of storms and is generally within 1 hPa of local weather stations.

## References

1. Engadget. (2011, October 20). *Galaxy Nexus barometer explained, Sam Champion not out of a job*. Retrieved March 27, 2026, from [https://www.engadget.com/2011/10/20/galaxy-nexus-barometer-explained-sam-champion-not-out-of-a-job/](https://www.engadget.com/2011/10/20/galaxy-nexus-barometer-explained-sam-champion-not-out-of-a-job/)
2. Wikipedia contributors. (n.d.). *Barometer*. In *Wikipedia, The Free Encyclopedia*. Retrieved March 27, 2026, from [https://en.wikipedia.org/wiki/Barometer](https://en.wikipedia.org/wiki/Barometer)
3. Android Developers. (n.d.). *Location*. Retrieved March 27, 2026, from [https://developer.android.com/reference/android/location/Location](https://developer.android.com/reference/android/location/Location)
4. Wikipedia contributors. (n.d.). *Global Positioning System*. In *Wikipedia, The Free Encyclopedia*. Retrieved March 27, 2026, from [https://en.wikipedia.org/wiki/Global_Positioning_System](https://en.wikipedia.org/wiki/Global_Positioning_System)
5. Wikipedia contributors. (n.d.). *Barometric formula*. In *Wikipedia, The Free Encyclopedia*. Retrieved March 27, 2026, from [https://en.wikipedia.org/wiki/Barometric_formula](https://en.wikipedia.org/wiki/Barometric_formula)
6. National Institute of Standards and Technology. (n.d.). *4.1.4.4. LOESS (aka LOWESS)*. Retrieved March 27, 2026, from [https://www.itl.nist.gov/div898/handbook/pmd/section1/pmd144.htm](https://www.itl.nist.gov/div898/handbook/pmd/section1/pmd144.htm)

