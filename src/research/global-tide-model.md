---
title: Offline Global Tide Predictions
summary: An on-device tide prediction model.
date: 2026-03-27
category: trail-sense
---

Predicting the rise and fall of the tides can help with many coastal activities and is normally done on servers. In Trail Sense, I wanted to be able to calculate the tides offline, quickly, and without using a lot of storage space.

![M2 harmonic amplitude](/assets/images/research/global-tides-m2.webp)
*The M2 harmonic constituent amplitude from EOT20*

Tides can be represented by "harmonic constituents," which are a series of waves defined by their amplitudes, phases, and speeds. By combining these waves, we can generate a final waveform that represents the water level. The times of high and low tide can be determined as the local extrema of this waveform. Harmonic constituents correspond to real-world factors such as the position of the Earth relative to the Sun and Moon, as well as shallow-water interactions. Constituents are defined by a constant speed, which represents the frequency of the associated wave. For example, the S2 (solar semidiurnal) speed is 30 degrees/hour, which corresponds to a 12-hour period (half a day). The phase and amplitude of each of these constituents vary by location and are calculated through frequency analysis of water level data.

Before the tidal harmonics can be transformed into water levels, a correction/reference for each constituent wave needs to be calculated. These factors let us choose a reference start date (say January 1, 2025, 0h UTC), and they account for changes to the Sun-Earth-Moon system over time. Once we choose a start date, we can precompute and embed these as constants.

For each constituent, the following information is required:

- **Speed**: The definition of the constituent (constant).
- **Amplitude**: The (half) height of the wave (varies by location).
- **Phase**: The phase shift (offset) of the wave (varies by location).
- **V + u**: The phase correction of the constituent when t = 0, used to specify a start date (varies over time, can be precalculated as a constant with decent accuracy).
- **f**: The amplitude correction of the wave at a given time (varies over time, can be precalculated as a constant with decent accuracy).

Finally, the water level can be calculated as follows:

<code>t = (currentTime - jan_1_2025_0utc).seconds
level = 0
for c in constituents
  level += c.f * c.amplitude * cos(c.speed * t + c.V + c.u - c.phase)</code>

Now that we have the math in place, the next step is to obtain these harmonic constants across the globe. Luckily, the EOT20 dataset is publicly available and contains harmonics for the entire ocean, which are calculated using a combination of satellite altimetry data. [[1](https://doi.org/10.17882/79489)] The EOT20 dataset was on the order of gigabytes and therefore not feasible to ship in an Android app, so I had to figure out a way to reduce the size. The easiest way to reduce the size is to remove data, and in my case, I only needed the tides along the coast. So, I used a dilated land mask generated with Natural Earth to zero out any ocean location that didn't border land. [[2](https://www.naturalearthdata.com/)] To reduce it even further, I resized the resulting image to 720x360 (2 pixels per degree of latitude/longitude) since the finer precision wasn't needed in my use case.

The dataset was still large at this point because each value was stored as 4 bytes, so the next thing I did was remap the amplitudes and phases to values between 0 and 255 to fit into a single byte. I recorded the maximum amplitude for each factor and will use that later as metadata. There were also a few locations with amplitudes over 500 cm, which would dilute the resolution of the factor when remapping, so I set those to zero and added them to the metadata.

The dataset was much smaller at this point and could be written to WebP images for extra compression, but the majority of the data was open ocean or land. I felt I could further reduce the dataset size by removing all land and open ocean pixels (leaving just the coastline) and resizing the resulting array to have a width of 250 pixels. This resulted in compressed images for both amplitude and phase, albeit with a loss of spatial information. To recover spatial information, I created a 720x360 image of the coastline with the red channel set to the X position in the compressed image and the green channel set to the Y position in the compressed image. I used a 1-based indexing system, where RGB = 0 indicates irrelevant pixels, so that I could look at this "index" image to see which locations have data in the compressed images. I saved this index image as a lossless WebP file. I also stored each compressed amplitude/phase image in the red, green, and blue channels of a lossless WebP file. The resulting images are under 300 KB in size, which is much better than 2+ gigabytes.

Now that I had the compressed images, I could add them to my Android app and read them using the following algorithm:

1. Convert the latitude and longitude to a pixel location (2 pixels per degree).

2. Load an 11x11 region of the indices image, centering the desired pixel. Handle wrapping on the X-axis. The size of this is adjustable depending on how far from the coast you want to display a tide.

3. Find the nearest non-black pixel to the center of the region.

4. Extract the X and Y coordinates of the compressed images:
<code>X = pixel.red - 1
Y = pixel.green - 1</code>

5. For each amplitude and phase file, load the X, Y pixel. Map it from [0, 255] to [0, max amplitude for constituent] and [-180, 180], respectively. We now have the harmonic constituents for the location, which can be plugged into the tidal harmonic formula to obtain the water level, and extrema can be located to get the time of high/low tide.

After implementing this, I tested using 27 locations (covering all 7 continents and 5 oceans) and 30 days (spanning all 4 main phases of the Moon) to obtain the following results:

- **Average error**: 12 minutes
- **90% quantile error**: 41 minutes
- **Minimum error**: 0 minutes
- **Maximum error**: 87 minutes

This level of accuracy is sufficient for my use case. However, increasing the resolution of the tide images would reduce errors at the cost of a larger storage footprint.

## Source code
- [Trail Sense Earth Model (image generation)](https://github.com/kylecorry31/Trail-Sense-Earth-Model)
- [Trail Sense](https://github.com/kylecorry31/Trail-Sense)

## References
1. Hart-Davis Michael, Piccioni Gaia, Dettmering Denise, Schwatke Christian, Passaro Marcello, Seitz Florian (2021). EOT20 - A global Empirical Ocean Tide model from multi-mission satellite altimetry. SEANOE. [https://doi.org/10.17882/79489](https://doi.org/10.17882/79489)

2. Made with Natural Earth. Free vector and raster map data @ [naturalearthdata.com](https://www.naturalearthdata.com/).