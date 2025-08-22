import React, { useState, useRef } from 'react';

const ImageUpload = ({ onImageUpload, initialImage = '' }) => {
  const [previewUrl, setPreviewUrl] = useState(initialImage);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // Notify parent component
    onImageUpload(file);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="mb-4">
      <div className="flex items-center space-x-4">
        {previewUrl ? (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="h-24 w-24 object-cover rounded border"
            />
            <button
              type="button"
              onClick={() => {
                setPreviewUrl('');
                onImageUpload(null);
              }}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        ) : (
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        )}
        
        <div>
          <button
            type="button"
            onClick={handleClick}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            {previewUrl ? 'Change Image' : 'Upload Image'}
          </button>
          <p className="mt-1 text-xs text-gray-500">
            JPG, PNG, GIF up to 5MB
          </p>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;