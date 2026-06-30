import React, { useState, useRef } from 'react';
import { UploadCloud, Loader2, Image as ImageIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ImageUpload({ onUpload, initialImage = '', label = 'Upload Image', variant = 'default' }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(initialImage);
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    setPreview(initialImage || '');
  }, [initialImage]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, WEBP)');
      return;
    }

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      
      // Set local preview immediately
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Create FormData
      const formData = new FormData();
      formData.append('image', file);

      // Extract base URL from graphql URI or use localhost default
      const apiUrl = (process.env.NEXT_PUBLIC_GRAPHQL_HTTP_URL || 'http://localhost:4000/graphql')
        .replace('/graphql', '/api/upload');

      const token = localStorage.getItem('token');

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData,
        // Don't set Content-Type header, let browser set it with boundary for multipart/form-data
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const data = await response.json();
      
      if (data.url) {
        setPreview(data.url);
        if (onUpload) {
          onUpload(data.url);
        }
        toast.success('Image uploaded successfully');
      } else {
        throw new Error('No URL returned from server');
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'An error occurred during upload');
      setPreview(initialImage); // Revert preview on failure
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation(); // Prevent triggering file input click
    setPreview('');
    if (onUpload) {
      onUpload('');
    }
  };

  if (variant === 'button') {
    return (
      <div className="w-full">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept="image/jpeg, image/png, image/webp" 
          className="hidden" 
        />
        <button 
          onClick={(e) => {
            e.preventDefault();
            if (!isUploading) fileInputRef.current?.click();
          }}
          disabled={isUploading}
          className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg py-2 text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
        >
          {isUploading ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</> : label}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      {label && <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</label>}
      
      <div 
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative w-full border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer
          flex flex-col items-center justify-center text-center overflow-hidden
          ${isDragging ? 'border-brand bg-brand/5' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}
          ${isUploading ? 'opacity-70 pointer-events-none' : ''}
          ${preview ? 'p-0 border-none' : 'min-h-[160px]'}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept="image/jpeg, image/png, image/webp" 
          className="hidden" 
        />

        {isUploading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 text-brand animate-spin mb-2" />
            <span className="text-xs font-bold text-brand uppercase tracking-wider">Uploading...</span>
          </div>
        )}

        {preview && !isUploading ? (
          <div className="relative w-full h-full group aspect-video sm:aspect-[21/9] md:aspect-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover rounded-xl shadow-sm border border-slate-200"
              onError={(e) => {
                console.error("Failed to load image preview:", preview);
                e.currentTarget.src = "https://placehold.co/800x400?text=Preview+Failed";
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
              <span className="bg-white/90 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                Change Image
              </span>
              <button 
                onClick={handleRemove}
                className="bg-rose-500/90 text-white p-1.5 rounded-lg shadow-sm hover:bg-rose-600 transition-colors"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : !preview ? (
          <div className="flex flex-col items-center space-y-2">
            <div className={`p-3 rounded-full ${isDragging ? 'bg-brand/10 text-brand' : 'bg-slate-200 text-slate-400'}`}>
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">Click or drag image to upload</p>
              <p className="text-xs text-slate-400 mt-1">JPEG, PNG, WEBP (max 5MB)</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
