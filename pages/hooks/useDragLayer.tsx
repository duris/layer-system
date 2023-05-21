import { useCanvasLayer } from "../context/LayerContext";
import { useRef } from "react";

// Add mainCanvasRef as a parameter to the hook
const useDragLayer = (mainCanvasRef: React.RefObject<HTMLCanvasElement>) => {
  const { layers, dragStart, dragMove, dragEnd } = useCanvasLayer(); // Get layers and drag functions from the context

  const mousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 }); // Define the ref here

  const handleMouseDown = (id: string) => {
    dragStart(id);
  };

  const handleMouseUp = (id: string) => {
    dragEnd(id);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = event;
    if (!mainCanvasRef.current) return null;
    const { left, top } = mainCanvasRef.current.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;

    mousePositionRef.current = { x, y }; // Use the ref here

    layers.forEach((layer) => {
      if (layer.mouseDown) {
        dragMove(layer.id, x, y);
      }
    });
  };

  return { handleMouseDown, handleMouseUp, handleMouseMove }; // Return the handlers from the hook
};

export default useDragLayer;
