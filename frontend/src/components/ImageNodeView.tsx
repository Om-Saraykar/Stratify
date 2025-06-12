import { useState, forwardRef, useEffect, useRef } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { Grip } from 'lucide-react';

// Define the types for your node attributes and the props your NodeView expects
interface ImageNodeAttrs {
  src: string;
  alt?: string;
  title?: string;
  width?: string | number;
  height?: string | number;
}

interface ImageNodeViewProps {
  node: {
    attrs: ImageNodeAttrs;
  };
  getPos: () => number | undefined;
  editor: any; // Consider importing the actual Editor type from tiptap
  selected: boolean;
}

export const ImageNodeView = forwardRef<HTMLDivElement, ImageNodeViewProps>((props, ref) => {
  const { node, getPos, editor, selected } = props;
  const { src, alt, title, width, height } = node.attrs;

  const [currentWidth, setCurrentWidth] = useState<string | number>(width || '100%');
  const [currentHeight, setCurrentHeight] = useState<string | number>(height || 'auto');

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setCurrentWidth(width || '100%');
    setCurrentHeight(height || 'auto');
  }, [width, height]);

  let initialResizableWidth: number;

  if (typeof width === 'string' && width.endsWith('px')) {
    initialResizableWidth = parseInt(width);
  } else if (typeof width === 'string' && width.endsWith('%')) {
    initialResizableWidth = editor.view?.dom?.clientWidth ? editor.view.dom.clientWidth * (parseFloat(width) / 100) : 400;
  } else if (typeof width === 'number') {
    initialResizableWidth = width;
  } else {
    initialResizableWidth = editor.view?.dom?.clientWidth ? editor.view.dom.clientWidth * 0.75 : 400;
  }

  if (isNaN(initialResizableWidth) || initialResizableWidth <= 0) {
    initialResizableWidth = 400;
  }

  let initialResizableHeight: number;

  if (typeof height === 'string' && height.endsWith('px')) {
    initialResizableHeight = parseInt(height);
  } else if (typeof height === 'number') {
    initialResizableHeight = height;
  } else {
    initialResizableHeight = 0; // Let Resizable handle based on aspect ratio
  }

  const onResize = (_event: React.SyntheticEvent, { size }: { size: { width: number; height: number } }) => {
    setCurrentWidth(size.width);
    setCurrentHeight(size.height);
  };

  const onResizeStop = (_event: React.SyntheticEvent, { size }: { size: { width: number; height: number } }) => {
    const pos = getPos();

    if (pos === undefined || pos < 0) {
      // eslint-disable-next-line no-console
      console.warn('ImageNodeView: Could not get valid node position for update.');

      return;
    }

    editor.chain().focus().setNodeSelection(pos).updateAttributes('image', {
      width: `${size.width}px`,
      height: `${size.height}px`,
    }).run();
  };

  return (
    <NodeViewWrapper ref={ref} className="image-node-view">
      <Resizable
        className={selected ? 'ProseMirror-selectednode' : ''}
        handle={
          <div className="react-resizable-handle react-resizable-handle-se">
            <Grip className="w-3 h-3 text-white" />
          </div>
        }
        height={initialResizableHeight}
        lockAspectRatio={true}
        width={initialResizableWidth}
        onResize={onResize}
        onResizeStop={onResizeStop}
      >
        <img
          ref={imgRef}
          alt={alt || ''}
          draggable="false"
          src={src}
          style={{ width: currentWidth, height: currentHeight }}
          title={title}
        />
      </Resizable>
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
});

// Add the displayName property here
ImageNodeView.displayName = 'ImageNodeView';