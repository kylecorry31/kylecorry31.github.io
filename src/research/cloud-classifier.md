---
title: Cloud Image Classification on a Smartphone
summary: An on-device image classifier for cloud genera.
date: 2022-10-01
---

Clouds are one of the oldest indicators used to predict weather. The ability to accurately identify cloud genera can improve offline weather prediction. The system outlined here is used by Trail Sense and allows for offline classification of the 10 main cloud genera using a smartphone camera with minimal processing requirements.

![Cloud Classification](/assets/images/research/cloud-classification.jpg)

## Solution
The following steps outline the process of classifying a cloud image:

1. Resize the image to 400x400 pixels. This reduces the memory footprint and improves the performance on low-end devices.

2. Calculate the average Normalized Red-Blue Ratio (NRBR) of the image. The NRBR is calculated as
```
max(1, (red - blue) / (red + blue))
``` [[1](https://doi.org/10.5194/amt-3-557-2010)]

3. Calculate the normed 16 level Gray-Level Co-occurrence Matrix (GLCM) of the red channel for each 100x100 region of the image using the following step sizes (averaged): (0, 1), (1, 1), (1, 0), (1, -1). [[2](https://doi.org/10.11575/PRISM/33280)][[3](https://doi.org/10.1038/s41598-017-04151-4)]

4. Compute the following features for each GLCM and take the average of each feature across all the GLCMS [[3](https://doi.org/10.11575/PRISM/33280)]:
    - Energy
    - Contrast
    - Vertical Mean
    - Vertical Standard Deviation

5. Normalize each feature as follows:
    - **NRBR**: Map it from the range [-1, 1] to [0, 2]
    - **Energy**: Take as is
    - **Contrast**: Take as is
    - **Vertical Mean**: Map it from the range [0, 16] to [0, 1]
    - **Vertical standard deviation**: Map it from the range [0, 3] to [0, 1]

6. Feed all features, plus a bias of 1 into a softmax classifier.

## Results
After training on a small dataset (~300 images) that was unevenly distributed, the weighted average F1 score was 0.63. With more training data (and better distribution), I believe this score will improved.

This model was included in version 4.6.0 of Trail Sense.

## References
1. Heinle, A., Macke, A. & Srivastav, A. (2010, May 6). Automatic cloud classification of whole sky images. Retrieved from [https://doi.org/10.5194/amt-3-557-2010](https://doi.org/10.5194/amt-3-557-2010)
2. Hall-Beyer, M. (2017, April 4). GLCM Texture: A Tutorial v. 3.0. Retrieved from [https://doi.org/10.11575/PRISM/33280](https://doi.org/10.11575/PRISM/33280) 
3. Brynolfsson, P., Nilsson, D., Torheim, T., Asklund, T., Karlsson, C., Trygg, J., Nyholm, T. & Garpenbring, A. (2017, June 22). Haralick texture features from apparent diffusion coefficient (ADC) MRI images depend on imaging and pre-processing parameters. Retrieved from [https://doi.org/10.1038/s41598-017-04151-4](https://doi.org/10.1038/s41598-017-04151-4) 