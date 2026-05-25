export type VideoType = {
  id: number;
  videoUrl: string;
  authorName: string;
  description: string;
  likesCount: number;
};

export const MOCK_VIDEO: VideoType[] = [
  {
    id: 1,
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    authorName: "w3school",
    description: "w3school Video for test 1",
    likesCount: 100,
  },
  {
    id: 2,
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4",
    authorName: "mozilla",
    description: "Mozilla video for test 2",
    likesCount: 200,
  },
  {
    id: 3,
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    authorName: "w3",
    description: "W3 video for test 3",
    likesCount: 300,
  },
];
