---
title: Turning a Photograph into a Map
summary: A system to turn a photograph into a digital map.
date: 2024-03-20
category: trail-sense
draft: true
---

Many trail systems contain physical maps at the trail head. It is possible to convert a photo of these maps into a digital map that can be used on a smartphone. Having the ability to digitize these maps can make them more accessible. In this article, I'll cover the system used in Trail Sense's Photo Maps tool and how it is able to turn a photograph into a digital map.

## Background

### Map Projections

Map projections are a way to represent the Earth's surface on a flat plane. There are many different map projections, each with their own strengths and weaknesses. Most maps are created using Mercator or Cylindrical Equidistant projections. These projections are good for navigation but distort the size of landmasses as you move away from the equator.

### Tiling

In order to display a map on a screen, it is often broken up into smaller pieces called tiles. Tiles allow a portion of the map to be loaded at a time at different zoom levels. This improves the memory usage and performance of the map.

### Perspective Correction / Warping

When a photo is taken, rectangular objects can appear distorted due to the perspective of the camera. Perspective correction is the process of removing this distortion to make the object appear as it would in real life. Perspective correction uses a matrix transformation to warp the image given the corners of the map and the aspect ratio (can be estimated).

## Solution

1. Once a photo of a map is taken, it must be corrected for perspective. Trail Sense currently asks the user to select the corners of the map in the photo, but this could be automated using a corner detection algorithm. Once the for corners are selected, the aspect ratio is estimated and a affine transformation is applied to correct the perspective.

2. The user then needs to select two known points on the map. These points are used to calculate the scale and rotation of the map. The user needs to provide both the pixel coordinates and the latitude and longitude of these points.

3. The rotation can be estimated by determining the difference in angle between the two points in the photo and the two points when projected.
    ```projectedA = project(locationA)
projectedB = project(locationB)
projectedAngle = 90 - angle(projectedA, projectedB)
// This assumes 0, 0 is the bottom left of the image - adjust as needed
actualAngle = 90 - angle(pixelA, pixelB)
rotation = deltaAngle(projectedAngle, actualAngle)```  

    The _project_ method converts the latitude and longitude to a point on the map using the projection for the map (either Mercator or Cylindrical Equidistant - defaults to Mercator).

    The _deltaAngle_ method calculates the shortest angle between two angles.

4. Calibrated projection (get corners in full projection, convert projected point to percentage and scale) + rotated projection  (show to and from)

5. Tiling
6. Layers

## Results

## Source code

- [Trail Sense](https://github.com/kylecorry31/Trail-Sense)

## References
