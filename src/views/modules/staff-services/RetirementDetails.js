/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import InstructionWidget from "../../../components/commons/widgets/InstructionWidget";
import TextInputField from "../../../components/forms/input/TextInputField";
import CustomSelect from "../../../components/forms/select/CustomSelect";
import CustomSelectOptions from "../../../components/forms/select/CustomSelectOptions";
import { collection } from "../../../services/utils/controllers";
import {
  formatCurrency,
  verifyNumOfDays,
} from "../../../services/utils/helpers";

const RetirementDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth.value.user);

  const initialState = {
    claim: null,
    claim_id: 0,
    title: "",
    total: 0,
    instructions: [],
    todo: "",
    status: "",
    update: false,
  };

  const formState = {
    from: "",
    to: "",
    benefit: null,
    categories: [],
    benefit_id: 0,
    additional_benefit_id: 0,
    category: null,
    description: "",
    amount: 0,
    numOfDays: 0,
    unitPrice: 0,
    daysRequired: false,
  };

  const [state, setState] = useState(initialState);
  const [instruction, setInstruction] = useState(formState);
  const [open, setOpen] = useState(false);
  const [benefits, setBenefits] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);

  const handleInstructionDestroy = (ins) => {
    console.log(ins);

    const newInstructions =
      state.instructions.length > 0 &&
      state.instructions.filter((instruction) => instruction.id !== ins.id);

    setState({
      ...state,
      instructions: newInstructions,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let count = 1000000000;

    const data = {
      id: Math.random(count),
      from: instruction.from,
      to: instruction.to,
      benefit_id: parseInt(instruction.benefit_id),
      additional_benefit_id: parseInt(instruction.additional_benefit_id),
      description: instruction.description,
      numOfDays: instruction.numOfDays,
      amount: parseFloat(instruction.amount),
      benefit: instruction.benefit,
    };

    setState({
      ...state,
      instructions: [data, ...state.instructions],
    });

    setInstruction(formState);
    setOpen(false);
  };

  const getGradeAmount = (entitlements) => {
    const fee = entitlements.filter(
      (entitlement) => entitlement.grade === auth.level
    );

    return fee[0];
  };

  const updateGrandTotal = () => {
    const instructions = state.instructions;

    if (instructions.length > 0) {
      const value = instructions.reduce(
        (balance, instruction) => balance + instruction.amount,
        0
      );
      const total = state.total - value;

      console.log(value);

      setState({
        ...state,
        total: total,
      });
    }
  };

  const handleBenefitAction = (benefit) => {
    if (
      !benefit.numOfDays &&
      benefit.entitlements.length > 0 &&
      benefit.children.length === 0
    ) {
      const fee = getGradeAmount(benefit.entitlements);
      setInstruction({
        ...instruction,
        daysRequired: false,
        categories: [],
        unitPrice: 0,
        amount: fee.amount,
      });
    } else if (
      benefit.numOfDays &&
      benefit.entitlements.length > 0 &&
      benefit.children.length === 0
    ) {
      const fee = getGradeAmount(benefit.entitlements);
      const value =
        instruction.numOfDays > 0 ? fee.amount * instruction.numOfDays : 0;

      const objKey = "categories" in benefit;

      setInstruction({
        ...instruction,
        daysRequired: true,
        unitPrice: fee.amount,
        categories: objKey ? benefit.categories : [],
        amount: value,
      });
    } else if (
      benefit.numOfDays &&
      benefit.entitlements.length === 0 &&
      benefit.children.length > 0
    ) {
      setInstruction({
        ...instruction,
        categories: benefit.children,
        daysRequired: true,
        unitPrice: 0,
        amount: 0,
      });
    } else {
      setInstruction({
        ...instruction,
        daysRequired: false,
        categories: [],
        unitPrice: 0,
        amount: 0,
      });
    }
  };

  useEffect(() => {
    if (location.pathname && location.state) {
      const claim = location.state.claim;
      const todo = location.state.todo;

      setState({
        ...state,
        claim_id: claim.id,
        title: claim.title,
        claim,
        todo,
      });

      setGrandTotal(claim.total_amount);
    }
  }, []);

  useEffect(() => {
    collection("benefits")
      .then((res) => {
        const data = res.data.data;

        setBenefits(data);
      })
      .catch((err) => console.log(err.message));
  }, []);

  useEffect(() => {
    if (instruction.from !== "" && instruction.to !== "") {
      if (instruction.benefit && instruction.benefit.numOfDays) {
        const daysDiff = verifyNumOfDays(instruction.from, instruction.to);

        const fee =
          instruction.unitPrice > 0 ? daysDiff * instruction.unitPrice : 0;

        setInstruction({
          ...instruction,
          numOfDays: daysDiff,
          amount: fee,
        });
      } else {
        setInstruction({
          ...instruction,
          numOfDays: 0,
        });
      }
    }
    return () => console.log("cleanup");
  }, [instruction.from, instruction.to]);

  useEffect(() => {
    if (instruction.benefit_id > 0 && benefits.length > 0) {
      const entity = benefits.filter(
        (single) => single.id == instruction.benefit_id
      );

      const benefit = entity[0];

      setInstruction({
        ...instruction,
        benefit: benefit,
      });
    }
  }, [instruction.benefit_id]);

  useEffect(() => {
    if (instruction.benefit !== null) {
      handleBenefitAction(instruction.benefit);
    }
  }, [instruction.benefit]);

  useEffect(() => {
    if (instruction.additional_benefit_id > 0) {
      const categories = instruction.categories;

      if (categories.length > 0) {
        const single = categories.filter(
          (cat) => cat.id == instruction.additional_benefit_id
        );
        const category = single[0];
        category["categories"] = categories;
        handleBenefitAction(category);
      }
    }
  }, [instruction.additional_benefit_id]);

  useEffect(() => {
    updateGrandTotal();
    return () => console.log("clean up here!!");
  }, [state.instructions]);

  return (
    <>
      <div className="row">
        <div className="col-md-12 mb-4">
          <button
            className="btn btn-success btn-rounded"
            onClick={() => setOpen(!open)}
            disabled={open}
          >
            <i className="fa fa-plus mr-2"></i>
            Add Instructions
          </button>
        </div>
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-8">
                  <TextInputField
                    label="Title"
                    value={state.title.toUpperCase()}
                    onChange={(e) =>
                      setState({ ...state, title: e.target.value })
                    }
                    disabled
                  />
                </div>
                <div className="col-md-4">
                  <TextInputField
                    label="Amount"
                    value={formatCurrency(grandTotal)}
                    onChange={(e) => setGrandTotal(e.target.value)}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {open && (
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-4">
                      <CustomSelect
                        label="Benefit"
                        value={instruction.benefit_id}
                        onChange={(e) =>
                          setInstruction({
                            ...instruction,
                            benefit_id: e.target.value,
                          })
                        }
                      >
                        <CustomSelectOptions
                          label="Select Benefit"
                          value={0}
                          disabled
                        />

                        {benefits.length > 0 &&
                          benefits.map(
                            (benefit) =>
                              benefit.parentId === 0 && (
                                <CustomSelectOptions
                                  key={benefit.id}
                                  label={benefit.name}
                                  value={benefit.id}
                                />
                              )
                          )}
                      </CustomSelect>
                    </div>

                    <div className="col-md-4">
                      <TextInputField
                        label="From"
                        type="date"
                        value={instruction.from}
                        onChange={(e) =>
                          setInstruction({
                            ...instruction,
                            from: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="col-md-4">
                      <TextInputField
                        label="To"
                        type="date"
                        value={instruction.to}
                        onChange={(e) =>
                          setInstruction({ ...instruction, to: e.target.value })
                        }
                      />
                    </div>

                    {instruction.categories.length > 0 && (
                      <div className="col-md-12">
                        <CustomSelect
                          label="Category"
                          value={instruction.additional_benefit_id}
                          onChange={(e) =>
                            setInstruction({
                              ...instruction,
                              additional_benefit_id: e.target.value,
                            })
                          }
                        >
                          <CustomSelectOptions
                            label="Select Category"
                            value={0}
                            disabled
                          />

                          {instruction.categories.length > 0 &&
                            instruction.categories.map((child) => (
                              <CustomSelectOptions
                                key={child.id}
                                label={child.name}
                                value={child.id}
                              />
                            ))}
                        </CustomSelect>
                      </div>
                    )}

                    {instruction.daysRequired && (
                      <div className="col-md-12">
                        <TextInputField
                          label="Number of Days"
                          type="number"
                          value={instruction.numOfDays}
                          onChange={(e) =>
                            setInstruction({
                              ...instruction,
                              numOfDays: e.target.value,
                            })
                          }
                          disabled
                        />
                      </div>
                    )}

                    <div className="col-md-12">
                      <TextInputField
                        label="Number of Days"
                        value={instruction.description}
                        onChange={(e) =>
                          setInstruction({
                            ...instruction,
                            description: e.target.value,
                          })
                        }
                        placeholder="Enter Description"
                        multiline={4}
                      />
                    </div>

                    <div className="col-md-12">
                      <TextInputField
                        label="Amount"
                        value={formatCurrency(instruction.amount)}
                        onChange={(e) =>
                          setInstruction({
                            ...instruction,
                            amount: e.target.value,
                          })
                        }
                        disabled={
                          instruction.benefit &&
                          instruction.benefit.label !== "others"
                        }
                      />
                    </div>

                    <div className="col-md-12 mt-3">
                      <div className="btn-group btn-rounded">
                        <button className="btn btn-success" type="submit">
                          Add Detail
                        </button>
                        <button
                          className="btn btn-danger"
                          type="button"
                          onClick={() => {
                            setInstruction(formState);
                            setOpen(false);
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <table className="table table-bordered table-striped table-hover">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {state.instructions.length > 0 ? (
                    state.instructions.map((ins, i) => (
                      <InstructionWidget
                        key={i}
                        instruction={ins}
                        onDestroy={handleInstructionDestroy}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-danger">
                        NO DETAILS ADDED AT THIS TIME!!
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

export default RetirementDetails;
