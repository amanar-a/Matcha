import React, { useState, useEffect } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

function Gender(props) {
  const [gender, changeGender] = useState("");
  let handleChange = (event) => {
    changeGender(event.target.value);
  };
  return (
    <div className="lot_div">
      <p className="info_p">{props.para}</p>
      <FormControl variant="outlined" className="formControl">
        <Select labelId="demo-simple-select-outlined-label" value={gender} onChange={handleChange}>
          {props.list.map((item, index) => (
            <MenuItem value={index} key={index}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

function GenderProfile(props) {
  const [gender, changeGender] = useState("");
  let handleChange = (event) => {
    changeGender(event.target.value);
    if (props.type === "array") {
      if (event.target.value === 2) props.change(["Male", "Female"]);
      else if (event.target.value === 0) props.change(["Male"]);
      else if (event.target.value === 1) props.change(["Female"]);
    } else {
      if (event.target.value === 0) props.change("Male");
      else if (event.target.value === 1) props.change("Female");
      else if (event.target.value === 2) props.change("Other");
    }
  };
  useEffect(() => {
    let unmount = false;
    if (!unmount) {
      if (props.value) {
        if (typeof props.value === "object") {
          if (props.value.length === 2) changeGender(2);
          else if (props.value[0] === "Male") changeGender(0);
          else if (props.value[0] === "Female") changeGender(1);
        } else {
          if (props.value === "Male") changeGender(0);
          else if (props.value === "Female") changeGender(1);
          else if (props.value === "Other") changeGender(2);
        }
      }
    }
    return () => (unmount = true); // eslint-disable-next-line
  }, [props.value]);
  return (
    <>
      <FormControl variant="outlined" className="formControl" disabled={props.display}>
        <Select labelId="demo-simple-select-outlined-label" value={gender} onChange={handleChange}>
          {props.list.map((item, index) => (
            <MenuItem value={index} key={index}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}

export { Gender, GenderProfile };
