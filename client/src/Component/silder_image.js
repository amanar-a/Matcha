import { useState, useEffect } from "react";
import uploadImg from "../Images/images.jpg";
import Button from "@material-ui/core/Button";
import "../css/slider.css";

function Slider(props) {
  const [images, changeImages] = useState([]);

  useEffect(() => {
    changeImages(props.info.images);
  }, [props.info.images]);
  function prev() {
    document.querySelector("#slider-container").scrollLeft -= 170;
  }

  function next() {
    document.querySelector("#slider-container").scrollLeft += 170;
  }

  function checkimage(src) {
    return new Promise((resolve) => {
      const newImage = new Image();
      const typeImage =
        src.search(/data:image\/+/, "") > -1 && src.search(/[;][ -~]+/) > -1
          ? src
              .replace(/[data:image/]+/, "")
              .replace(/[;][ -~]+/, "")
              .toLowerCase()
          : null;
      const base64Data =
        src.search(/^[data:image/]+([jpg]|[png]|[jpeg]|[gif])+[;]/) > -1 ? src.replace(/^[data:image/]+([jpg]|[png]|[jpeg]|[gif])+[;]/, "") : null;
      if (typeImage && base64Data) {
        newImage.src = src;
        newImage.onload = () => resolve(true);
        newImage.onerror = () => resolve(false);
      } else resolve(false);
    });
  }

  let putFile = () => {
    var file = document.querySelector("input[type=file]").files[0];
    var reader = new FileReader();

    reader.onloadend = function () {
      if (images.length < 5) {
        checkimage(reader.result).then((res) => {
          if (res === true) {
            const newArray = [...images];
            newArray.push(reader.result);
            changeImages(newArray);
            props.change((oldvalues) => ({ ...oldvalues, images: newArray }));
            if (images.length < 4) document.querySelector("input[type=file]").value = "";
          } else {
            document.querySelector("input[type=file]").value = "";
            alert("Image Invalide");
          }
        });
      } else alert("You can only upload 5 images");
    };
    if (file) {
      var ext = file.name.split(".").pop();
      if (ext === "png" || ext === "jpg" || ext === "jpeg") reader.readAsDataURL(file);
      else alert("Image type invalid");
    }
  };

  let switchDefault = (index) => {
    let oldArray = [...images];
    let temp = oldArray[0];
    oldArray[0] = images[index];
    oldArray[index] = temp;
    props.change((oldvalues) => ({ ...oldvalues, images: oldArray }));
  };
  return (
    <div style={{ position: "relative", width: "95%" }}>
      <p className="profile_p">{"User images:"}</p>
      <div id="slider-container" className="slider" style={{ height: props.info.permis === 0 ? "250px" : "" }}>
        {images.length < 5 && props.info.permis === 1 ? (
          <div className="slide">
            <input type="file" style={{ display: "none" }} id="file" onChange={() => putFile()} />
            <label htmlFor="file">
              <img className="imgprofile" src={uploadImg} alt="..." />
            </label>
          </div>
        ) : (
          ""
        )}
        {images.map((items, index) =>
          index !== 0 ? (
            <div className="slide" key={index}>
              {props.info.permis === 1 ? (
                <>
                  <Button variant="contained" className="deleteImgprofile" color="secondary" onClick={() => props.remove(index)}>
                    Delete
                  </Button>
                  <Button variant="contained" className="defaultImgProfile" onClick={() => switchDefault(index)}>
                    Set Default
                  </Button>
                </>
              ) : (
                ""
              )}
              <img src={items} alt={index} className="imgprofile userImages" />
            </div>
          ) : (
            ""
          )
        )}

        <>
          <div onClick={prev} className="control-prev-btn">
            <i className="fas fa-arrow-left"></i>
          </div>
          <div onClick={next} className="control-next-btn">
            <i className="fas fa-arrow-right"></i>
          </div>
        </>
      </div>
    </div>
  );
}

export { Slider };
