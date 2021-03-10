import React, { useState } from "react";
import image_back from "../Images/images.jpg";
import "../css/information.css";
import Button from "@material-ui/core/Button";

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
      /*eslint-disable-next-line*/
      src.search(/^[data:image\/]+([jpg]|[png]|[jpeg]|[gif])+[;]/) /*eslint-disable-next-line*/ > -1
        ? src.replace(/^[data:image\/]+([jpg]|[png]|[jpeg]|[gif])+[;]/, "")
        : null;
    if (typeImage && base64Data) {
      newImage.src = src;
      newImage.onload = () => resolve(true);
      newImage.onerror = () => resolve(false);
    } else resolve(false);
  });
}

function Images(props) {
  const [img, changeId] = useState([]);

  let putFile = () => {
    var file = document.querySelector("input[type=file]").files[0];
    var reader = new FileReader();

    reader.onloadend = function () {
      if (img.length < 5) {
        checkimage(reader.result).then((res) => {
          if (res === true) {
            changeId((oldvalues) => [...oldvalues, reader.result]);
            if (img.length < 4) document.querySelector("input[type=file]").value = "";
          } else {
            document.querySelector("input[type=file]").value = "";
            alert("Image Invalide");
          }
        });
      } else props.msg({ state: true, type: "error", msg: "You can only upload 5 images" });
    };
    if (file) {
      var ext = file.name.split(".").pop();
      if (ext === "png" || ext === "jpg" || ext === "jpeg") reader.readAsDataURL(file);
      else props.msg({ state: true, type: "error", msg: "Image type invalid" });
    }
  };

  let remove = (id) => {
    let newArr = [...img];

    if (props.defau === id) props.change(-1);
    newArr.splice(id, 1);
    changeId(newArr);
  };

  return (
    <div style={{ display: "flex" }}>
      <div className="div_img">
        {img.length < 5 ? (
          <div className="div_file">
            <input type="file" style={{ display: "none" }} id="file" onChange={() => putFile()} />
            <label htmlFor="file" className="file">
              <img className="imag_file_" src={image_back} alt="..." />
            </label>
          </div>
        ) : (
          ""
        )}
        {img.map((src, index) => (
          <div key={index} style={{ position: "relative", overflow: "hidden" }} className="add_img" id={index}>
            <img src={src} className="img_file" alt="" />
            <Button variant="contained" className="delete" color="secondary" onClick={() => remove(index)}>
              Delete
            </Button>
            {props.defau !== index ? (
              <Button
                variant="contained"
                className="default"
                onClick={() => {
                  props.change(index);
                }}
              >
                Set Default
              </Button>
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export { Images };
