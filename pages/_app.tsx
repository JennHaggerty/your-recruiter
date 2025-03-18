import "@/styles/globals.css";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <HeroUIProvider className="dark">
      <ToastProvider placement="top-center" />
      <Component {...pageProps} />
    </HeroUIProvider>
  );
}
