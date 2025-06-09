// extensions/ResizableImage.ts
import Image from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { ImageNodeView } from './ImageNodeView';


const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(), // Inherit existing attributes
      width: {
        default: null,
        parseHTML: element => {
          return element.style.width || element.getAttribute('width');
        },
        renderHTML: attributes => {
          if (attributes.width) {
            return { width: attributes.width };
          }

          return {};
        },
      },
      height: {
        default: null,
        parseHTML: element => {
          return element.style.height || element.getAttribute('height');
        },
        renderHTML: attributes => {
          if (attributes.height) {
            return { height: attributes.height };
          }

          return {};
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});

export default ResizableImage;