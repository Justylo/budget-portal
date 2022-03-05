import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/commons/Loading";
import { collection } from "../../../services/utils/controllers";

const Retirement = () => {
  const auth = useSelector((state) => state.auth.value.user);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRetirement = (data) => {
    navigate(`/rettire/${data.reference_no}`, {
      state: {
        claim: data,
        todo: "retire",
      },
    });
  };

  useEffect(() => {
    if (auth !== null) {
      setLoading(true);
      collection("claims")
        .then((res) => {
          const data = res.data.data;

          setClaims(
            data.filter(
              (claim) =>
                claim.owner.id === auth.id && claim.type === "touring-advance"
            )
          );
          setLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
          setLoading(false);
        });
    }
  }, [auth]);

  return (
    <>
      {loading && <Loading />}

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <table className="table table-bordered table-striped table-hover">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {claims.length > 0 ? (
                    claims.map((claim) => (
                      <tr key={claim.id}>
                        <td>{claim.title}</td>
                        <td>
                          <div className="btn-group">
                            <button
                              className="btn btn-success"
                              type="button"
                              onClick={() => handleRetirement(claim)}
                            >
                              Rettire
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="text-danger">
                        No Data Found!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Retirement;
