/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { collection, store } from "../../../services/utils/controllers";
import CustomSelect from "../../../components/forms/CustomSelect";
import TextInputField from "../../../components/forms/TextInputField";
import Alert from "../../../services/classes/Alert";
import useApi from "../../../services/hooks/useApi";

const Expenditures = () => {
  const { data: subBudgetHeads, request } = useApi(collection);

  const initialState = {
    claim: null,
    code: "",
    title: "",
    beneficiary: "",
    amount: 0,
    sub_budget_head_id: 0,
    available_balance: 0,
    new_balance: 0,
    budget_code: "",
    claim_id: 0,
    type: "",
    payment_type: "",
    status: "cleared",
    additional_info: "",
  };
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    request("subBudgetHeads");
  }, []);

  useEffect(() => {
    const single =
      state.sub_budget_head_id > 0 &&
      subBudgetHeads.filter((sub) => sub.id == state.sub_budget_head_id && sub);

    if (single.length > 0) {
      setState({
        ...state,
        budget_code: single[0].budgetCode,
        available_balance: parseFloat(single[0].approved_amount),
      });
    }
  }, [state.sub_budget_head_id]);

  useEffect(() => {
    if (state.available_balance > 0 && state.amount > 0) {
      const value =
        parseFloat(state.available_balance) - parseFloat(state.amount);

      setState({
        ...state,
        new_balance: value,
      });
    }
  }, [state.available_balance, state.amount]);

  const handleChange = (value) => {
    if (value.length >= 8) {
      collection(`fetch/claims/${value}`)
        .then((res) => {
          const claim = res.data.data;

          setState({
            ...state,
            code: claim.reference_no,
            claim: claim,
            title: claim.title,
            beneficiary: claim.owner.name.toUpperCase(),
            amount: claim.total_amount,
            claim_id: claim.id,
          });
        })
        .catch((err) => console.log(err));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      payment_type: state.payment_type,
      type: state.payment_type === "staff-payment" ? state.type : "other",
      claim_id: state.claim_id,
      sub_budget_head_id: state.sub_budget_head_id,
      amount: state.amount,
      new_balance: state.new_balance,
      beneficiary: state.beneficiary,
      description: state.title,
      status: state.status,
      additional_info: state.additional_info,
    };

    store("expenditures", data).then((res) => {
      console.log(res);
      Alert.success("Expenditure", "Created Successfully!");

      setState(initialState);
    });
  };

  const subBudgetHeadsOptions = (optionsArr) => {
    const arr = [];
    optionsArr.length > 0 &&
      optionsArr.forEach((el) => {
        arr.push({ key: el.id, label: el.name });
      });
    return arr;
  };

  const paymentType = [
    { key: "staff-claim", label: "STAFF CLAIM" },
    { key: "touring-advance", label: "TOURING ADVANCE" },
    { key: "other", label: "OTHER" },
  ];

  const options = [
    { key: "staff-payment", label: "STAFF PAYMENT" },
    { key: "third-party", label: "THIRD PARTY" },
  ];

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="page-titles">
          <h2>New Expenditure</h2>
        </div>
      </div>

      <>
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <div className="form-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-4">
                      <CustomSelect
                        options={options}
                        defaultInputValue="SELECT PAYMENT TYPE"
                        placeholder="STAFF PAYMENT"
                        type="text"
                        value={state.payment_type}
                        onChange={(e) => {
                          setState({
                            ...state,
                            payment_type: e.target.value,
                          });
                        }}
                        error={
                          errors &&
                          errors.payment_type &&
                          errors.payment_type.length > 0
                        }
                        errorMessage={
                          errors &&
                          errors.payment_type &&
                          errors.payment_type[0]
                        }
                      />
                    </div>

                    <div className="col-md-4">
                      <CustomSelect
                        options={paymentType}
                        placeholder="STAFF PAYMENT TYPE"
                        value={state.type}
                        onChange={(e) =>
                          setState({ ...state, type: e.target.value })
                        }
                        error={errors && errors.type && errors.type.length > 0}
                        errorMessage={errors && errors.type && errors.type[0]}
                        disabled={state.payment_type === "third-party"}
                      />
                    </div>

                    <div className="col-md-4">
                      <TextInputField
                        placeholder="ENTER CLAIM ID"
                        type="text"
                        value={state.code}
                        onChange={(e) => {
                          setState({ ...state, code: e.target.value });
                          handleChange(e.target.value);
                        }}
                        error={errors && errors.code && errors.code.length > 0}
                        errorMessage={errors && errors.code && errors.code[0]}
                        readOnly={state.payment_type === "third-party"}
                      />
                    </div>

                    <div className="col-md-12">
                      <CustomSelect
                        defaultText="SELECT SUB BUDGET HEAD"
                        options={subBudgetHeadsOptions(subBudgetHeads)}
                        value={state.sub_budget_head_id}
                        onChange={(e) => {
                          setState({
                            ...state,
                            sub_budget_head_id: e.target.value,
                          });
                        }}
                        error={
                          errors && errors.isSuper && errors.isSuper.length > 0
                        }
                        errorMessage={
                          errors && errors.isSuper && errors.isSuper[0]
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <TextInputField
                        placeholder="BUDGET CODE"
                        type="text"
                        value={state.budget_code}
                        onChange={(e) =>
                          setState({ ...state, budget_code: e.target.value })
                        }
                        error={
                          errors &&
                          errors.budget_code &&
                          errors.budget_code.length > 0
                        }
                        errorMessage={
                          errors && errors.budget_code && errors.budget_code[0]
                        }
                        readOnly
                      />
                    </div>

                    <div className="col-md-6">
                      <TextInputField
                        placeholder="AVAILABLE BALANCE"
                        type="number"
                        value={state.available_balance}
                        onChange={(e) =>
                          setState({
                            ...state,
                            available_balance: e.target.value,
                          })
                        }
                        error={
                          errors &&
                          errors.available_balance &&
                          errors.available_balance.length > 0
                        }
                        errorMessage={
                          errors &&
                          errors.available_balance &&
                          errors.available_balance[0]
                        }
                        readOnly
                      />
                    </div>

                    <div className="col-md-6">
                      <TextInputField
                        placeholder="AMOUNT"
                        type="number"
                        value={state.amount}
                        onChange={(e) =>
                          setState({ ...state, amount: e.target.value })
                        }
                        error={
                          errors &&
                          errors.new_balance &&
                          errors.new_balance.length > 0
                        }
                        errorMessage={
                          errors && errors.new_balance && errors.new_balance[0]
                        }
                        readOnly={state.payment_type === "staff-payment"}
                      />
                    </div>

                    <div className="col-md-6">
                      <TextInputField
                        placeholder="NEW BALANCE"
                        type="number"
                        value={state.new_balance}
                        onChange={(e) =>
                          setState({ ...state, new_balance: e.target.value })
                        }
                        error={
                          errors &&
                          errors.new_balance &&
                          errors.new_balance.length > 0
                        }
                        errorMessage={
                          errors && errors.new_balance && errors.new_balance[0]
                        }
                        readOnly
                      />
                    </div>

                    <div className="col-md-12">
                      <TextInputField
                        placeholder="BENEFICIARY"
                        type="text"
                        value={state.beneficiary}
                        onChange={(e) =>
                          setState({ ...state, beneficiary: e.target.value })
                        }
                        error={
                          errors &&
                          errors.beneficiary &&
                          errors.beneficiary.length > 0
                        }
                        errorMessage={
                          errors && errors.beneficiary && errors.beneficiary[0]
                        }
                        readOnly={state.payment_type === "staff-payment"}
                      />
                    </div>

                    <div className="col-md-12">
                      <TextInputField
                        placeholder="DESCRIPTION"
                        multiline={2}
                        type="text"
                        value={state.title}
                        onChange={(e) =>
                          setState({ ...state, title: e.target.value })
                        }
                        readOnly={state.payment_type === "staff-payment"}
                      />
                    </div>

                    <div className="col-md-12">
                      <TextInputField
                        placeholder="ADDITIONAL INFO"
                        value={state.additional_info}
                        onChange={(e) =>
                          setState({
                            ...state,
                            additional_info: e.target.value,
                          })
                        }
                        error={
                          errors &&
                          errors.cannot_expire &&
                          errors.cannot_expire.length > 0
                        }
                        errorMessage={
                          errors &&
                          errors.cannot_expire &&
                          errors.cannot_expire[0]
                        }
                      />
                    </div>

                    <div className="col-md-12 mt-3">
                      <button type="submit" className="btn btn-primary">
                        <i className="fa fa-send"></i> Submit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                          setState(initialState);
                          setErrors({});
                        }}
                      >
                        <i className="fa fa-close"></i> Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Expenditures;
