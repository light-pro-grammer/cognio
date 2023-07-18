import React from 'react';
import { useDropzone } from 'react-dropzone';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from './firebase';

const ImageDropzone = ({ onImageUpload, setIsDragActive }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      setIsDragActive(false);
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
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false),
    accept: 'image/*',
    noClick: true,
  });

  const baseStyle = {
    width: '100%',
    height: '100%',
    transition: 'border .24s ease-in-out',
    backgroundColor: 'transparent',
  };

  const activeStyle = {
    borderColor: '#2196f3',
  };

  const style = { ...baseStyle, ...(isDragActive ? activeStyle : {}) };

  return (
    <div {...getRootProps()} style={style}>
      <input {...getInputProps()} />
    </div>
  );
};

export default ImageDropzone;
