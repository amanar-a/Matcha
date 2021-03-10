function Validate(name, value) {
  const list = {
    Name: /^[a-zA-Z0-9]{2,30}$/g.test(value) && value ? true : false, // eslint-disable-next-line
    Username: /^[a-zA-Z0-9]{2,15}[\-\_\.]{0,1}[a-zA-Z0-9]{2,15}$/g.test(value) && value ? true : false, // eslint-disable-next-line
    Email:
      /^[a-zA-Z0-9]{1,10}[-_.]{0,1}[a-zA-Z0-9]{1,10}@[a-zA-Z0-9]{1,5}[-_]{0,1}[a-zA-Z0-9]{1,5}.[a-zA-Z0-9]{1,5}[.]{0,1}[a-zA-Z0-9]{1,5}$/g.test(value) && value
        ? true
        : false, // eslint-disable-next-line
    Password: (() => {
      const hasOneLowerCase = /[a-z]{1,}/g.test(value); // eslint-disable-next-line
      const hasOneUpperCase = /[A-Z]{1,}/g.test(value); // eslint-disable-next-line
      const hasOneNumber = /[0-9]{1,}/g.test(value); // eslint-disable-next-line
      return value && hasOneLowerCase && hasOneUpperCase && hasOneNumber && /^[ -~]{8,30}$/g.test(value) ? true : false; // eslint-disable-next-line
    })(),
  };
  return list[name];
}
function Valide(changeError) {
  var array = [];
  var input_ = document.querySelectorAll("input");

  if (!Validate("Name", input_[0].value)) {
    array.push("FirstName Invalid");
    changeError((oldValues) => ({ ...oldValues, firstName: true }));
  }
  if (!Validate("Name", input_[1].value)) {
    array.push("LastName Invalid");
    changeError((oldValues) => ({ ...oldValues, lastName: true }));
  }
  if (!Validate("Username", input_[2].value)) {
    array.push("UserName Invalid");
    changeError((oldValues) => ({ ...oldValues, userName: true }));
  }
  if (!Validate("Email", input_[3].value)) {
    array.push("Email Invalid");
    changeError((oldValues) => ({ ...oldValues, email: true }));
  }
  if (!Validate("Password", input_[4].value)) {
    array.push("Password Invalid");
    changeError((oldValues) => ({ ...oldValues, pass1: true }));
  } else if (input_[4].value !== input_[5].value) {
    array.push("Passwords doesn't match");
    changeError((oldValues) => ({ ...oldValues, pass1: true }));
    changeError((oldValues) => ({ ...oldValues, pass2: true }));
  } else {
    changeError((oldValues) => ({ ...oldValues, pass1: false }));
    changeError((oldValues) => ({ ...oldValues, pass2: false }));
  }

  return array;
}

export { Valide, Validate };
