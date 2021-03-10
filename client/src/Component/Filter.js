import React, { useState, useContext, useEffect } from "react";
import Slider from "@material-ui/core/Slider";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Select } from "./Select";
import { DataContext } from "../Context/AppContext";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import "../css/Filter.css";

function Filter() {
  const ctx = useContext(DataContext);
  const [listActive, changeListActive] = useState(ctx.cache.filterData.list);
  const [name, changeName] = useState(ctx.cache.filterData.name);
  const [age, changeAge] = useState(ctx.cache.filterData.age);
  const [rating, changeRating] = useState(ctx.cache.filterData.rating);
  const [location, changeLocation] = useState(ctx.cache.filterData.location);
  const [listInterest, changeListInterest] = useState([...ctx.cache.listInterest]);
  const [sort, changeSort] = useState({ ...ctx.cache.filterData.sort });
  useEffect(() => {
    ctx.ref.changeListInterest = changeListInterest;
    ctx.ref.changeListActive = changeListActive;
    if (ctx.cache.listInterest.length === 0) ctx.ref.getListInterest();
    return () => {
      ctx.ref.changeListInterest = null;
      ctx.ref.changeListActive = null;
    }; // eslint-disable-next-line
  }, []);
  function handleChangeSort(event) {
    const name = event.target.name;
    const value = event.target.checked ? true : false;
    changeSort((oldValue) => ({ ...oldValue, [name]: value }));
  }
  return (
    <div className="Filter">
      <div className="FilterSearch">
        <div className="FilterSearchInput">
          <TextField id="FilterName" label="Name" variant="outlined" size="small" onChange={(event) => changeName(event.target.value)} value={name} />
        </div>
      </div>
      <div className="FilterAdvance">
        <div className="FilterAdvanceFirst">
          <Select list={listInterest} change={changeListActive} active={listActive} max={5} />
        </div>
        <div className="FilterAdvanceSecond">
          <div className="FilterAdvanceAge">
            <div className="FilterAdvanceAgeText">Age :</div>
            <div className="FilterAdvanceAgeValue">
              <Slider
                value={age}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={18}
                max={80}
                onChange={(event, value) => changeAge([...value])}
              />
            </div>
          </div>
          <div className="FilterAdvanceRating">
            <div className="FilterAdvanceRatingText">Rating :</div>
            <div className="FilterAdvanceRatingValue">
              <Slider
                value={rating}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={0}
                max={5}
                onChange={(event, value) => changeRating([...value])}
              />
            </div>
          </div>
          <div className="FilterAdvanceLocation">
            <div className="FilterAdvanceLoactionText">Location :</div>
            <div className="FilterAdvanceLoactionValue">
              <Slider
                value={location}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={0}
                max={1000}
                step={100}
                valueLabelFormat={(x) => (x === 1000 ? `${999}+` : x)}
                onChange={(event, value) => changeLocation([...value])}
              />
            </div>
          </div>
          <div className="FilterAdvanceSort">
            <div className="FilterAdvanceSortText">Sort :</div>
            <div className="FilterAdvanceSortValue">
              <FormControlLabel control={<Checkbox color="primary" checked={sort.Age} onChange={handleChangeSort} name="Age" />} label="Age" />
              <FormControlLabel control={<Checkbox color="primary" checked={sort.distance} onChange={handleChangeSort} name="distance" />} label="Location" />
              <FormControlLabel
                control={<Checkbox color="primary" checked={sort.listInterest} onChange={handleChangeSort} name="listInterest" />}
                label="ListInterest"
              />
              <FormControlLabel control={<Checkbox color="primary" checked={sort.rating} onChange={handleChangeSort} name="rating" />} label="Rating" />
            </div>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              ctx.cache.users = [];
              ctx.cache.filterData = {
                list: listActive,
                name,
                age,
                rating,
                location,
                sort,
                updated: true,
              };
              if (ctx.ref.changeUsers) ctx.ref.changeUsers([]);
            }}
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
export { Filter };
