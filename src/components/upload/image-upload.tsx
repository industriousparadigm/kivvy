'use client';

import { useState, useRef } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  disabled?: boolean;
  accept?: string;
  className?: string;
  folder?: string;
}

export function ImageUpload({
  value = [],
  onChange,
  multiple = false,
  maxFiles = 5,
  disabled = false,
  accept = 'image/*',
  className = '',
  folder = 'kivvy/activities',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < Math.min(files.length, maxFiles); i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const { url } = await response.json();
          uploadedUrls.push(url);
        }
      }

      const updatedUrls = multiple ? [...value, ...uploadedUrls] : uploadedUrls;
      onChange(updatedUrls);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedUrls = value.filter((_, i) => i !== index);
    onChange(updatedUrls);
  };

  const cloudinaryConfig = {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  };

  const canUploadMore = value.length < maxFiles;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Button */}
      {canUploadMore && (
        <div className="flex gap-2">
          {/* Cloudinary Upload (Recommended) */}
          {cloudinaryConfig.cloudName && cloudinaryConfig.uploadPreset && (
            <CldUploadWidget
              uploadPreset={cloudinaryConfig.uploadPreset}
              options={
                {
                  multiple,
                  maxFiles: maxFiles - value.length,
                  resourceType: 'image',
                  folder,
                } as any
              }
              onSuccess={(results: any) => {
                if (
                  results.event === 'success' &&
                  results.info &&
                  typeof results.info !== 'string'
                ) {
                  const newUrl = results.info.secure_url;
                  const updatedUrls = multiple ? [...value, newUrl] : [newUrl];
                  onChange(updatedUrls);
                }
              }}
            >
              {({ open }) => (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => open()}
                  disabled={disabled || isUploading}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {isUploading ? 'A enviar...' : 'Carregar Imagem'}
                </Button>
              )}
            </CldUploadWidget>
          )}

          {/* Fallback File Input */}
          <div className="relative">
            <Input
              ref={fileInputRef}
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={e => {
                const files = e.target.files;
                if (files) {
                  handleFileUpload(files);
                }
              }}
              disabled={disabled || isUploading}
              className="hidden"
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
              className="flex items-center gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              Selecionar Ficheiro
            </Button>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full animate-pulse"
            style={{ width: '60%' }}
          />
        </div>
      )}

      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={url}
                  alt={`Imagem ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                disabled={disabled}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Limit Info */}
      {value.length > 0 && (
        <p className="text-sm text-gray-500">
          {value.length} de {maxFiles} imagens carregadas
        </p>
      )}

      {/* No Images State */}
      {value.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Nenhuma imagem selecionada</p>
          <p className="text-sm text-gray-500">
            Carregue até {maxFiles} imagens para a sua atividade
          </p>
        </div>
      )}
    </div>
  );
}

// Simple single image upload component
export function SingleImageUpload({
  value,
  onChange,
  disabled = false,
  className = '',
}: {
  value?: string;
  onChange: (url: string | undefined) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}) {
  return (
    <ImageUpload
      value={value ? [value] : []}
      onChange={urls => onChange(urls[0])}
      multiple={false}
      maxFiles={1}
      disabled={disabled}
      className={className}
    />
  );
}

// Avatar upload component
export function AvatarUpload({
  value,
  onChange,
  disabled = false,
  className = '',
  size = 'lg',
}: {
  value?: string;
  onChange: (url: string | undefined) => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className={`relative ${sizeClasses[size]} mx-auto`}>
        <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100">
          {value ? (
            <img
              src={value}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            disabled={disabled}
            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <SingleImageUpload
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="text-center"
      />
    </div>
  );
}
