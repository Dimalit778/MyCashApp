import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { lazyload } from "@cloudinary/react";
import { scale } from "@cloudinary/url-gen/actions/resize";
import React from "react";
import { Image } from "react-bootstrap";

const cld = new Cloudinary({
  cloud: {
    cloudName: "dx6oxmki4",
  },
});

const CloudImage = ({ publicId, width = 40, height = 40, ...props }) => {
  const myImage = cld
    .image(publicId)
    .quality("auto:best")
    .format("auto")
    .delivery("q_auto:best")
    .resize(scale().width(props.width).height(props.height));

  return publicId ? (
    <AdvancedImage
      cldImg={myImage}
      plugins={[lazyload()]}
      loading="lazy"
      className="w-100 h-100 object-fit-cover"
      onError={(e) => {
        e.target.style.display = "none";
      }}
      {...props}
    />
  ) : (
    <Image
      src={require("../../../assets/avatar.jpg")}
      alt="user"
      className="rounded-circle"
      width={width}
      height={height}
    />
  );
};

export default React.memo(CloudImage);
