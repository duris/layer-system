import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { LayerProvider } from "./context/LayerContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LayerProvider>
      <Component {...pageProps} />
    </LayerProvider>
  );
}
