'use client';

import { useChat as useBaseChat } from '@ai-sdk/react';
// Removed faker as it's no longer needed for fake streaming
import { usePluginOption } from 'platejs/react';

import { aiChatPlugin } from '@/components/editor/plugins/ai-kit';

export const useChat = () => {
  const options = usePluginOption(aiChatPlugin, 'chatOptions');

  // Removed abortControllerRef and _abortFakeStream as they are for mock functionality
  // const abortControllerRef = React.useRef<AbortController | null>(null);
  // const _abortFakeStream = () => {
  //   if (abortControllerRef.current) {
  //     abortControllerRef.current.abort();
  //     abortControllerRef.current = null;
  //   }
  // };

  const chat = useBaseChat({
    id: 'editor',
    // Removed the custom fetch implementation as we are now using the real API route
    // The useBaseChat hook will automatically handle fetching from the `api` endpoint.
    api: '/api/ai/command', // Pointing to your DeepSeek API route
    ...options,
  });

  // Removed _abortFakeStream from the return object as it's no longer relevant
  return { ...chat };
};

// Removed fakeStreamText and related constants (markdownChunks, mdxChunks, delay)
// as they are no longer used after removing the mock API.
