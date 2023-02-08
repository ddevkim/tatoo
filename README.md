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

### Examples

#### Input Image (Design Layer)
![flower_1024.png](src%2Fassets%2Fflower_1024.png)

#### Output Result (Glue Layer)
![flower_processed.png](src%2Fassets%2Fflower_processed.png)

### Overlayed View
![flower_source_over.png](src%2Fassets%2Fflower_source_over.png)