// components/NoteEditor.tsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import CodeBlock from '@tiptap/extension-code-block';
import TextAlign from '@tiptap/extension-text-align';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Link from '@tiptap/extension-link';
// NEW: For text color
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import {
  Bold, Italic, Underline as UnderlineIcon, Code2, Subscript as SubIcon,
  Superscript as SuperIcon, ImageIcon, LinkIcon, AlignLeft,
  AlignCenter, AlignRight, Strikethrough, List, ListOrdered,
  Minus, Undo, Redo, Table as TableIcon, TextQuote, Pilcrow, Paintbrush
} from 'lucide-react'; // Import more icons
import React, { useRef, useCallback } from 'react';
  
import ResizableImage from '@/components/resizeable-image';

// Import your custom CSS files
import './../styles/tiptap.css';
import './../styles/resizeable.css'; // For image resizing

const MenuBar = ({ editor }: { editor: any }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;

        if (imageUrl) {
          editor.chain().focus().setImage({ src: imageUrl, width: '100%' }).run();
        }
      };
      reader.readAsDataURL(file);
      event.target.value = '';
    }
  }, [editor]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const addTable = useCallback(() => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const addTableRowAfter = useCallback(() => {
    editor.chain().focus().addRowAfter().run();
  }, [editor]);

  const addTableColAfter = useCallback(() => {
    editor.chain().focus().addColumnAfter().run();
  }, [editor]);

  const deleteTable = useCallback(() => {
    editor.chain().focus().deleteTable().run();
  }, [editor]);

  const deleteRow = useCallback(() => {
    editor.chain().focus().deleteRow().run();
  }, [editor]);

  const deleteColumn = useCallback(() => {
    editor.chain().focus().deleteColumn().run();
  }, [editor]);

  const toggleHighlight = useCallback((color: string) => {
    editor.chain().focus().toggleHighlight({ color }).run();
  }, [editor]);

  const setTextColor = useCallback((color: string) => {
    editor.chain().focus().setColor(color).run();
  }, [editor]);

  const clearColor = useCallback(() => {
    editor.chain().focus().unsetColor().run();
  }, [editor]);


  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-800 p-2 rounded-md mb-4 sticky top-0 z-10 shadow-sm">
      {/* Basic Formatting */}
      <div className="menu-group">
        <button
          className={`btn ${editor.isActive('bold') ? 'is-active' : ''}`}
          title="Bold (Ctrl+B)"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          className={`btn ${editor.isActive('italic') ? 'is-active' : ''}`}
          title="Italic (Ctrl+I)"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          className={`btn ${editor.isActive('underline') ? 'is-active' : ''}`}
          title="Underline (Ctrl+U)"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <button
          className={`btn ${editor.isActive('strike') ? 'is-active' : ''}`}
          title="Strikethrough (Ctrl+Shift+X)"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        <button
          className={`btn ${editor.isActive('code') ? 'is-active' : ''}`}
          title="Inline Code (Ctrl+E)"
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code2 className="w-4 h-4" />
        </button>
        <button
          className={`btn ${editor.isActive('subscript') ? 'is-active' : ''}`}
          title="Subscript"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
        >
          <SubIcon className="w-4 h-4" />
        </button>
        <button
          className={`btn ${editor.isActive('superscript') ? 'is-active' : ''}`}
          title="Superscript"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
        >
          <SuperIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Text Align */}
      <div className="menu-group">
        <button
          className={`btn ${editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}`}
          title="Align Left"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          className={`btn ${editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}`}
          title="Align Center"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          className={`btn ${editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}`}
          title="Align Right"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <AlignRight className="w-4 h-4" />
        </button>
      </div>

      {/* Block Types / Headings */}
      <div className="menu-group">
        <button
          className={`btn ${editor.isActive('paragraph') ? 'is-active' : ''}`}
          title="Paragraph"
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <Pilcrow className="w-4 h-4" />
        </button>
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <button
            key={level}
            className={`btn ${editor.isActive('heading', { level }) ? 'is-active' : ''}`}
            title={`Heading ${level}`}
            onClick={() => editor.chain().focus().setHeading({ level }).run()}
          >
            H{level}
          </button>
        ))}
        <button
          className={`btn ${editor.isActive('blockquote') ? 'is-active' : ''}`}
          title="Blockquote (Ctrl+Shift+B)"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <TextQuote className="w-4 h-4" />
        </button>
        <button
          className={`btn ${editor.isActive('codeBlock') ? 'is-active' : ''}`}
          title="Code Block"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2 className="w-4 h-4" />
        </button>
      </div>

      {/* Lists */}
      <div className="menu-group">
        <button
          className={`btn ${editor.isActive('bulletList') ? 'is-active' : ''}`}
          title="Bullet List (Ctrl+Shift+8)"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          className={`btn ${editor.isActive('orderedList') ? 'is-active' : ''}`}
          title="Ordered List (Ctrl+Shift+7)"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      {/* Insertions */}
      <div className="menu-group">
        <button
          className="btn"
          title="Insert Image from File"
          onClick={triggerFileInput}
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <input
          ref={fileInputRef}
          accept="image/*"
          aria-label="Upload Image"
          style={{ display: 'none' }}
          type="file"
          onChange={handleImageUpload}
        />
        <button
          className={`btn ${editor.isActive('link') ? 'is-active' : ''}`}
          title="Set Link (Ctrl+K)"
          onClick={() => {
            const url = prompt('Enter URL');

            if (editor.isActive('link') && !url) {
              editor.chain().focus().unsetLink().run();

              return;
            }
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          className="btn"
          title="Horizontal Rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Table Controls */}
      {editor.isActive('table') ? (
        <div className="menu-group">
          <button className="btn" title="Add Column After" onClick={addTableColAfter}>
            <span className="text-sm">Col+</span>
          </button>
          <button className="btn" title="Add Row After" onClick={addTableRowAfter}>
            <span className="text-sm">Row+</span>
          </button>
          <button className="btn" title="Delete Row" onClick={deleteRow}>
            <span className="text-sm">Del Row</span>
          </button>
          <button className="btn" title="Delete Column" onClick={deleteColumn}>
            <span className="text-sm">Del Col</span>
          </button>
          <button className="btn" title="Delete Table" onClick={deleteTable}>
            <TableIcon className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="menu-group">
          <button className="btn" title="Insert Table" onClick={addTable}>
            <TableIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Colors and Highlight (Advanced) */}
      <div className="menu-group">
        <input
          className="btn-color-picker"
          title="Text Color"
          type="color"
          value={editor.getAttributes('textStyle').color || '#000000'}
          onInput={(event: React.ChangeEvent<HTMLInputElement>) => setTextColor(event.target.value)}
        />
        <button
          className="btn"
          title="Clear Text Color"
          onClick={clearColor}
        >
          <Paintbrush className="w-4 h-4" />
        </button>
        <button
          className={`btn ${editor.isActive('highlight', { color: '#ffff00' }) ? 'is-active' : ''}`}
          style={{ backgroundColor: '#ffff00', color: '#000' }}
          title="Highlight Yellow"
          onClick={() => toggleHighlight('#ffff00')}
        >
          H
        </button>
        <button
          className={`btn ${editor.isActive('highlight', { color: '#add8e6' }) ? 'is-active' : ''}`}
          style={{ backgroundColor: '#add8e6', color: '#000' }}
          title="Highlight Light Blue"
          onClick={() => toggleHighlight('#add8e6')}
        >
          H
        </button>
        <button
          className={`btn ${editor.isActive('highlight') ? 'is-active' : ''}`}
          title="Clear Highlight"
          onClick={() => editor.chain().focus().unsetHighlight().run()}
        >
          <Paintbrush className="w-4 h-4" />
        </button>
      </div>


      {/* Undo/Redo */}
      <div className="menu-group ml-auto">
        <button
          className="btn"
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          className="btn"
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};


const NoteEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
        strike: false,
        code: false,
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        codeBlock: {},
        bulletList: {},
        orderedList: {},
        listItem: {},
        blockquote: {},
        horizontalRule: {},
        hardBreak: {},
        history: {},
        paragraph: {},
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({ placeholder: 'Start typing your note...' }),
      Subscript,
      Superscript,
      ResizableImage.configure({
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      CodeBlock.configure({}), // Ensure CodeBlock is correctly configured if not done via StarterKit
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TextStyle,
      Color,
    ],
    content: '',
  });

  return (
    <div className="max-w-3xl mx-auto p-4 border rounded-xl shadow bg-white dark:bg-gray-900 dark:text-white">
      <MenuBar editor={editor} />
      <EditorContent className="ProseMirror" editor={editor} />
    </div>
  );
};

export default NoteEditor;