import React from "react";

const TableHeader = ({ columns, handleEdit, handleDelete, assignRole }) => {
  return (
    <thead>
      <tr>
        {columns.length > 0 &&
          columns.map((col, i) => <th key={i}>{col.label}</th>)}
        {(handleEdit !== undefined ||
          handleDelete !== undefined ||
          assignRole !== undefined) && <th>Action</th>}
      </tr>
    </thead>
  );
};

export default TableHeader;
