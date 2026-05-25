"use client";

import { MOCK_VIDEO, VideoType } from "../services/videoService";
import Feed from "./Feed";
import { useEffect, useState } from "react";

export default function HomeClient() {
  const [videos, setVideos] = useState<VideoType[]>([]);
  useEffect(() => {
    const fetchVideos = async () => {
      const videosObj = MOCK_VIDEO;

      setVideos(videosObj ?? []);
    };
    fetchVideos();
  }, []);

  return (
    <>
      <Feed videos={videos} />
    </>
  );
}
