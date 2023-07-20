import { EditorContent, useEditor, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { lowlight } from 'lowlight';
import './EditorStyles.css';
import {
  BsTypeBold,
  BsTypeItalic,
  BsTypeUnderline,
  BsTypeStrikethrough,
  BsTypeH1,
  BsTypeH2,
  BsTypeH3,
  BsCardImage,
} from 'react-icons/bs';
import { BiCode, BiCodeBlock, BiUndo, BiRedo } from 'react-icons/bi';
import { TbBlockquote } from 'react-icons/tb';
import { VscHorizontalRule } from 'react-icons/vsc';
import { LuHighlighter } from 'react-icons/lu';
import { MdOutlineFormatClear, MdFormatListBulleted, MdFormatListNumbered } from 'react-icons/md';
import { TbClearFormatting } from 'react-icons/tb';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('URL');

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="editor-buttons">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        <BsTypeBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        <BsTypeItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'is-active' : ''}
      >
        <BsTypeUnderline />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        <BsTypeStrikethrough />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active' : ''}
      >
        <BiCode />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={editor.isActive('highlight') ? 'is-active' : ''}
      >
        <LuHighlighter />
      </button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        <MdOutlineFormatClear />
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        <TbClearFormatting />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        <BsTypeH1 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        <BsTypeH2 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        <BsTypeH3 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        <MdFormatListBulleted />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        <MdFormatListNumbered />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
      >
        <BiCodeBlock />
      </button>
      <button onClick={addImage}>
        <BsCardImage />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        <TbBlockquote />
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <VscHorizontalRule />
      </button>
      <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()}>
        <BiUndo />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()}>
        <BiRedo />
      </button>
    </div>
  );
};

const EditorComponent = ({ content, setContent, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      Underline,
      Placeholder.configure({
        placeholder: placeholder, // Use the placeholder prop here
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      // Update the state when the editor content changes
      setContent(editor.getHTML());
    },
  });

  return (
    <div>
      <MenuBar editor={editor} />
      {editor && (
        <BubbleMenu className="bubble-menu" tippyOptions={{ duration: 100 }} editor={editor}>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'is-active' : ''}
          >
            <BsTypeBold />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'is-active' : ''}
          >
            <BsTypeItalic />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'is-active' : ''}
          >
            <BsTypeUnderline />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'is-active' : ''}
          >
            <BsTypeStrikethrough />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={editor.isActive('code') ? 'is-active' : ''}
          >
            <BiCode />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={editor.isActive('highlight') ? 'is-active' : ''}
          >
            <LuHighlighter />
          </button>
          <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
            <MdOutlineFormatClear />
          </button>
          <button onClick={() => editor.chain().focus().clearNodes().run()}>
            <TbClearFormatting />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
          >
            <BsTypeH1 />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
          >
            <BsTypeH2 />
          </button>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} className="content-editor" />
    </div>
  );
};

export default EditorComponent;
