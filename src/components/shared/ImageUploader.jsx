import React, { useState, useRef, useCallback } from 'react';
import { FaCloudUploadAlt, FaTrash, FaSpinner, FaCheckCircle, FaImage, FaCompress } from 'react-icons/fa';
import { callDeleteEndpoint, isCloudinaryUrl } from '../../config/cloudinary';
import { getPublicId } from '../../utils/image';
import { FALLBACK_DATA_URI } from './SafeImage';

// Maximum file size allowed by Cloudinary Free plan (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10,485,760 bytes

/**
 * Compresses an image to fit within the Cloudinary Free plan's 10MB limit.
 * Uses canvas to reduce image quality/size iteratively.
 */
const compressImage = (file, maxSize = MAX_FILE_SIZE) => {
  return new Promise((resolve, reject) => {
    // If file is already under limit, return as-is
    if (file.size <= maxSize) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        // Start with reduced quality and dimensions
        let quality = 0.8;
        let maxDim = Math.max(img.width, img.height);
        let targetWidth = img.width;
        let targetHeight = img.height;

        const compress = () => {
          // Reduce dimensions if image is large
          if (maxDim > 2000) {
            const scale = 2000 / maxDim;
            targetWidth = Math.round(img.width * scale);
            targetHeight = Math.round(img.height * scale);
          }

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // Try compression with current quality
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Canvas compression failed'));
                return;
              }
              if (blob.size <= maxSize || quality <= 0.1) {
                // Acceptable size reached
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                // Reduce quality and try again
                quality -= 0.15;
                if (quality < 0.3) {
                  // Also reduce dimensions further
                  targetWidth = Math.round(targetWidth * 0.8);
                  targetHeight = Math.round(targetHeight * 0.8);
                  quality = 0.5;
                }
                compress();
              }
            },
            'image/jpeg',
            quality
          );
        };
        compress();
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
};

