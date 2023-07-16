import React from 'react';
import { useDropzone } from 'react-dropzone';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from './firebase';

const ImageDropzone = ({ onImageUpload }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      acceptedFiles.forEach(async (file) => {
        const storageRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // You can use this part to display the progress of the upload
          },
          (error) => {
            console.error('Error uploading image: ', error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              const markdownImage = `![${file.name}](${downloadURL})`;
              onImageUpload(markdownImage);
            });
          }
        );
      });
    },
    accept: 'image/*',
    noClick: true,
  });

  const baseStyle = {
    borderWidth: 1,
    borderColor: '#c9c7c7',
    borderRadius: 5,
    borderStyle: 'solid',
    padding: '20px',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // semi-transparent background
  };

  const activeStyle = {
    borderColor: '#2196f3',
  };

  const style = isDragActive ? { ...baseStyle, ...activeStyle } : baseStyle;

  return (
    <div {...getRootProps()} style={style}>
      <input {...getInputProps()} />
      <p style={{ color: '#c9c7c7' }}>Drop the images here ...</p>
    </div>
  );
};

export default ImageDropzone;
