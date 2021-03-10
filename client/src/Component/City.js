import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { createFilterOptions } from "@material-ui/lab/Autocomplete";

export default function Citys(props) {
  const filterOptions = createFilterOptions({
    limit: 6,
  });
  return (
    <Autocomplete
      id="combo-box-demo"
      value={props.city[props.cityOwner]}
      options={props.city}
      disableClearable
      getOptionLabel={(option) => option}
      renderInput={(params) => <TextField {...params} label="City" variant="outlined" />}
      filterOptions={filterOptions}
      onChange={(e) => {
        if (e.target.innerHTML.trim() !== "") props.change(e.target.innerHTML);
      }}
    />
  );
}

export { Citys };
