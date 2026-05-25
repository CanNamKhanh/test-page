import { VideoProvider } from "../contexts/videoContext";
import HomeClient from "./HomeClient";

function HomePage() {
  return (
    <VideoProvider>
      <HomeClient />
    </VideoProvider>
  );
}

export default HomePage;
