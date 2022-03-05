import React, { useEffect, useState } from "react";
import DoughnutChart from "../components/charts/DoughnutChart";
import BarChart from "../components/charts/BarChart";
import { collection } from "../services/utils/controllers";
import { Link } from "react-router-dom";
import { formatCurrency } from "../services/utils/helpers";
import CustomCard from "../components/commons/cards/CustomCard";

const Dashboard = () => {
  const [overview, setOverview] = useState({});
  const [performance, setPerformance] = useState({});
  const [summary, setSummary] = useState({});

  useEffect(() => {
    try {
      collection("dashboard/overview")
        .then((res) => {
          const data = res.data.data;

          setOverview(data.utilization);
          setPerformance(data.performance);
          setSummary(data.summary);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  const {
    approvedAmount,
    actualBalance,
    actualExpenditure,
    bookedBalance,
    bookedExpenditure,
    expectedPerformance,
    actualPerformance,
  } = summary;

  return (
    <>
      <div className="form-head d-md-flex mb-sm-4 mb-3 align-items-start">
        <div className="mr-auto  d-lg-block">
          <h2 className="text-black font-w600">Dashboard</h2>
          <p className="mb-0">Welcome Staff</p>
        </div>

        <Link to="/import/dependencies" className="btn btn-primary rounded">
          <i className="flaticon-381-settings-2 mr-0"> </i>
        </Link>
      </div>

      <div className="row">
        <div className="col-xl-6 col-xxl-12">
          <div className="row">
            <div className="col-sm-6 col-md-3">
              <CustomCard color={"white"} />
            </div>
            <div className="col-sm-6 col-md-3">
              <CustomCard />
            </div>
            <div className="col-sm-6 col-md-3">
              <CustomCard color={"white"} />
            </div>
            <div className="col-sm-6 col-md-3">
              <CustomCard color={"white"} />
            </div>
          </div>

          <div className="row" style={{ flexDirection: "row-reverse" }}>
            <div className="col-sm-6 col-md-3">
              <CustomCard color={"white"} />
            </div>
            <div className="col-sm-6 col-md-3">
              <CustomCard />
            </div>
            <div className="col-sm-6 col-md-3">
              <CustomCard color={"white"} />
            </div>
            <div className="col-sm-6 col-md-3">
              <CustomCard color={"white"} />
            </div>
          </div>
        </div>

        <div className="col-xl-12 col-md-12 col-sm-12">
          <div className="row">
            <div className="col-sm-12 col-md-4 col-lg-4">
              <div className="card">
                <div className="card-body">
                  <div className="media align-items-center">
                    <DoughnutChart
                      chartData={overview}
                      totalApproved={approvedAmount}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-8 col-lg-8">
              <div className="card text-white bg-success">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between">
                    <span className="mb-0">Approved Amount :</span>
                    <strong>{formatCurrency(approvedAmount)}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span className="mb-0">Booked Expenditure :</span>
                    <strong>{formatCurrency(bookedExpenditure)}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span className="mb-0">Actual Expenditure :</span>
                    <strong>{formatCurrency(actualExpenditure)}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span className="mb-0">Booked Balance :</span>
                    <strong>{formatCurrency(bookedBalance)}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span className="mb-0">Actual Balance :</span>
                    <strong>{formatCurrency(actualBalance)}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span className="mb-0">Expected Performance :</span>
                    <strong>{Math.round(expectedPerformance) + "%"}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span className="mb-0">Actual Performance :</span>
                    <strong>{Math.round(actualPerformance) + "%"}</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-12 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-header align-items-center border-0 pb-0">
              <h3 className="fs-20 text-black">Monthly Expenses</h3>

              <Link className="btn btn-outline-primary rounded" to="#">
                Download CSV
              </Link>
            </div>

            <div className="card-body pb-0 pt-0">
              <div className="d-flex align-items-center mb-3">
                <BarChart
                  chartData={performance !== undefined ? performance : {}}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
