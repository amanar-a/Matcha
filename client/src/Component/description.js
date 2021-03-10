import { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";

function Description(props) {
  const [numberChar, changeNumber] = useState({
    number: 250,
    error: false,
  });
  useEffect(() => {
    let unmount = false;
    var description = document.querySelector("#description");
    let text;

    if (!unmount) {
      if (description.value.length <= 250) changeNumber({ number: 250 - description.value.length, error: false });
      else if (description.value.length > 250) {
        text = description.value.substr(0, 250);
        description.value = text;
        changeNumber((oldvalues) => ({ ...oldvalues, number: 0 }));
      }
    }
    return () => (unmount = true); // eslint-disable-next-line
  }, [props.value]);
  let checkChara = () => {
    var description = document.querySelector("#description");
    let text;

    if (!props.value) {
      if (description.value.length <= 250) {
        changeNumber({ number: 250 - description.value.length, error: false });
      } else if (description.value.length > 250) {
        text = description.value.substr(0, 250);
        description.value = text;
        changeNumber((oldvalues) => ({ ...oldvalues, number: 0 }));
        props.change(text);
      }
    }
  };
  return (
    <>
      <TextField
        disabled={props.display === true ? true : false}
        id="description"
        value={props.value}
        label={numberChar.number + " charactere"}
        error={numberChar.error}
        multiline
        rows={4}
        variant="outlined"
        onChange={(e) => {
          if (props.change) props.change(e.target.value.substr(0, 250));
          checkChara();
        }}
      />
    </>
  );
}
export { Description };
