// CanvasLayer.tsx
import React from "react";
import { CanvasLayer } from "../context/LayerContext";
import { useCanvasInitialization } from "../context/LayerContext";
import useResizableLayer, { ResizeHandle } from "../hooks/useResizableLayer";

interface CanvasLayerProps {
  layer: CanvasLayer;
  handleMouseDown: (id: string) => void;
  handleMouseUp: (id: string) => void;
  handleResizeMouseDown: (
    id: string,
    handle: ResizeHandle,
    event: React.MouseEvent<HTMLDivElement>
  ) => void;
  handleResizeMouseUp: (
    id: string,
    handle: ResizeHandle,
    event: React.MouseEvent<HTMLDivElement>
  ) => void;
  handleResizeMouseMove: (
    id: string,
    handle: ResizeHandle,
    event: React.MouseEvent<HTMLDivElement>
  ) => void;
}

const CanvasLayer: React.FC<CanvasLayerProps> = React.memo(
  ({ layer, handleMouseDown, handleMouseUp }) => {
    useCanvasInitialization(layer.ref, layer.color);

    const {
      handleResizeMouseDown,
      handleResizeMouseUp,
      handleResizeMouseMove,
    } = useResizableLayer(layer.ref);

    return (
      <div
        style={{
          position: "absolute",
          top: layer.top,
          left: layer.left,
          width: layer.width,
          height: layer.height,
        }}
      >
        <canvas
          key={layer.id}
          ref={layer.ref}
          onMouseDown={() => handleMouseDown(layer.id)}
          onMouseUp={() => handleMouseUp(layer.id)}
          style={{
            top: layer.top,
            left: layer.left,
            width: layer.width,
            height: layer.height,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 10,
            height: 10,
            backgroundColor: "red",
            cursor: "nwse-resize",
          }}
          onMouseDown={(e) => handleResizeMouseDown(layer.id, "bottomRight", e)}
          onMouseUp={(e) => handleResizeMouseUp(layer.id, "bottomRight", e)}
          onMouseMove={(e) => handleResizeMouseMove(layer.id, "bottomRight", e)}
        />
      </div>
    );
  }
);

export default CanvasLayer;
