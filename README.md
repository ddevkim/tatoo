# ImageProcessing for Tatoo

## Mission
- Image processing to automatically generate the GLUE image needed to create a tattoo based on a user's design image

## Spec
- The resulting output is a rasterized file (PNG).
- The interior of the design image is all filled in.
- The outside of the design image should be 0.5 to 1 mm wider than the outline.
- The inner area surrounded by the image should be open.

### Development
```
    npm install
    npm start
```

### Test
```
    npm test
```
---
### References
[Image Convolution](https://www.youtube.com/watch?v=8rrHTtUzyZA)

[Kernel](https://en.wikipedia.org/wiki/Kernel_(image_processing))

[Gaussian function](https://en.wikipedia.org/wiki/Gaussian_function)

[Gaussian kernel](https://observablehq.com/@jobleonard/gaussian-kernel-calculater-2d)

---
### Examples

#### Input Image (Design Layer)
![flower_1024.png](src%2Fassets%2Fflower_1024.png)

#### Output Result (Glue Layer)
![flower_processed.png](src%2Fassets%2Fflower_processed.png)

### Overlayed View
![flower_source_over.png](src%2Fassets%2Fflower_source_over.png)

### Todos
1. Faster processing
   1. WebGL
   2. Web-worker
2. Convolution 함수 추상화 작업
3. 파일 처리 모듈
4. 생산 이미지 스펙 적용