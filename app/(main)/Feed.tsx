"use client";

import VideoCard from "@/app/(main)/_components/VideoCard";
import { VideoType } from "../services/videoService";

type Props = {
  videos: VideoType[];
};

export default function Feed({ videos }: Props) {
  return (
    <div className="flex h-screen bg-black">
      {/* VIDEO FEED */}
      <div className={`flex-1 overflow-y-scroll snap-y snap-mandatory`}>
        {videos.map((video, index) => (
          <VideoCard index={index} key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
