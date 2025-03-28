import { AudioPlayer } from "@/components/audio-player";
import { BackgroundVideo } from "@/components/background-video";
import { PomodoroTimer } from "@/components/timer";

export default function Home() {
  return (
    <div className="relative w-screen h-screen">
      <BackgroundVideo />
      <PomodoroTimer />
      <AudioPlayer />
    </div>
  );
}
