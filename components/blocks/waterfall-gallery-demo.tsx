import WaterfallGallery from "@/components/blocks/interactive-bento-gallery";
import { useState } from "react";

const initialMediaItems = [
  {
    id: 1,
    title: "Wide Landscape",
    desc: "16:9 ratio image",
    url: "https://picsum.photos/1600/900",
    tag: "tag1" 
  },
  {
    id: 2,
    title: "Square Format",
    desc: "1:1 ratio image",
    url: "https://picsum.photos/800/800",
    tag: "tag2" 
  },
  {
    id: 3,
    title: "Portrait Mode",
    desc: "3:4 ratio image",
    url: "https://picsum.photos/600/800",
    tag: "tag3" 
  },
  {
    id: 4,
    title: "Ultra Wide",
    desc: "21:9 ratio image",
    url: "https://picsum.photos/2100/900",
    tag: "tag4" 
  },
  {
    id: 5,
    title: "Vertical Panorama",
    desc: "9:16 ratio image",
    url: "https://picsum.photos/900/1600",
    tag: "tag5" 
  },
  {
    id: 6,
    title: "Standard Photo",
    desc: "4:3 ratio image",
    url: "https://picsum.photos/1200/900",
    tag: "tag6" 
  },
  {
    id: 7,
    title: "Tall Portrait",
    desc: "2:3 ratio image",
    url: "https://picsum.photos/800/1200",
    tag: "tag7" 
  },
];

export function WaterfallGalleryDemo() {
  const [mediaItems, setMediaItems] = useState(initialMediaItems);

  const addRandomImage = () => {
    const randomWidth = Math.floor(Math.random() * 800) + 400;
    const randomHeight = Math.floor(Math.random() * 800) + 400;
    const newImage = {
      id: mediaItems.length + 1,
      title: `Random Image ${mediaItems.length + 1}`,
      desc: `${randomWidth}x${randomHeight} random image`,
      url: `https://picsum.photos/${randomWidth}/${randomHeight}`,
      tag: `tag${mediaItems.length + 1}` 
    };
    setMediaItems([newImage, ...mediaItems]);
  };

  return (
    <div className="min-h-screen overflow-y-auto">
      <button
        onClick={addRandomImage}
        className="fixed top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        添加随机图片
      </button>
      <WaterfallGallery
        mediaItems={mediaItems}
        title="Waterfall Gallery Collection"
        description="Explore our curated collection of stunning images"
        insertAtStart
      />
    </div>
  );
}
