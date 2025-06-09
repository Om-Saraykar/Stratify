import { useState } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css'; // Don't forget to import the CSS for react-resizable
import { Grip } from 'lucide-react'; // For the resize handle icon

export const ImageNodeView = (props: any) => {
  const { node, getPos, editor, selected } = props;
  const { src, alt, title, width, height } = node.attrs;

  // Use local state for current dimensions if node.attrs.width/height aren't reliable during resize
  const [currentWidth, setCurrentWidth] = useState<string | number>(width || '100%');
  const [currentHeight, setCurrentHeight] = useState<string | number>(height || 'auto');

  // Parse width from attributes for Resizable component
  // Ensure width is a number for Resizable, or fall back to a reasonable default
  let initialResizableWidth = typeof width === 'string' && width.endsWith('px') ? parseInt(width) : undefined;

  if (!initialResizableWidth && typeof width === 'string' && width.endsWith('%')) {
    // If it's a percentage, Resizable needs a pixel value.
    // This is a rough estimation. A better way would be to get the actual rendered image width.
    // For now, let's assume a default max width if percentage.
    initialResizableWidth = editor.view.dom.clientWidth * 0.75; // 75% of editor width as a starting point
  }
  // Fallback if no width attribute is set or if parsing fails
  if (!initialResizableWidth || isNaN(initialResizableWidth) || initialResizableWidth === 0) {
    initialResizableWidth = editor.view.dom.clientWidth * 0.75; // Default if nothing valid is provided
  }


  const onResize = (_event: any, { size }: any) => {
    setCurrentWidth(size.width);
    setCurrentHeight(size.height);
  };

  const onResizeStop = (_event: any, { size }: any) => {
    const pos = getPos();

    if (pos === undefined) return; // Ensure position is valid

    // Update Tiptap node attributes after resizing stops
    editor.chain().focus().setNodeSelection(pos).updateAttributes('image', {
      width: `${size.width}px`, // Save as pixels for consistent re-rendering
      height: `${size.height}px`,
    }).run();

    // Reset local state to match the saved node attributes
    setCurrentWidth(`${size.width}px`);
    setCurrentHeight(`${size.height}px`);
  };

  return (
    <NodeViewWrapper className="image-node-view">
      {/*
        The Resizable component needs a numerical width and height.
        We're converting from string (e.g., "100px", "50%") to number here.
        If the image is initially "100%", Resizable will start at a calculated pixel width.
        If `width` is undefined or auto, provide a fallback.
      */}
      <Resizable
        className={selected ? 'ProseMirror-selectednode' : ''} // Apply Tiptap's selection style
        handle={
          <div className="react-resizable-handle react-resizable-handle-se">
            <Grip className="w-3 h-3 text-white" />
          </div>
        }
        height={parseInt(String(currentHeight).replace('px', '').replace('%', '')) || 0} // Resizable needs numeric height, 0 for auto
        lockAspectRatio={true} // Maintain aspect ratio during resize
        width={initialResizableWidth} // Use the parsed or default numeric width
        onResize={onResize}
        onResizeStop={onResizeStop}
      >
        <img
          alt={alt}
          src={src}
          style={{ width: currentWidth, height: currentHeight }}
          title={title}
        />
      </Resizable>
      {/* NodeViewContent is important for allowing other content inside (though typically not for images) */}
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
};