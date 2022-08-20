---
layout: project
title: "Outer Wilds Echoes of the Eye Artifact"
date: 2021-12-23 12:00:00 -0400
categories: maker outer-wilds
image: /assets/images/posts/outer-wilds-artifact/outer-wilds-artifact-day.jpg
---

The artifact from Outer Wilds Echoes of the Eye. 3D printed with an Arduino powered flame that can be turned on using a flashlight and turned off by blowing it out.

**This article is a work in progress. I am going to scale up the models so everything can be printed at 100%, add instructions on build supports, add more pictures, add a simplier schematic for use as a static prop or night light, and generate a better schematic image.**

Created and shared as per the [Mobius Digital Games Fan Content Policy](https://www.mobiusdigitalgames.com/fan-content-policy.html)

This work is unofficial Fan Content created under permission from the Mobius Digital Fan Content Policy. It includes materials which are the property of Mobius Digital and it is neither approved nor endorsed by Mobius Digital.

**Time Required:** A few hours (plus a couple days to print)

**Difficulty:** Intermediate

**Cost:** $20 - $30

**Materials**

- Black 1.75mm PLA
- Clear or glow in the dark 1.75mm PLA
- Silver spray paint
- Black acrylic paint
- Hot glue
- 2 6x2mm neodymium magnets
- RGB LED
- Arduino nano
- LDR
- 2k, 10k and 560 resistors
- 9V battery and connector
- Analog microphone (HiLetgo MAX4466)

**Tools**

- 3D printer
- Soldering iron
- Hot glue gun

## Build instructions

1. Print the artifact_#.stl files at 300% scale (numbered 1 through 11) - artifact_2_hole.stl can be used in place of artifact_2.stl to add flame support. I printed them in PLA at 20% infill with a 0.28mm layer height. Any color filament (it will be painted over)
2. Line up and glue the artifact pieces together - I just used CA glue. Note, the stl files don't contain alignment pegs, so you'll have to hold it in place until it dries. I did the top section and handle separately from the main body because it was easier to paint that way, and then glued them to the main body after I painted.
3. Use wood filler to fill in the gaps and sand it
4. Put a few coats of silver spray paint on and once dried, use black acrylic paint to weather it, then seal with a clear coat
5. Print the flame_holder.stl at 100% scale (28mm layer height, 20% infill, PLA) - this is the module which holds the electronics
6. Print the flame.stl at 45% scale in a translucent filament (I used glow in the dark, but a clear or translucent white will work as well)
7. Embed small neodymium magnets (6x2mm) into the small holes on the flame holder and flame so they can be attached
8. You'll need an Arduino nano, LDR, 2k, 10k and 560 resistors, RGB LED, 9V battery and connector, and microphone (I used HiLetgo MAX4466) wire this together using the attached schematic and then line the microphone, LDR, and LED up with the holes on the flame holder and hot glue in place (for a neater look, use a circuit board cut to fit inside the flame holder)
9. Upload this sketch to the arduino: https://github.com/kylecorry31/outer_wilds_artifact/blob/main/outer_wilds_artifact.ino
10. Plug in the battery and tuck everything into the hole in the artifact
11. Attach the flame to the flame holder and shine a bright light on it, then bring into the darkness - the flame should turn on
Blow on the flame to turn it off

## Files

[Schematic (PDF, 0.4 MB)](/assets/pdfs/outer_wilds_artifact_schematic.pdf)

[STLs (zip, 37.6 MB)](https://drive.google.com/file/d/1Cr_6nKbu4YUbOljdfinnAtfY3iuRXFMH/view?usp=sharing)
