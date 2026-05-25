import { VideoProvider } from "../contexts/videoContext";
import SideBar from "./_components/SideBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VideoProvider>
      <div className="flex">
        <SideBar />

        <main className="flex-1">{children}</main>
      </div>
    </VideoProvider>
  );
}
