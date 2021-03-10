import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import "../css/information.css";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" className="alert" {...props} />;
}

function MsgAlert(props) {
  return (
    <Snackbar open={props.op} autoHideDuration={4000} onClose={props.onClose}>
      <Alert onClose={props.onClose} severity={props.error}>
        {Array.isArray(props.msg) ? (
          props.msg.map((item, index) => (
            <p key={index}>
              {item} <br />
            </p>
          ))
        ) : (
          <>{props.msg}</>
        )}
      </Alert>
    </Snackbar>
  );
}

export { MsgAlert };
