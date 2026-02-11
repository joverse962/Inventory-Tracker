# Images Folder

This folder is for storing item images.

## Usage

Place item images here and reference them in your components like:

```javascript
photo: '/images/laptop.jpg'
```

## Current Implementation

The project currently uses Unsplash images via URLs for demo purposes. You can replace these with local images by:

1. Adding images to this folder
2. Updating the `photo` property in your item data to use local paths

## Example Structure

```
/public/images/
  ├── laptop.jpg
  ├── projector.jpg
  ├── keyboard.jpg
  └── ...
```

## Recommended Image Specifications

- **Format:** JPG or PNG
- **Dimensions:** 800x600px (or similar 4:3 ratio)
- **File Size:** < 500KB for optimal loading
- **Naming:** Use lowercase with hyphens (e.g., dell-laptop-xps.jpg)
