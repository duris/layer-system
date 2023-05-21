import { useCanvasLayer } from "../context/LayerContext";
import { useState } from "react";

export type ResizeHandle =
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

const useResizableLayer = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const { layers, resizeLayer } = useCanvasLayer(); // Get resizeLayer from the context
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);

  const handleResizeMouseDown = (
    id: string,
    handle: ResizeHandle,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
    console.log("resize handle down", handle);
    setResizeHandle(handle);
  };

  const handleResizeMouseUp = (
    id: string,
    handle: ResizeHandle,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
    setResizeHandle(null);
    console.log("resize handle up");
  };

  const handleResizeMouseMove = (
    id: string,
    handle: ResizeHandle,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (resizeHandle !== handle) return; // Add this line

    const { clientX, clientY } = event;
    if (!canvasRef.current) return;
    const { left, top } = canvasRef.current.getBoundingClientRect();

    const x = clientX - left;
    const y = clientY - top;
    console.log("moving mouse over handle", handle);
    resizeLayer(id, handle, x, y);
  };

  return {
    handleResizeMouseDown,
    handleResizeMouseUp,
    handleResizeMouseMove,
  };
};

export default useResizableLayer;
