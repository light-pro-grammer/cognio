import { useState, useRef, useEffect } from 'react';
import ImageDropzone from './ImageDropzone';

const TextAreaWithImageDropzone = ({ value, onChange, onSelect, placeholder }) => {
  const [cursorPosition, setCursorPosition] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const textAreaRef = useRef();

  const onImageUpload = (markdownImage) => {
    const beforeCursor = value.substring(0, cursorPosition);
    const afterCursor = value.substring(cursorPosition);
    const newValue = beforeCursor + markdownImage + afterCursor;
    onChange(newValue);
  };

  const handleInputChange = (e) => {
    onChange(e.target.value);
    const lineNumber = e.target.value.substr(0, cursorPosition).split('\n').length;
    const totalLines = e.target.value.split('\n').length;
    if (lineNumber === totalLines) {
      e.target.style.height = `${calcHeight(e.target.value)}px`;
    }
  };

  useEffect(() => {
    const dragEvents = ['dragenter', 'dragover'];
    const dragActiveHandler = () => setIsDragActive(true);
    const dragInactiveHandler = () => setIsDragActive(false);

    dragEvents.forEach((event) => {
      window.addEventListener(event, dragActiveHandler);
    });

    window.addEventListener('drop', dragInactiveHandler);
    window.addEventListener('dragleave', dragInactiveHandler);

    return () => {
      dragEvents.forEach((event) => {
        window.removeEventListener(event, dragActiveHandler);
      });

      window.removeEventListener('drop', dragInactiveHandler);
      window.removeEventListener('dragleave', dragInactiveHandler);
    };
  }, []);

  const calcHeight = (value) => {
    let numberOfLineBreaks = (value.match(/\n/g) || []).length;
    // min-height + lines x line-height + padding + border
    return 94 + numberOfLineBreaks * 24 + 16 + 2;
  };

  return (
    <div className="relative flex-1">
      <textarea
        ref={textAreaRef}
        className="textarea resize-ta w-full h-28 overflow-auto resize-none border border-gray-300 p-2 text-base rounded-md"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onSelect={(e) => setCursorPosition(e.target.selectionStart)}
        style={{ position: 'relative', zIndex: isDragActive ? 0 : 1 }}
      />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: isDragActive ? 1 : 0 }}>
        <ImageDropzone onImageUpload={onImageUpload} setIsDragActive={setIsDragActive} />
      </div>
    </div>
  );
};

export default TextAreaWithImageDropzone;
