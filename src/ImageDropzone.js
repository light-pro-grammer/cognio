// import React, { useCallback, useState, useRef } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { db, storage } from './firebase';
// import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
// import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';

// const Dropzone = () => {
//   const [selectedImages, setSelectedImages] = useState([]);
//   const captionRef = useRef(null);
//   const uploadPost = async () => {
//     const docRef = await addDoc(collection(db, 'cards'), {
//       caption: captionRef.current.value,
//       imageUrl: selectedImages[0].preview,
//       createdAt: serverTimestamp(),
//     });
//   };

//   const onDrop = useCallback((acceptedFiles) => {
//     setSelectedImages(
//       acceptedFiles.map((file) =>
//         Object.assign(file, {
//           preview: URL.createObjectURL(file),
//         })
//       )
//     );
//   }, []);
//   const { getRootProps, getInputProps } = useDropzone({ onDrop });
//   const selected_images = selectedImages?.map((image) => (
//     <img src={image.preview} key={image.name} style={{ width: '200px' }} alt="" />
//   ));

//   return (
//     <div>
//       <div {...getRootProps()}>
//         <input {...getInputProps()} />
//         <p>Drop the files here ...</p>
//       </div>
//       <input type="text" ref={captionRef} placeholder="Caption" />
//       <button onClick={uploadPost}>Post</button>
//       {selected_images}
//     </div>
//   );
// };

// export default Dropzone;
// import React, { useCallback, useState, useEffect } from 'react';
// import { useDropzone } from 'react-dropzone';
// import { storage } from './firebase';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// const Dropzone = ({ setImages }) => {
//   const [uploading, setUploading] = useState(false);
//   const onDrop = useCallback(
//     async (acceptedFiles) => {
//       setUploading(true);

//       const imagesPromises = acceptedFiles.map((file) => {
//         return new Promise((resolve, reject) => {
//           const uploadTask = uploadBytes(ref(storage, `images/${file.name}`), file);
//           uploadTask
//             .then((snapshot) => {
//               return getDownloadURL(snapshot.ref);
//             })
//             .then((downloadURL) => {
//               resolve({ name: file.name, url: downloadURL });
//             })
//             .catch((err) => {
//               reject(err);
//             });
//         });
//       });

//       Promise.all(imagesPromises)
//         .then((images) => {
//           setImages((prevImages) => [...prevImages, ...images]);
//           setUploading(false);
//         })
//         .catch((err) => {
//           console.error(err);
//           setUploading(false);
//         });
//     },
//     [setImages]
//   );

//   const { getRootProps, getInputProps } = useDropzone({ onDrop });

//   useEffect(() => {
//     if (uploading) {
//       console.log('Upload in progress...');
//     }
//   }, [uploading]);

//   return (
//     <div {...getRootProps()} style={{ border: '1px dashed black', padding: '20px' }}>
//       <input {...getInputProps()} />
//       <p>Drag 'n' drop some files here, or click to select files</p>
//     </div>
//   );
// };

// export default Dropzone;

import { useDropzone } from 'react-dropzone';

const Dropzone = ({ onFileChange }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      onFileChange(acceptedFiles[0]);
    },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  );
};

export default Dropzone;
