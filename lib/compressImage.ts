    // lib/compressImage.ts

    import imageCompression from 'browser-image-compression';

    async function compressImage(imageFile: File, options?: imageCompression.Options): Promise<File> {
      try {
        const compressedFile = await imageCompression(imageFile, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          ...options,
        });
        return compressedFile;
      } catch (error) {
        console.error('Error compressing image:', error);
        throw error;
      }
    }

    export default compressImage;
