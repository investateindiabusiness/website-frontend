/**
 * Compresses an image file locally in the browser using HTML5 Canvas.
 * Resizes the image to fit within the specified maximum dimensions
 * and converts it to a JPEG blob with compressed quality.
 * 
 * @param {File} file The original image file
 * @param {number} maxWidth Maximum width allowed
 * @param {number} maxHeight Maximum height allowed
 * @param {number} quality Compression quality between 0.0 and 1.0 (default: 0.75)
 * @returns {Promise<File>} A Promise that resolves to the compressed File, or the original File if compression fails or isn't applicable
 */
export const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.6) => {
  return new Promise((resolve) => {
    // Only process valid image files
    if (!file || !file.type || !file.type.startsWith('image/')) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions to maintain aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(file);
        }

        // Draw and compress the image
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              // Return compressed file if it's smaller than the original, otherwise keep original
              resolve(compressedFile.size < file.size ? compressedFile : file);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = event.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
};

/**
 * Safely parses the projectImages value (which might be an array, a stringified JSON array,
 * a single URL string, or null) and returns a clean array of valid HTTP image URL strings.
 * Falls back to a default image array if no valid custom images are found.
 * 
 * @param {any} projectImages The raw projectImages field from database
 * @param {string} fallback The default fallback image URL
 * @returns {string[]} An array of image URLs
 */
export const parseProjectImages = (projectImages, fallback = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80') => {
  if (!projectImages) return [fallback];

  let imagesArray = projectImages;
  if (typeof projectImages === 'string') {
    const trimmed = projectImages.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          imagesArray = parsed;
        } else {
          imagesArray = [trimmed];
        }
      } catch (e) {
        imagesArray = [trimmed];
      }
    } else if (trimmed.startsWith('http')) {
      if (trimmed.includes(',')) {
        imagesArray = trimmed.split(',').map(s => s.trim());
      } else {
        imagesArray = [trimmed];
      }
    } else {
      return [fallback];
    }
  }

  if (Array.isArray(imagesArray)) {
    const validImages = imagesArray
      .map(img => typeof img === 'string' ? img.trim() : '')
      .filter(img => img.startsWith('http'));
    return validImages.length > 0 ? validImages : [fallback];
  }

  return [fallback];
};
