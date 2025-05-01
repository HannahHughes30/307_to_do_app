import React from "react";
import PropTypes from "prop-types";

function TableHeader() {
  return (
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Job</th>
        <th>Remove</th>
      </tr>
    </thead>
  );
}

function TableBody(props) {
  const rows = props.characterData.map((row, index) => {
    return (
      <tr key={index}>
        <td>{row._id}</td>
        <td>{row.name}</td>
        <td>{row.job}</td>
        <td>
          <button onClick={() => props.removeCharacter(row._id)}>Delete</button>
        </td>
      </tr>
    );
  });
  return <tbody>{rows}</tbody>;
}

function Table(props) {
  return (
    <table>
      <TableHeader />
      <TableBody
        characterData={props.characterData}
        removeCharacter={props.removeCharacter}
      />
    </table>
  );
}

Table.propTypes = {
  characterData: PropTypes.array.isRequired,
  removeCharacter: PropTypes.func.isRequired,
};

TableBody.propTypes = {
  characterData: PropTypes.array.isRequired,
  removeCharacter: PropTypes.func.isRequired,
};

export default Table;
