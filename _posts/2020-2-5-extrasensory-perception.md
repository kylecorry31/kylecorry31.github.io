---
layout: post
title:  "Extrasensory Perception"
date:   2020-2-5 19:30:00 -0500
categories: research
---

Human perception has always been limited to our biological senses, but what if we could change that? And no, I am not talking about the fantasy or science fiction version of ESP. In nature, there are animals with the ability to sense magnetic fields, barometric pressure, ambient electricity, and thermal radiation. With this project, I explored what it would feel like for a human (AKA me) to have new senses, powered by modern technology. For the scope of this research, I experimented with magnetoreception and barometric pressure sensing. I used an Arduino Nano with an inexpensive magnetometer and barometer for sensors and coin vibration motors for feedback devices. I embedded the magnetoreception device into a muscle shirt, and I explored different form factors for the barometric sense such as a wrist band and shoe. 

## Theory
This project was heavily inspired by the work of [David Eagleman](https://www.ncbi.nlm.nih.gov/pubmed/26080756). The quick summary of this article is that vibration motors can be placed on the skin and coded sensor information can be used to turn them on in a specific pattern which will eventually be subconsciously perceived by the wearer. 

Many receptor neurons respond to change in stimuli, rather than the absolute strength of that stimuli. Therefore, when coding the sensor data, I dealt with its derivative values. To filter out noisy sensor data, I used a model of a neuron which fires at a frequency that corresponds to the amplitude and duration of an input signal (in this case, the change in stimuli). What this comes down to in practice, is that the device will vibrate quickly when the sensor's value changes quickly and not vibrate when the sensor reading is steady. 

## Implementation
As stated earlier, this project was built using an Arduino Nano, so C++ was used to program it. The sensors all use the I2C bus to communicate with the Arduino and the vibration motors use the digital and analog I/O pins. The barometer is a BME280 sensor and the magnetometer is GY-9250. The sensors inherit from the `SensoryDevice` virtual class, which provides the `Initialize` and `Sense` methods. The vibration motors are instances of the `HapticDevice` class that has a method for turning on and off the motor. The `SensoryDevice`s are responsible for reading the sensor value, coding the reading, and converting the reading to vibrations. Each `SensoryDevice` is designed to be standalone. 

### Haptic Neurons
The neuron class is actually pretty simple. The general algorithm can be seen below:

```
voltage = 0

loop:
    if is in refactory period:
        continue

    if is firing
        set haptic motor to high
        continue

    decrease voltage by degradation amount
    increase voltage by input

    if is past firing threshold
        voltage = 0
        start firing
```

This provides a way to filter noisy sensor data and encode the strength of the input as a frequency. 

### Barometer
The barometric sense uses two vibration motors to convey the change in atmospheric pressure - one for increasing and another for decreasing pressure. This sense uses the neuron class to filter and convey changes in pressure. 

To allow the neuron to respond to slow changes in atmospheric pressure, the degredation amount is set very small and the neuron accepts positive and negative inputs (negative values inhibit activation). The decreasing pressure neuron receives the same input as the increasing pressure neuron, except that it is negated as seen below. 

```
pressure_change = pressure - last_pressure

up_neuron.receive(pressure_change)
down_neuron.receive(-pressure_change)
```

The initial prototype can be seen here, with the vibration motors taped to my arm for testing:

![Barometric sense 1](/assets/images/posts/esp1.jpg)

**More coming soon!**

### Magnetometer

**More coming soon!**

## Code
The code and schematic for this project can be found [here](https://github.com/kylecorry31/extrasensory-perception).