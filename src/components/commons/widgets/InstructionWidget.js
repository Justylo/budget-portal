import React from "react";
import { formatCurrency } from "../../../services/utils/helpers";

const InstructionWidget = ({ instruction, onDestroy }) => {
  return (
    <tr>
      <td>{instruction.from}</td>
      <td>{instruction.to}</td>
      <td>{instruction.benefit && instruction.benefit.name}</td>
      <td>{formatCurrency(instruction.amount)}</td>

      <td>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDestroy(instruction)}
        >
          <i className="fa fa-close"></i>
          {/* <FiX /> */}
        </button>
      </td>
    </tr>
  );
};

export default InstructionWidget;
