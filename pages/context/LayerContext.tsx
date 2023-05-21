import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";
import { v4 as uuidv4 } from "uuid";

export type CanvasLayer = {
  id: string;
  ref: React.RefObject<HTMLCanvasElement>;
  top: number;
  left: number;
  color: string;
  mouseDown: boolean;
};

type LayerContextType = {
  layers: CanvasLayer[];
  addLayer: () => void;
  deleteLayer: (id: string) => void;
  dragStart: (id: string) => void; // Add this line
  dragMove: (id: string, x: number, y: number) => void; // Add this line
  dragEnd: (id: string) => void; // Add this line
};

type LayerProviderProps = {
  children: React.ReactNode;
};

const LayerContext = createContext<LayerContextType | undefined>(undefined);

export function useCanvasInitialization(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  color: string
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas !== null) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = color; // set the main canvas background color
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
    const top = Math.random() * 600;
    const left = Math.random() * 1000;
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random color

    const newLayer: CanvasLayer = {
      id: uuidv4(),
      ref: React.createRef<HTMLCanvasElement>(),
      top,
      left,
      color,
      mouseDown: false,
    };

    setLayers((prevLayers) => [...prevLayers, newLayer]);
  };

  const deleteLayer = (id: string) => {
    setLayers((layers) => layers.filter((layer) => layer.id !== id));
  };

  // Add these functions
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

  // Add this useEffect to add the global mouseup listener
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

  // Add this useEffect to add the global mouseup listener
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

  return (
    <LayerContext.Provider
      value={{ layers, addLayer, deleteLayer, dragStart, dragMove, dragEnd }}
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
