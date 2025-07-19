import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { lazyload } from "@cloudinary/react";

import { fill } from "@cloudinary/url-gen/actions/resize";
import React from "react";
import { Image } from "react-bootstrap";

const cld = new Cloudinary({
  cloud: {
    cloudName: "dx6oxmki4",
  },
});

const CloudImage = ({ publicId, width, height, className, alt }) => {
  const myImage = cld
    .image(publicId)
    .quality("auto:best")
    .format("auto")
    .delivery("q_auto:best")
    .resize(fill().width(200).height(200));
  return publicId ? (
    <AdvancedImage
      cldImg={myImage}
      plugins={[lazyload()]}
      loading="lazy"
      alt={alt}
      className={className}
      style={{
        width: width,
        height: height,
        objectFit: "cover",
      }}
    />
  ) : (
    <Image
      src={require("../../../assets/avatar.webp")}
      alt={alt}
      width={width}
      height={height}
    />
  );
};

export default React.memo(CloudImage);
