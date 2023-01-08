import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

interface PostImagesProps {
  media: string[];
}

const PostImg = ({ url }: { url: string }) => {
  return (
    <div className="max-h-screen overflow-hidden rounded-md">
      <img className="object-cover w-full h-full" src={url} alt="post-img" />
    </div>
  );
};

const PostImages = ({ media }: PostImagesProps) => {
  return (
    <div
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      className="select-none pt-4 overflow-hidden rounded-md"
    >
      {media.length > 1 ? (
        <Carousel
          swipeable={true}
          useKeyboardArrows={true}
          infiniteLoop={true}
          emulateTouch={true}
          showThumbs={false}
        >
          {media.map((url: string, index) => (
            <PostImg key={index} url={url} />
          ))}
        </Carousel>
      ) : (
        <PostImg url={media[0]} />
      )}
    </div>
  );
};
export default PostImages;
