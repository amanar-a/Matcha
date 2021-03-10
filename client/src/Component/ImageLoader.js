import React, { useState, useEffect, useRef } from "react";
import "../css/ImageLoader.css";
function ImageLoader(props) {
  const [imageLoaded, changeImageLoaded] = useState(false);
  const imageRef = useRef(null);
  useEffect(() => {
    let unmount = false;
    async function fetchDataImage(src) {
      try {
        const res = await fetch(src.indexOf("http") > -1 ? src : "http://" + window.location.hostname + ":5000" + src);
        const data = await res.blob();
        return data;
      } catch (err) {
        return "None";
      }
    }
    fetchDataImage(props.src).then((data) => {
      if (data !== "None") {
        const reader = new FileReader();
        reader.onload = () => {
          if (!unmount) {
            changeImageLoaded(true);
            if (imageRef.current) imageRef.current.src = reader.result;
          }
        };
        reader.readAsDataURL(data);
      }
    });
    return () => (unmount = true); // eslint-disable-next-line
  }, []);
  return (
    <div className={`${props.className ? props.className : ""} ImageLoader`} style={props.style ? props.style : {}}>
      {imageLoaded ? <img ref={imageRef} alt={props.alt} /> : <div className="ImageLoading"></div>}
    </div>
  );
}
export { ImageLoader };
