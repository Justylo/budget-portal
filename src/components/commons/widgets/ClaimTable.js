import React from "react";
import { Link } from "react-router-dom";

const ClaimTable = ({ claims, onEdit, onDestroy, onView, addDetails }) => {
  return (
    <>
      <div className="card">
        {/* <div className="card-header">
          <h4 className="card-title">{page}</h4>
        </div> */}

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-striped verticle-middle table-responsive-sm">
              {/* <thead>
                 <tr>
                  {columns &&
                    columns.length > 0 &&
                    columns.map((col, index) => (
                      <th scope="col" key={index}>
                        {col.label}
                      </th>
                    ))}
                  {handleEdit !== undefined && <th scope="col">Action</th>}
                </tr> 
              </thead> */}

              <tbody>
                {claims.map((claim) => (
                  <tr>
                    <td>{claim.title}</td>
                    <td>{`NGN ${new Intl.NumberFormat().format(
                      claim.total_amount
                    )}`}</td>
                    <td>
                      {claim.status === "registered" ||
                      claim.status === "cleared" ||
                      claim.status === "batched" ? (
                        <button
                          className="btn-sm btn btn-primary"
                          onClick={() => onView(claim)}
                        >
                          VIEW CLAIM
                        </button>
                      ) : (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => addDetails(claim)}
                            disabled={
                              claim.status === "registered" ||
                              claim.status === "unregistered"
                            }
                          >
                            ADD DETAILS
                          </button>

                          <button
                            onClick={() => onEdit(claim)}
                            className="btn btn-warning btn-sm"
                            disabled={
                              claim.status === "registered" ||
                              claim.status === "unregistered"
                            }
                          >
                            Edit
                            {/* <FiEdit /> */}
                          </button>

                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => onDestroy(claim)}
                            disabled={
                              claim.status === "registered" ||
                              claim.status === "unregistered"
                            }
                          >
                            Delete
                            {/* <FiTrash2 /> */}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClaimTable;
