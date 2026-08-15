import MainScene from "./components/MainScene";
import { AudioProvider } from "./components/AudioContext";

export default function Home() {
  return (
    <AudioProvider>
      <MainScene />
    </AudioProvider>
  );
}