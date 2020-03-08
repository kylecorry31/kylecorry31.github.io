---
layout: post
title:  "Car Backup Sensor"
date:   2020-3-8 12:00:00 -0500
categories: maker
---

An Arduino powered backup sensor for cars.

This project is adds a backup sensor for cars which beeps faster the closer you get to an object behind the car. It is not wired into the reverse lights, which means it will run regardless of whether the car is in reverse.

Disclaimer: Do not rely on this as a safety measure for your car. I am not responsible for any damage you cause by not looking into your mirrors / backup camera, etc.

## Materials Used
- Arduino Uno
- Piezoelectric buzzer
- JSN-SR04T waterproof ultrasonic sensor
- Wire tubing (optional)
- USB A cable (15 ft)
- Solder or breadboard (either)

## Libraries Required
- [Kalman Filter](https://github.com/kylecorry31/kalman-filter)

## Instructions
1. Assemble the circuit shown below.
![Schematic](/assets/images/posts/car-backup-sensor/schematic.png)

2. Upload [this sketch](https://github.com/kylecorry31/car-backup-sensor)to the Arduino after installing the required library.

3. Run the ultrasonic sensor to the rear exterier of your car and connect it to it's breakout board on the inside with the Arduino.

4. Plug the Arduino's USB cable into a car outlet.

5. Start your car, and the circuit should beep when you are getting close to an object. 

## Code
The code and schematic for this project can be found [here](https://github.com/kylecorry31/car-backup-sensor).