const ImageUploader = ({ images = [], onImagesChange, maxFiles = 1, folder = 'uploads', accept = 'image/*', label = 'Upload Image' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Validate if Cloudinary is configured
  const isCloudinaryConfigured = () => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    return cloudName && uploadPreset && 
           cloudName !== 'your-cloud-name' && 
           uploadPreset !== 'your-upload-preset' &&
           !cloudName.includes('your-');
  };

  const uploadToCloudinary = useCallback(async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', `be-construction/${folder}`);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );

    if (!response.ok) {
      let errorMsg = `Upload failed (${response.status})`;
      try {
        const errorData = await response.json();
        if (errorData.error?.message) {
          errorMsg += `: ${errorData.error.message}`;
        }
      } catch {
        // ignore parse errors
      }
      throw new Error(errorMsg);
    }
    const data = await response.json();
    return { url: data.secure_url, public_id: data.public_id, raw: data };
  }, [folder]);

  const handleFiles = useCallback(async (files) => {
    const validFiles = Array.from(files).filter(file => {
      if (maxFiles === 1) return true;
      return file.type.startsWith('image/');
    });

    if (validFiles.length === 0) return;

    // Check if using URL mode (when Cloudinary is not configured)
    if (!isCloudinaryConfigured()) {
      // Fallback: use object URLs for preview (dev mode) and wrap as {url}
      const urls = validFiles.map(file => ({ url: URL.createObjectURL(file) }));
      const newImages = maxFiles === 1 ? [urls[0]] : [...(images || []), ...urls].slice(0, maxFiles);
      onImagesChange(newImages);
      return;
    }

    setIsUploading(true);
    try {
      // Compress files that exceed the Cloudinary Free plan's 10MB limit
      const compressedFiles = await Promise.all(
        validFiles.map(async (file) => {
          if (file.size > MAX_FILE_SIZE) {
            setIsCompressing(true);
            const compressed = await compressImage(file);
            setIsCompressing(false);
            return compressed;
          }
          return file;
        })
      );

      const uploadPromises = compressedFiles.map(file => uploadToCloudinary(file));
      const uploadedData = await Promise.all(uploadPromises);

      const newImages = maxFiles === 1
        ? [uploadedData[0]]
        : [...(images || []), ...uploadedData].slice(0, maxFiles);

      onImagesChange(newImages);
    } catch (error) {
      console.error('Upload error:', error);

      // Show a meaningful error message to help diagnose the issue
      let userMessage = 'Failed to upload image. ';
      if (error.message.includes('File size too large') || error.message.includes('max_file_size')) {
        userMessage += 'File exceeds the maximum allowed size (100MB).';
      } else if (error.message.includes('Upload preset') || error.message.includes('Invalid upload preset')) {
        userMessage += 'Invalid Cloudinary upload preset. Check VITE_CLOUDINARY_UPLOAD_PRESET in .env';
      } else if (error.message.includes('404')) {
        userMessage += 'Cloudinary service unavailable. Check your Cloud Name in VITE_CLOUDINARY_CLOUD_NAME';
      } else {
        userMessage += error.message;
      }

      alert(userMessage);
    } finally {
      setIsUploading(false);
    }
  }, [images, maxFiles, onImagesChange, uploadToCloudinary]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleFileSelect = (e) => {
    handleFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index) => {
    const url = currentImages[index];

    // If Cloudinary configured and delete endpoint is provided, call secure deletion
    if (import.meta.env.VITE_CLOUDINARY_DELETE_URL) {
      (async () => {
        try {
          const publicId = getPublicId(url) || getPublicId(images?.[index]) || null;
          // Prefer public_id when available; otherwise pass full url for server parsing
          await callDeleteEndpoint(publicId ? { public_id: publicId } : { url });
        } catch (err) {
          console.error('Failed to delete from Cloudinary:', err);
          // proceed to remove locally anyway
        }
      })();
    }

    if (maxFiles === 1) {
      onImagesChange(null);
    } else {
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    }
  };

  const currentImages = images ? (Array.isArray(images) ? images : [images]) : [];
  const hasReachedMax = maxFiles !== 999 && currentImages.length >= maxFiles;

  return (
    <div className="space-y-3">
      <label className="form-label">{label}</label>

      {/* Upload Area */}
      {!hasReachedMax && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragOver 
              ? 'border-primary-500 bg-primary-500/5' 
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={maxFiles !== 1}
            onChange={handleFileSelect}
            className="hidden"
          />

          {isCompressing ? (
            <div className="flex flex-col items-center">
              <FaCompress className="text-4xl text-amber-500 animate-pulse mb-3" />
              <p className="text-sm font-medium text-black">Compressing large image...</p>
              <p className="text-xs text-gray-500 mt-1">Reducing file size to fit Cloudinary limits</p>
            </div>
          ) : isUploading ? (
            <div className="flex flex-col items-center">
              <FaSpinner className="text-4xl text-primary-500 animate-spin mb-3" />
              <p className="text-sm font-medium text-black">Uploading to Cloudinary...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-xl bg-primary-500/10 flex items-center justify-center mb-3">
                <FaCloudUploadAlt className="text-3xl text-primary-500" />
              </div>
              <p className="text-sm font-medium text-black">
                Drop {maxFiles === 1 ? 'image' : 'images'} here or <span className="text-primary-500 font-semibold">browse</span>
              </p>
              <p className="text-xs text-black mt-1">
                PNG, JPG, WebP up to 100MB (auto-compressed for Cloudinary){maxFiles !== 1 && ` (max ${maxFiles} files)`}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Image Preview Grid */}
      {currentImages.length > 0 && (
        <div className={`grid gap-3 ${maxFiles === 1 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
          {currentImages.map((url, index) => (
            <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover"
                onError={(e) => {
                  // Prevent infinite loop
                  e.target.onerror = null;
                  e.target.src = FALLBACK_DATA_URI;
                }}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <FaTrash className="text-white text-xs" />
                </button>
              </div>
              <div className="absolute top-2 left-2">
                <FaCheckCircle className="text-green-400 text-sm drop-shadow" />
              </div>
            </div>
          ))}

          {/* Add more button */}
          {!hasReachedMax && maxFiles !== 1 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-32 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-400 hover:bg-gray-50 flex flex-col items-center justify-center transition-all"
            >
              <FaImage className="text-gray-400 text-xl mb-1" />
              <span className="text-xs text-black">Add More</span>
            </button>
          )}
        </div>
      )}

      {/* Help text */}
      {!isCloudinaryConfigured() && (
        <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
          ⚠️ Cloudinary not configured. Images will use temporary URLs. 
          Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env for cloud uploads.
        </p>
      )}
    </div>
  );
};

export default ImageUploader;