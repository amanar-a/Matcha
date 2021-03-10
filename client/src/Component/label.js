import React, { useState } from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

function Label1(props) {
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="gender_div">
      <div>
        <FormLabel component="legend">
          <span style={{ color: "black" }}>Gender:</span>
          <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
            <FormControlLabel id="gender_Male" value="Female" control={<Radio color="primary" />} label="Female" />
            <FormControlLabel id="gender_Female" value="Male" control={<Radio color="primary" />} label="Male" />
          </RadioGroup>
        </FormLabel>
      </div>
    </div>
  );
}

function Label2(props) {
  return (
    <div style={{ textAlign: "center" }}>
      <FormLabel component="legend">
        <span style={{ color: "black" }}>Looking for:</span>
        <div>
          <FormControlLabel value="Female" control={<Checkbox color="primary" />} label="Female" />
          <FormControlLabel value="Male" control={<Checkbox color="primary" />} label="Male" />
        </div>
      </FormLabel>
    </div>
  );
}

export { Label1, Label2 };
