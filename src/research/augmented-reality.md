---
title: Augmented Reality From Scratch
summary: An augmented reality implementation from scratch on Android.
date: 2023-12-31
category: trail-sense
---

Augmented Reality (AR) is a technology that allows for the overlay of digital content on top of the real world. It can be used in a variety of applications, such as navigation, astronomy, and gaming. In this article, I'll cover the system used in Trail Sense, which uses built-in Android features to create an AR experience without the need for external libraries such as ARCore.

## Background

### Coordinate Systems
The Cartesian coordinate system uses X, Y, and Z axes to describe a point in 3D space. The origin is the point (0, 0, 0), and the axes are perpendicular to each other.

The spherical coordinate system uses azimuth (angle), elevation (angle), and radius (distance) to describe a point in 3D space.

The geographic coordinate system uses latitude (angle), longitude (angle), and elevation (distance) to describe a point on the surface of the Earth. It is a variation of the spherical coordinate system. In this article, the elevation will be relative to mean sea level. If you know the user's location, you can convert a point in this system to a spherical coordinate system centered at the user's location.

On Android, sensors report values using a Cartesian coordinate system with the axes [[1](https://developer.android.com/develop/sensors-and-location/sensors/sensors_overview)]:

- X: Positive to the right
- Y: Positive up
- Z: Positive straight out of the screen

Most AR applications will use a coordinate system with the axes [[2](https://developer.android.com/reference/android/hardware/SensorManager)]:

- X: Positive to the right
- Y: Positive straight out of the back camera
- Z: Positive up

It is trivial to convert between these two Cartesian coordinate systems on Android.

### Camera Intrinsics
The camera intrinsics are the focal length (fx, fy) and principal point (cx, cy) of the camera. The focal length is the distance between the camera and the image plane. The principal point is the center of the image plane [[3](https://developer.android.com/reference/android/hardware/camera2/CameraCharacteristics)].

### Perspective Projection
A perspective projection is a projection that maps a point in 3D space to a point on a 2D plane. Points farther away from the camera appear smaller than points closer to the camera, and lines that are parallel in 3D space appear to converge in the 2D plane [[4](https://www.youtube.com/watch?v=qByYk6JggQU)].

### Device Orientation
The orientation of the device can be obtained using the sensor fusion of the accelerometer, magnetometer, and gyroscope (optional). It can be represented as Euler angles (roll, pitch, yaw), a quaternion/rotation vector, or a rotation matrix. Euler angles are the most intuitive but are prone to gimbal lock, so it is best to represent the orientation as a quaternion or rotation matrix [[1](https://developer.android.com/develop/sensors-and-location/sensors/sensors_overview)].

The orientation of the device will be relative to Magnetic North. The declination value can be used to convert the orientation to True North, which makes it easier to work with geographic coordinates.

## Solution
The following steps outline the process used by Trail Sense to create an augmented reality experience:

1. Obtain the device orientation as a rotation matrix. On Android, it can be obtained using either the ROTATION_VECTOR or GEOMAGNETIC_ROTATION_VECTOR sensor. Once the rotation vector is available, it can be converted to a rotation matrix using the SensorManager.getRotationMatrixFromVector() method [[2](https://developer.android.com/reference/android/hardware/SensorManager)]. This should be continuously updated in a separate thread.

2. Obtain the device location and elevation using the GPS (optionally using the barometer for elevation). This should be continuously updated in a separate thread.

3. Obtain or calculate the camera intrinsics [[3](https://developer.android.com/reference/android/hardware/camera2/CameraCharacteristics)]:

    To obtain the camera intrinsics if available, you can do the following:
    ```
    val intrinsics = cameraInfo.getCameraCharacteristic(CameraCharacteristics.LENS_INTRINSIC_CALIBRATION)
    val fx = intrinsics[0]
    val fy = intrinsics[1]
    val cx = intrinsics[2]
    val cy = intrinsics[3]
    ```

    Otherwise, you can estimate the camera intrinsics using the following:

    ```
    val focalLengthMM = cameraInfo.getCameraCharacteristic(CameraCharacteristics.LENS_INFO_AVAILABLE_FOCAL_LENGTHS)[0]
    val sensorSizePixelsX = cameraInfo.getCameraCharacteristic(CameraCharacteristics.SENSOR_INFO_PIXEL_ARRAY_SIZE).width()
    val sensorSizePixelsY = cameraInfo.getCameraCharacteristic(CameraCharacteristics.SENSOR_INFO_PIXEL_ARRAY_SIZE).height()
    val sensorSizeMMX = cameraInfo.getCameraCharacteristic(CameraCharacteristics.SENSOR_INFO_PHYSICAL_SIZE).width
    val sensorSizeMMY = cameraInfo.getCameraCharacteristic(CameraCharacteristics.SENSOR_INFO_PHYSICAL_SIZE).height
    val fx = focalLengthMM * sensorSizePixelsX / sensorSizeMMX
    val fy = focalLengthMM * sensorSizePixelsY / sensorSizeMMY
    val cx = sensorSizePixelsX / 2
    val cy = sensorSizePixelsY / 2
    ```

    Depending on the camera sensor orientation (e.g., if it is 90 or 270), you may need to swap fx with fy and cx with cy in the steps below. You can obtain the sensor orientation using the following:

    ```
    val rotation = cameraInfo.getCameraCharacteristic(CameraCharacteristics.SENSOR_ORIENTATION)
    ```

4. Obtain the full size of the camera preview. If the preview is cropped (e.g., using a FILL_* scale type), you will need to calculate the size of the uncropped preview. In addition, you need to factor in the zoom level of the camera. You can do this by multiplying the preview size by the zoom ratio.

5. Remap the rotation matrix to the AR coordinate system using SensorManager.remapCoordinateSystem(rotationMatrix, SensorManager.AXIS_X, SensorManager.AXIS_Z, rotationMatrix). This ensures that the x axis is positive towards the right, the y axis is positive facing out from the back camera, and the z axis is positive upwards [[2](https://developer.android.com/reference/android/hardware/SensorManager)].

6. Obtain the declination and adjust the rotation matrix:

    ```
    val declination = GeoMagneticField(location.latitude, location.longitude, location.altitude, System.currentTimeMillis()).declination
    Matrix.rotateM(rotationMatrix, 0, declination, 0f, 0f, 1f)
    ```

7. Convert the point from spherical to cartesian. All spherical coordinates should be relative to True North. You can use the Haversine or Vincenty formulas (or similar) to calculate the distance/bearing between two points on the surface of the Earth.

    To convert a geographic coordinate to a spherical coordinate, you can use the following:
    
    ```
    val azimuth = bearingBetween(location, point)
    val radius = distanceBetween(location, point)
    val elevation = Math.toDegrees(atan2(location.altitude - point.altitude, radius))
    ```

    To convert a spherical coordinate to a cartesian coordinate, you can use the following:
    
    ```
    val x = radius * cos(Math.toRadians(elevation)) * sin(Math.toRadians(azimuth))
    val y = radius * cos(Math.toRadians(elevation)) * cos(Math.toRadians(azimuth))
    val z = radius * sin(Math.toRadians(elevation))
    ```

8. Rotate the point by the rotation matrix to adjust for the device orientation:
    
    ```
    val world = floatArrayOf(x, y, z, 1f)
    Matrix.multiplyMV(world, 0, rotationMatrix, 0, world, 0)
    // The point ends up in the sensor coordinate system, so we need to swap y and z to get it into the AR coordinate system
    x = world[0]
    y = world[2]
    z = world[1]
    ```

9. Calculate the screen position of the point using a perspective projection [[4](https://www.youtube.com/watch?v=qByYk6JggQU)]:
    
    ```
    if (z <= 0) {
        // Point is behind the camera, don't draw it
    }
    val pixelX = fx * x / z + cx
    // Invert the y axis to match the android screen coordinate system
    val pixelY = sensorSizePixelsY - (fy * y / z + cy)
    ```

10. Map the point from the camera sensor to the preview:
    
    ```
    val previewX = pixelX * previewSize.width / sensorSizePixelsX
    val previewY = pixelY * previewSize.height / sensorSizePixelsY
    ```

## Results
The Augmented Reality tool is still a work in progress in Trail Sense, but here are some results so far:

- It aligns well with the real world and keeps up with the camera preview as the user moves the device.
- It is not suitable for placing objects on the ground like with ARCore, but it is suitable for navigation and astronomy.
- The device orientation is not always accurate (off by a few degrees), but it can be calibrated using the sun/moon (more to come on this).

## References
1. Android Developers. (2023, December 18). Sensors Overview. Retrieved from [https://developer.android.com/develop/sensors-and-location/sensors/sensors_overview](https://developer.android.com/develop/sensors-and-location/sensors/sensors_overview)
2. Android Developers. (2023, April 12). SensorManager. Retrieved from [https://developer.android.com/reference/android/hardware/SensorManager](https://developer.android.com/reference/android/hardware/SensorManager)
3. Android Developers. (2023, October 24). CameraCharacteristics. Retrieved from [https://developer.android.com/reference/android/hardware/camera2/CameraCharacteristics](https://developer.android.com/reference/android/hardware/camera2/CameraCharacteristics)
4. Nayar, S. & First Principles of Computer Vision. (2021, April 18). Linear Camera Model | Camera Calibration. Retrieved from [https://www.youtube.com/watch?v=qByYk6JggQU](https://www.youtube.com/watch?v=qByYk6JggQU)