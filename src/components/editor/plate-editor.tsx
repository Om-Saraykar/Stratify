'use client';

import * as React from 'react';

import { Plate, usePlateEditor } from 'platejs/react';

import { EditorKit } from '@/components/editor/editor-kit';
import { SettingsDialog } from '@/components/editor/settings-dialog';
import { Editor, EditorContainer } from '@/components/ui/editor';

export function PlateEditor() {
  const editor = usePlateEditor({
    plugins: EditorKit,
    value,
  });

  return (
    <Plate editor={editor}>
      <EditorContainer>
        <Editor variant="default" />
      </EditorContainer>

      <SettingsDialog />
    </Plate>
  );
}

const value = [
  {
    type: 'h1',
    children: [{ text: 'Stratify – Your AI Notes Companion' }],
  },
  {
    type: 'p',
    children: [
      { text: 'Stratify lets you capture, organize, and enhance your thoughts with AI assistance. Built with ' },
      { children: [{ text: 'Slate' }], type: 'a', url: 'https://slatejs.org' },
      { text: ' and ' },
      { children: [{ text: 'React' }], type: 'a', url: 'https://reactjs.org' },
      { text: ", this editor is part of Stratify's powerful productivity suite. " },
      { children: [{ text: 'Explore the full platform' }], type: 'a', url: '/about' },
      { text: ' to learn more.' },
    ],
  },
  {
    type: 'h2',
    children: [{ text: 'Collaborative Notes & Journals' }],
  },
  {
    type: 'p',
    children: [
      { text: 'Edit, review, and collaborate in real-time. Add ' },
      {
        children: [
          {
            suggestion: true,
            suggestion_playground1: {
              id: 'playground1',
              createdAt: Date.now(),
              type: 'insert',
              userId: 'alice',
            },
            text: 'suggestions',
          },
        ],
        type: 'a',
        url: '/docs/suggestion',
      },
      {
        suggestion: true,
        suggestion_playground1: {
          id: 'playground1',
          createdAt: Date.now(),
          type: 'insert',
          userId: 'alice',
        },
        text: ' ',
      },
      {
        suggestion: true,
        suggestion_playground1: {
          id: 'playground1',
          createdAt: Date.now(),
          type: 'insert',
          userId: 'alice',
        },
        text: 'like this added text',
      },
      { text: ' or ' },
      {
        suggestion: true,
        suggestion_playground2: {
          id: 'playground2',
          createdAt: Date.now(),
          type: 'remove',
          userId: 'bob',
        },
        text: 'remove parts that are no longer relevant',
      },
      { text: '. Provide feedback using ' },
      {
        children: [{ comment: true, comment_discussion4: true, text: 'comments' }],
        type: 'a',
        url: '/docs/comment',
      },
      {
        comment: true,
        comment_discussion4: true,
        text: ' like this one',
      },
      { text: '. You can even apply ' },
      {
        comment: true,
        comment_discussion6: true,
        suggestion: true,
        suggestion_playground3: {
          id: 'playground3',
          createdAt: Date.now(),
          type: 'insert',
          userId: 'charlie',
        },
        text: 'overlapping annotations',
      },
      { text: ' for complex collaborative discussions.' },
    ],
  },
  {
    type: 'h2',
    children: [{ text: 'AI Assistant Shortcuts' }],
  },
  {
    type: 'p',
    children: [
      { text: 'Use Stratify AI to summarize, rewrite, or continue writing. Press ' },
      { kbd: true, text: '⌘+J' },
      { text: ' or ' },
      { kbd: true, text: 'Space' },
      { text: ' on a new line to activate.' },
    ],
  },
  {
    type: 'p',
    indent: 1,
    listStyleType: 'disc',
    children: [{ text: 'Summarize lengthy notes or lectures' }],
  },
  {
    type: 'p',
    indent: 1,
    listStyleType: 'disc',
    children: [{ text: 'Fix grammar or adjust tone' }],
  },
  {
    type: 'p',
    indent: 1,
    listStyleType: 'disc',
    children: [{ text: 'Generate task lists or daily reflections' }],
  },
  {
    type: 'h2',
    children: [{ text: 'Journaling with Insight' }],
  },
  {
    type: 'p',
    children: [
      { text: 'Log your day, thoughts, or goals. Stratify’s journaling tools offer AI-powered prompts and stress tracking insights over time.' },
    ],
  },
  {
    type: 'h2',
    children: [{ text: 'Formatting & Structure' }],
  },
  {
    type: 'p',
    children: [
      { text: 'Use ' },
      { children: [{ text: 'headings' }], type: 'a', url: '/docs/heading' },
      { text: ', ' },
      { children: [{ text: 'lists' }], type: 'a', url: '/docs/list' },
      { text: ', ' },
      { children: [{ text: 'quotes' }], type: 'a', url: '/docs/blockquote' },
      { text: ', and Markdown-like formatting such as ' },
      { bold: true, text: 'bold' },
      { text: ', ' },
      { italic: true, text: 'italic' },
      { text: ', ' },
      { text: 'underline', underline: true },
      { text: ', and ' },
      { strikethrough: true, text: 'strikethrough' },
      { text: ' to keep your notes clear and expressive.' },
    ],
  },
  {
    type: 'blockquote',
    children: [
      {
        type: 'p',
        children: [{ text: 'Reflect. Refocus. Rise higher. – Stratify AI' }],
      },
    ],
  },
  {
    "type": "code_block",
    "lang": "python",
    "children": [
      { "type": "code_line", "children": [{ "text": "def binary_search(arr, target):" }] },
      { "type": "code_line", "children": [{ "text": "    left, right = 0, len(arr) - 1" }] },
      { "type": "code_line", "children": [{ "text": "    while left <= right:" }] },
      { "type": "code_line", "children": [{ "text": "        mid = (left + right) // 2" }] },
      { "type": "code_line", "children": [{ "text": "        if arr[mid] == target:" }] },
      { "type": "code_line", "children": [{ "text": "            return mid" }] },
      { "type": "code_line", "children": [{ "text": "        elif arr[mid] < target:" }] },
      { "type": "code_line", "children": [{ "text": "            left = mid + 1" }] },
      { "type": "code_line", "children": [{ "text": "        else:" }] },
      { "type": "code_line", "children": [{ "text": "            right = mid - 1" }] },
      { "type": "code_line", "children": [{ "text": "    return -1" }] }
    ]
  },
  {
    type: 'p',
    children: [
      { text: 'Mention teammates with ' },
      { children: [{ text: '@mention' }], type: 'a', url: '/docs/mention' },
      { text: ', like ' },
      { children: [{ text: '' }], type: 'mention', value: 'Alice' },
      { text: ', or insert ' },
      {
        children: [{ text: 'emojis' }],
        type: 'a',
        url: '/docs/emoji',
      },
      { text: ' 🎯 to express emotions and context.' },
    ],
  },
  {
    type: 'h3',
    children: [{ text: 'Embed Media' }],
  },
  {
    type: 'p',
    children: [
      { text: 'Add files, audio, and visuals to enrich your notes. Drag-and-drop makes it easy.' },
    ],
  },
  {
    type: 'img',
    url: 'https://images.unsplash.com/photo-1712688930249-98e1963af7bd?q=80&w=600&auto=format&fit=crop',
    width: '75%',
    caption: [
      {
        type: 'p',
        children: [{ text: 'Visual notes help retain ideas better.' }],
      },
    ],
    children: [{ text: '' }],
    attributes: { align: 'center' },
  },
  {
    type: 'file',
    name: 'stratify-guide.pdf',
    isUpload: true,
    url: 'https://example.com/files/stratify-guide.pdf',
    children: [{ text: '' }],
  },
  {
    type: 'audio',
    url: 'https://samplelib.com/lib/preview/mp3/sample-3s.mp3',
    children: [{ text: '' }],
  },
  {
    type: 'h3',
    children: [{ text: 'Table of Contents' }],
  },
  {
    type: 'toc',
    children: [{ text: '' }],
  },
  {
    type: 'p',
    children: [{ text: '' }],
  },
];
