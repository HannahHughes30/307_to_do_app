import React, { useState } from "react";
import PropTypes from "prop-types";

function Form(props) {
  const [person, setPerson] = useState({
    name: "",
    job: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "job") setPerson({ name: person["name"], job: value });
    else setPerson({ name: value, job: person["job"] });
  }

  function submitForm() {
    props.handleSubmit(person);
    setPerson({ name: "", job: "" });
  }

  return (
    <form>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        name="name"
        id="name"
        value={person.name}
        onChange={handleChange}
      />
      <label htmlFor="job">Job</label>
      <input
        type="text"
        name="job"
        id="job"
        value={person.job}
        onChange={handleChange}
      />
      <input type="button" value="Submit" onClick={submitForm} />
    </form>
  );
}

// ensures handleSubmit is a function and must be passed in (cant use <Form /> without a handleSubmit)
Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default Form;
