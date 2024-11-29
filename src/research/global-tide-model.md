---
title: Offline Global Tide Predictions
summary: An on-device tide prediction model.
date: 2024-11-29
category: trail-sense
---

In this article, I’ll cover the system used in Trail Sense that enables offline tide prediction at any coastal location.

![M2 harmonic amplitude](/assets/images/research/global-tides-m2.webp)
*The M2 harmonic constituent amplitude from EOT20*

## Background

### Tidal harmonics
Tides can be represented by "harmonic constituents," which are a series of waves defined by their amplitudes, phases, and speeds. By combining these waves, we can generate a final waveform that represents water level changes. From this waveform, the times of high and low tide can be determined as the local extrema.

Harmonics correspond to real-world factors such as the position of the Earth relative to the Sun and Moon, as well as shallow-water interactions. There are dozens of official tidal harmonics, but the EOT20 dataset uses 17 primary harmonics, which account for the majority of tidal motion.

To transform harmonics into water levels, we need to know the position of each wave at a reference time. This position can be calculated using equilibrium arguments (V) and nodal modulation factors (u and f). These factors are derived from the positions of the Sun and Moon relative to the Earth on a given date (typically the start of a year). Many libraries can precompute these constants.

For each constituent, the following information is required:

- **Speed**: Constant for each constituent.
- **Amplitude**: Varies by location for each constituent.
- **Phase**: Varies by location for each constituent.
- **V**: Constant for each constituent.
- **u**: Constant for each constituent.
- **f**: Constant for each constituent.

Finally, the water level can be calculated as follows:

<code>t = (currentTime - jan_1_2025_0utc).seconds
level = 0
for h in harmonics
  level += h.f * h.amplitude * cos(h.speed * t + h.u + h.V - h.phase)</code>

## Solution

### Image generation
1. Download the EOT20 tide data. [[1](https://doi.org/10.17882/79489)]  
2. Download a land mask from Natural Earth. [[2](https://www.naturalearthdata.com/)]  
3. Dilate the land mask to include ocean regions near the coastlines.  
4. Use the land mask to remove excess ocean tide data from the EOT20 tide model.  
5. Resize the resulting image to 720x360 (2 pixels per degree of latitude/longitude).  
6. Remap the amplitudes and phases to values between 0 and 255, recording the maximum amplitude for each factor. Amplitudes over 500 cm are handled separately to retain sufficient resolution (these are rare).  
7. Remove all land pixels (as marked in the EOT20 dataset) and resize the data to a width of 250. This results in compressed images for both amplitude and phase, albeit with a loss of spatial information.  
8. To recover spatial information, replace each pixel in the 720x360 image with the X (red) and Y (green) coordinates of its position in the compressed image. Use a 1-based indexing system, where RGB = 0 indicates irrelevant pixels. Export this as a lossless WebP file.  
9. Store each compressed amplitude image in the red, green, and blue channels of a lossless WebP file. Repeat this for the compressed phase images.  

The resulting images are under 300 KB in size.

### Harmonic lookup
1. Convert the latitude and longitude to a pixel location (2 pixels per degree).  
2. Load an 11x11 region of the indices image, centering the desired pixel. Handle wrapping on the X-axis. The size of this is adjustable depending on how far from the coast you want to display a tide.  
3. Find the nearest non-black pixel to the center of the region.  
4. Extract the X and Y coordinates of the compressed images:
<code>X = pixel.red - 1
Y = pixel.green - 1</code>

5. For each amplitude and phase file, load the X, Y pixel. Map it from [0, 255] to [0, max amplitude for constituent] and [-180, 180] respectively. You now have the harmonic constituents for the location, which can be plugged into the tidal harmonic formula to obtain the water level and extremas can be located to get the time of high/low tide.

## Results
Using a test dataset of 17 locations (covering all 7 continents and 5 oceans) and 20 days (spanning all 4 main phases of the Moon), the following results were obtained:

- **Average error**: 15 minutes  
- **90% quantile error**: 40 minutes  
- **Minimum error**: 0 minutes  
- **Maximum error**: 67 minutes  

This level of accuracy is sufficient for my use case. However, increasing the resolution of the tide images would reduce errors at the cost of a larger storage footprint.

## Source code
- [Trail Sense Earth Model (image generation)](https://github.com/kylecorry31/Trail-Sense-Earth-Model)
- [Trail Sense](https://github.com/kylecorry31/Trail-Sense)

## References
1. Hart-Davis Michael, Piccioni Gaia, Dettmering Denise, Schwatke Christian, Passaro Marcello, Seitz Florian (2021). EOT20 - A global Empirical Ocean Tide model from multi-mission satellite altimetry. SEANOE. [https://doi.org/10.17882/79489](https://doi.org/10.17882/79489)

2. Made with Natural Earth. Free vector and raster map data @ [naturalearthdata.com](https://www.naturalearthdata.com/).