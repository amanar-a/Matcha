import TextField from "@material-ui/core/TextField";

function TextFieldProfile(props) {
  return (
    <div className={props.class + " padd"}>
      <p className="profile_p">{props.label}</p>
      <TextField
        disabled={props.display}
        value={props.value}
        id={props.label}
        type={props.type}
        variant="outlined"
        onChange={(e) => {
          props.change(e.target.value);
        }}
      />
    </div>
  );
}

export { TextFieldProfile };
