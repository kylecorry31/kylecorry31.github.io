---
title: Sea Level Calibration of Smartphone Barometers
summary: A more robust method of calibrating smartphone barometers while on the move.
date: 2023-05-01
category: trail-sense
---

Many smartphones contain a barometer, which can be used for offline weather forecasting. Unfortunately, barometers are impacted by changes in altitude, which can lead to inaccurate readings while on the move. Elevation can be accounted for by converting the barometer reading to sea level pressure, but this requires an accurate GPS elevation, which can be difficult to obtain. In this article, I'll cover the system used in Trail Sense, which uses a combination of sensor processing methods to allow for accurate barometer readings while on the move.

## Background
### Barometric Pressure
Barometric pressure is the pressure exerted by the atmosphere at a given point. It is commonly used in weather forecasting, as it can be used to predict the movement of weather fronts. Pressure also changes with altitude, which will interfere with weather forecasting if not accounted for.

### Sea Level Pressure
Sea level pressure is the pressure that would be measured at a given point if it were at sea level. It is commonly used in weather forecasting, as it allows for the comparison of pressure between different locations, regardless of altitude.

### Mean Sea Level (MSL)
Mean sea level is the average height of the ocean's surface. It is used as a reference point for altitude, as it is relatively constant. 

### GPS Elevation
GPS elevation is the altitude of a given point above the WGS84 ellipsoid. In order to convert this to MSL, a geoid model must be used. A geoid model is a model of the Earth's surface that approximates MSL. The most common geoid model is EGM96.

Unfortunately, GPS elevation is not very accurate, as it is affected by the number of satellites in view, the quality of the signal, and the accuracy of the geoid model.

### Digital Elevation Model (DEM)
A digital elevation model is a map of the elevation of a given area. It is commonly used in offline navigation applications, as it allows for the calculation of altitude based on the more accurate GPS location. Unfortunately, DEMs take up a lot of space, which makes them impractical for offline use on smartphones.

### LOESS / LOWESS
The LOESS algorithm is a smoothing algorithm that uses a weighted least squares regression to smooth a set of data points. This algorithm works well on non-linear data and can be easily tuned. [[1](https://www.itl.nist.gov/div898/handbook/pmd/section1/pmd144.htm)]


## Solution
To accurately convert barometric pressure to sea level pressure, Trail Sense first obtains a more accurate GPS elevation, then converts to sea level, and finally it smooths the readings to account for noise.

### Improving GPS Elevation Accuracy
1. Obtain up to 8 sequential GPS elevation readings and their reported vertical accuracies.
2. Convert the GPS elevation to MSL using EGM96 geoid model.
3. Use a joint Gaussian filter to smooth the MSL readings. The following algorithm is used:
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

### Sea Level Calibration
1. Every 30 minutes, a background process records the barometric pressure and improved GPS elevation. The interval of this is configurable.

2. Convert the readings to sea level using this formula:
<code>P * (1 - D / 44330.0) ** (-5.255)</code>

3. Smooth the sea level pressure readings from the last 48 hours using the LOESS algorithm. The default span is 0.15 and a single robustness iteration is used. The span can be made configurable to account for different devices and environments.

## Results
I do not have quantitative results for this, but I have found that I get far fewer false storm alerts while traveling or hiking in the mountains. Comparing to local weather stations, I have found that the barometer readings are generally within 1 hPa of my local weather station.

Future work should be done to evaluate the accuracy of this method.

## References
1. NIST. (n.d.). 4.1.4.4. LOESS (aka LOWESS). Retrieved from [https://www.itl.nist.gov/div898/handbook/pmd/section1/pmd144.htm](https://www.itl.nist.gov/div898/handbook/pmd/section1/pmd144.htm)
