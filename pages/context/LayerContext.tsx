import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { ResizeHandle } from "../hooks/useResizableLayer";

export type CanvasLayer = {
  id: string;
  ref: React.RefObject<HTMLCanvasElement>;
  top: number;
  left: number;
  width: number;
  height: number;
  color: string;
  mouseDown: boolean;
};

type LayerContextType = {
  layers: CanvasLayer[];
  addLayer: () => void;
  deleteLayer: (id: string) => void;
  dragStart: (id: string) => void;
  dragMove: (id: string, x: number, y: number) => void;
  dragEnd: (id: string) => void;
  resizeLayer: (id: string, handle: ResizeHandle, x: number, y: number) => void;
};

type LayerProviderProps = {
  children: React.ReactNode;
};

const LayerContext = createContext<LayerContextType | undefined>(undefined);

export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const getRandomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export function useCanvasInitialization(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  color: string
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas !== null) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [canvasRef, color]);
}

export function useCanvasLayersUpdate(layers: CanvasLayer[]) {
  useEffect(() => {
    layers.forEach((layer) => {
      const canvas = layer.ref.current;
      if (canvas !== null) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = layer.color;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    });
  }, [layers]);
}

export const LayerProvider: React.FC<LayerProviderProps> = ({ children }) => {
  const [layers, setLayers] = useState<CanvasLayer[]>([]);
  const [draggedLayer, setDraggedLayer] = React.useState<string | null>(null);

  const addLayer = () => {
    const top = getRandomNumber(0, 600);
    const left = getRandomNumber(0, 1000);
    const color = getRandomColor();

    const newLayer: CanvasLayer = {
      id: uuidv4(),
      ref: React.createRef<HTMLCanvasElement>(),
      top,
      left,
      width: 100, // Default width
      height: 100, // Default height
      color,
      mouseDown: false,
    };

    setLayers((prevLayers) => [...prevLayers, newLayer]);
  };

  const deleteLayer = (id: string) => {
    setLayers((layers) => layers.filter((layer) => layer.id !== id));
  };

  const dragStart = (id: string) => {
    setDraggedLayer(id);
    setLayers((layers) =>
      layers.map((layer) =>
        layer.id === id ? { ...layer, mouseDown: true } : layer
      )
    );
  };

  const dragMove = (id: string, x: number, y: number) => {
    if (draggedLayer === id) {
      setLayers((layers) =>
        layers.map((layer) =>
          layer.id === id ? { ...layer, left: x, top: y } : layer
        )
      );
    }
  };

  const dragEnd = (id: string) => {
    if (draggedLayer === id) {
      setDraggedLayer(null);
      setLayers((layers) =>
        layers.map((layer) =>
          layer.id === id ? { ...layer, mouseDown: false } : layer
        )
      );
    }
  };

  useEffect(() => {
    const globalMouseUpListener = () => {
      layers.forEach((layer) => {
        if (layer.mouseDown) {
          dragEnd(layer.id);
        }
      });
    };

    window.addEventListener("mouseup", globalMouseUpListener);
    return () => {
      window.removeEventListener("mouseup", globalMouseUpListener);
    };
  }, [layers, dragEnd]);

  const resizeLayer = (
    id: string,
    handle: ResizeHandle,
    x: number,
    y: number
  ) => {
    setLayers((layers) =>
      layers.map((layer) => {
        if (layer.id !== id) return layer;

        switch (handle) {
          case "topLeft":
            return {
              ...layer,
              left: x,
              top: y,
              width: layer.width + (layer.left - x),
              height: layer.height - (layer.top - y),
            };
          case "topRight":
            return {
              ...layer,
              top: y,
              width: x - layer.left,
              height: layer.height - (layer.top - y),
            };
          case "bottomLeft":
            return {
              ...layer,
              left: x,
              width: layer.width + (layer.left - x),
              height: y - layer.top,
            };
          case "bottomRight":
            console.log("bottom right moving");
            return {
              ...layer,
              width: x - layer.left,
              height: y - layer.top,
            };
          default:
            return layer;
        }
      })
    );
  };

  return (
    <LayerContext.Provider
      value={{
        layers,
        addLayer,
        deleteLayer,
        dragStart,
        dragMove,
        dragEnd,
        resizeLayer,
      }}
    >
      {children}
    </LayerContext.Provider>
  );
};

export function useCanvasLayer() {
  const context = useContext(LayerContext);
  if (context === undefined) {
    throw new Error("useCanvasLayer must be used within a LayerProvider");
  }
  return context;
}
