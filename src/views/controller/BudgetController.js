/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomCard from "../../components/commons/cards/CustomCard";
import { collection } from "../../services/utils/controllers";

const BudgetController = () => {
  const auth = useSelector((state) => state.auth.value.user);

  const overviewState = {
    paymentForms: 0,
    thirdParty: 0,
    staffPayment: 0,
    aef: 0,
    logisticsRefund: 0,
    reversals: 0,
    pendingTransactions: 0,
    paidTransactions: 0,
    claims: 0,
    retirement: 0,
  };

  const [state, setState] = useState(overviewState);

  useEffect(() => {
    if (auth !== null) {
      collection("claims")
        .then((res) => {
          const claims = res.data.data;

          const aef = claims.filter(
            (claim) => claim && claim.owner.department_id == auth.department_id
          );

          const personal = claims.filter(
            (claim) => claim && claim.owner.id == auth.id
          );

          const retirement = personal.filter(
            (claim) => claim.type === "touring-advance" && !claim.rettired
          );

          setState({
            ...state,
            aef: aef.length,
            claims: personal.length,
            retirement: retirement.length,
          });
        })
        .catch((err) => console.log(err.message));
    }
  }, [auth]);

  useEffect(() => {
    if (auth !== null) {
      collection("expenditures")
        .then((res) => {
          const expenditures = res.data.data;

          const paymentForms = expenditures.filter(
            (exp) =>
              exp && exp.subBudgetHead.department_id == auth.department_id
          );

          const thirdParty = paymentForms.filter(
            (exp) => exp.payment_type === "third-party"
          );

          const staffPayment = paymentForms.filter(
            (exp) => exp.payment_type === "staff-payment"
          );

          const pending = paymentForms.filter((exp) => exp.status !== "paid");

          const paid = paymentForms.filter((exp) => exp.status === "paid");

          setState({
            ...state,
            paymentForms: paymentForms.length,
            thirdParty: thirdParty.length,
            staffPayment: staffPayment.length,
            pendingTransactions: pending.length,
            paidTransactions: paid.length,
          });
        })
        .catch((err) => console.log(err.message));
    }
  }, [auth]);

  const cards = [
    {
      title: "No. of Payment Forms",
      roles: [
        "budget-controller",
        "es",
        "dfpm",
        "ict-manager",
        "ict-admin",
        "super-administrator",
      ],
      count: state.paymentForms,
      path: "",
    },
    {
      title: "No. of Third-Party",
      roles: [
        "budget-controller",
        "es",
        "dfpm",
        "ict-manager",
        "ict-admin",
        "super-administrator",
      ],
      count: state.thirdParty,
      path: "",
    },
    {
      title: "No. of Staff Payments",
      roles: [
        "budget-controller",
        "es",
        "dfpm",
        "ict-manager",
        "ict-admin",
        "super-administrator",
      ],
      count: state.staffPayment,
      path: "",
    },
    {
      title: "No. of AEF",
      roles: [
        "budget-controller",
        "es",
        "dfpm",
        "ict-manager",
        "ict-admin",
        "super-administrator",
      ],
      count: state.aef,
      path: "",
    },
    {
      title: "Pending Logistics Refund",
      roles: [
        "budget-controller",
        "es",
        "dfpm",
        "ict-manager",
        "ict-admin",
        "super-administrator",
      ],
      count: state.logisticsRefund,
      path: "",
    },
    {
      title: "No. of Pending Reversals",
      roles: [
        "budget-controller",
        "es",
        "dfpm",
        "ict-manager",
        "ict-admin",
        "super-administrator",
      ],
      count: state.reversals,
      path: "",
    },
    {
      title: "No. of Pending Transactions",
      roles: [
        "budget-controller",
        "es",
        "dfpm",
        "ict-manager",
        "ict-admin",
        "super-administrator",
      ],
      count: state.pendingTransactions,
      path: "",
    },
    {
      title: "No. of Paid Transactions",
      roles: [
        "budget-controller",
        "es",
        "dfpm",
        "ict-manager",
        "ict-admin",
        "super-administrator",
      ],
      count: state.paidTransactions,
      path: "",
    },
    {
      title: "No. of Registered Claims",
      roles: ["staff"],
      count: state.claims,
      path: "",
    },
    {
      title: "Claims to be Rettired",
      roles: ["staff"],
      count: state.retirement,
      path: "",
    },
  ];

  return (
    <>
      <div className="row">
        {cards.map(
          (card, i) =>
            auth &&
            auth.roles.some((role) => card.roles.includes(role.label)) && (
              <div className="col-sm-6 col-md-3" key={i}>
                <CustomCard
                  title={card.title}
                  count={card.count}
                  path={card.path}
                />
              </div>
            )
        )}
      </div>
    </>
  );
};

export default BudgetController;
