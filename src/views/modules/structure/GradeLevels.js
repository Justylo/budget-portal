/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import BasicTable from "../../../components/commons/tables/BasicTable";
import Form from "../../../components/forms/Form";
import FormInput from "../../../components/forms/FormInput";
import SubmitButton from "../../../components/forms/SubmitButton";
// import CustomSelect from "../../../components/forms/CustomSelect";
// import TextInputField from "../../../components/forms/TextInputField";
import Alert from "../../../services/classes/Alert";
import * as Yup from "yup";
import {
  collection,
  alter,
  store,
  destroy,
} from "../../../services/utils/controllers";
import useApi from "../../../services/hooks/useApi";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Grade Level Name"),
  code: Yup.string().required().label("Grade Level Code"),
});

const GradeLevels = () => {
  const {
    request,
    data: gradeLevels,
    setData: setGradeLevels,
  } = useApi(collection);

  useEffect(() => {
    request("gradeLevels");
  }, []);

  const initialState = {
    id: 0,
    name: "",
    code: "",
  };

  const [state, setState] = useState(initialState);
  const [update, setUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  // const [status, setStatus] = useState(false)

  const columns = [
    {
      label: "Name",
      key: "name",
    },
    {
      label: "Code",
      key: "code",
    },
  ];

  const handleUpdate = (data) => {
    // console.log(data);
    setState(data);
    setUpdate(true);
    setOpen(true);
  };

  const handleSubmit = (data, { resetForm }) => {
    if (update) {
      try {
        alter("gradeLevels", state.id, data)
          .then((res) => {
            const result = res.data.data;

            setGradeLevels(
              gradeLevels.map((el) => {
                if (result.id === el.id) {
                  return result;
                }

                return el;
              })
            );
            Alert.success("Updated", res.data.message);
          })
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        store("gradeLevels", data)
          .then((res) => {
            const result = res.data.data;

            setGradeLevels([result, ...gradeLevels]);
            Alert.success("Created!!", res.data.message);
          })
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    }

    setUpdate(false);
    setState(initialState);
    setOpen(false);

    // resetForm();
  };

  const handleDestroy = (data) => {
    Alert.flash(
      "Are you sure?",
      "warning",
      "You would not be able to revert this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        destroy("roles", data.label)
          .then((res) => {
            setGradeLevels([
              ...gradeLevels.filter((role) => role.id !== res.data.data.id),
            ]);
            Alert.success("Deleted!!", res.data.message);
          })
          .catch((err) => console.log(err.message));
      }
    });
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="page-titles">
          <button
            className="btn btn-primary"
            onClick={() => setOpen(!open)}
            disabled={open}
          >
            <i className="fa fa-plus-square"></i> Add Grade Level
          </button>
        </div>
      </div>

      {open && (
        <>
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="form-body">
                  <form onSubmit={(values) => console.log(values)}>
                    <Form
                      initialValues={{
                        code: state.code,
                        name: state.name,
                      }}
                      onSubmit={handleSubmit}
                    >
                      <div className="row">
                        <div className="col-md-6">
                          <FormInput
                            name="name"
                            placeholder="Grade Level Name"
                          />
                        </div>

                        <div className="col-md-6">
                          <FormInput
                            name="code"
                            placeholder="Grade Level Code"
                          />
                        </div>

                        <div className="col-md-12 mt-3 d-flex">
                          <SubmitButton title="Submit" />
                          {/* <button type="submit" className="btn btn-primary">
                            Submit
                          </button> */}

                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                              setUpdate(false);
                              setState(initialState);
                              setOpen(false);
                            }}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </Form>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="col-lg-12">
        <BasicTable
          page="Grade Levels"
          columns={columns}
          rows={gradeLevels}
          handleEdit={handleUpdate}
          handleDelete={handleDestroy}
        />
      </div>
    </div>
  );
};

export default GradeLevels;
