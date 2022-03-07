/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Loading from "../../../components/commons/Loading";
import DataTableComponent from "../../../components/commons/tables/DataTableComponent";
import CustomSelect from "../../../components/forms/CustomSelect";
import TextInputField from "../../../components/forms/TextInputField";
import Alert from "../../../services/classes/Alert";
import useApi from "../../../services/hooks/useApi";
import {
  alter,
  collection,
  destroy,
  store,
} from "../../../services/utils/controllers";

const AddModules = () => {
  const {
    data: modules,
    setData: setModules,
    loading,
    request,
  } = useApi(collection);

  const { data: roles, request: fetchRoles } = useApi(collection);

  const initialState = {
    id: 0,
    name: "",
    path: "",
    icon: "",
    parentId: 0,
    isMenu: false,
    generatePermissions: false,
    roles: [],
    type: "",
    currentRoles: [],
  };

  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [state, setState] = useState(initialState);

  useEffect(() => {
    request("modules");
    fetchRoles("roles");
  }, []);

  const handleEdit = (data) => {
    const roleIds = [];

    if (data.roles.length > 0) {
      data.roles.map((role) => {
        return roleIds.push(role.id);
      });
    }

    setState({
      id: data.id,
      name: data.name,
      path: data.path,
      icon: data.icon,
      parentId: data.parentId,
      isMenu: data.isMenu === 1 ? true : false,
      generatePermissions: data.generatePermissions === 1 ? true : false,
      currentRoles: data.roles,
      type: data.type,
      roles: roleIds,
    });
    setUpdate(true);
    setOpen(true);
  };

  const handleDestroy = (data) => {
    Alert.flash(
      "Are you sure?",
      "warning",
      "You would not be able to revert this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        destroy("modules", data.id)
          .then((res) => {
            setModules([...modules.filter((sb) => sb.id !== res.data.data.id)]);
            Alert.success("Deleted!!", res.data.message);
          })
          .catch((err) => console.log(err.message));
      }
    });
  };

  const columns = [
    {
      label: "Name",
      key: "name",
    },
    {
      label: "Path",
      key: "path",
    },
    {
      label: "Type",
      key: "type",
    },
  ];

  const handleSearch = (str) => {
    setSearchTerm(str);

    if (str !== "") {
      const filtered = modules.filter((row) => {
        return Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(str.toLowerCase());
      });

      setResults(filtered);
    } else {
      setResults(modules);
    }
  };

  const modulesOptions = (optionsArr) => {
    const arr = [];
    optionsArr.length > 0 &&
      optionsArr.forEach((el) => {
        arr.push({ key: el.id, label: el.name });
      });
    return arr;
  };

  const options = [
    { key: "module", label: "Module" },
    { key: "application", label: "Application" },
    { key: "page", label: "Page" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      name: state.name,
      path: state.path,
      icon: state.icon,
      parentId: state.parentId,
      isMenu: state.isMenu,
      generatePermissions: state.generatePermissions,
      roles: state.roles,
      type: state.type,
    };

    if (update) {
      try {
        alter("modules", state.id, data)
          .then((res) => {
            const result = res.data.data;

            setModules(
              modules.map((mod) => {
                if (result.id === mod.id) {
                  return result;
                }

                return mod;
              })
            );

            Alert.success("Updated", res.data.message);

            setState(initialState);
            setOpen(false);
          })
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        store("modules", data)
          .then((res) => {
            const newModule = res.data.data;

            setModules([newModule, ...modules]);
            Alert.success("Created!!", res.data.message);

            setState(initialState);
            setOpen(false);
          })
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      {loading ? <Loading /> : null}

      <div className="row">
        <div className="col-md-12">
          <div className="page-titles">
            <button
              className="btn btn-primary"
              onClick={() => setOpen(!open)}
              disabled={open}
            >
              <i className="fa fa-plus-square"></i> Add Modules
            </button>
          </div>
        </div>

        {open && (
          <>
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <div className="form-body">
                    <>
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-md-6">
                            <TextInputField
                              label="Name"
                              value={state.name}
                              onChange={(e) => {
                                setState({
                                  ...state,
                                  name: e.target.value,
                                });
                              }}
                              placeholder="Name"
                              type="text"
                            />
                          </div>

                          <div className="col-md-6">
                            <TextInputField
                              label="Path"
                              value={state.path}
                              placeholder="Path"
                              onChange={(e) => {
                                setState({
                                  ...state,
                                  path: e.target.value,
                                });
                              }}
                              type="text"
                            />
                          </div>

                          <div className="col-md-4">
                            <CustomSelect
                              options={modulesOptions(modules)}
                              value={state.parentId}
                              label="Parent Id"
                              onChange={(e) => {
                                setState({
                                  ...state,
                                  parentId: e.target.value,
                                });
                              }}
                              type="text"
                            />
                          </div>

                          <div className="col-md-4">
                            <CustomSelect
                              options={options}
                              value={state.type}
                              label="Type"
                              placeholder="Type"
                              onChange={(e) => {
                                setState({
                                  ...state,
                                  type: e.target.value,
                                });
                              }}
                              type="text"
                            />
                          </div>

                          <div className="col-md-4">
                            <TextInputField
                              value={state.icon}
                              label="Icon"
                              placeholder="Icon"
                              onChange={(e) => {
                                setState({
                                  ...state,
                                  icon: e.target.value,
                                });
                              }}
                              type="text"
                            />
                          </div>

                          <div
                            className="col-sm-4 col-md-6 d-flex justify-content-between"
                            // style={{ width: "300px !important" }}
                          >
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value={state.isMenu}
                                checked={
                                  state.isMenu
                                    ? 1
                                    : 0 || state.isMenu == 1
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  const value = e.target.checked ? true : false;

                                  setState({
                                    ...state,
                                    isMenu: value,
                                  });
                                }}
                              />

                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Is Menu
                              </label>
                            </div>

                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value={state.generatePermissions}
                                checked={
                                  state.generatePermissions
                                    ? 1
                                    : 0 || state.generatePermissions === 1
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  const value = e.target.checked ? true : false;

                                  setState({
                                    ...state,
                                    generatePermissions: value,
                                  });
                                }}
                              />

                              <label
                                className="form-check-label"
                                htmlFor="flexCheckDefault"
                              >
                                Generate Permission
                              </label>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="dropdown-divider"></div>

                            <div className="d-flex justify-content-between mt-5 mb-5">
                              <div className="row">
                                {roles && roles.length > 0
                                  ? roles.map((role) => {
                                      return (
                                        <div key={role.id} className="col-md-3">
                                          <div className="form-check">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              value={role.id}
                                              onChange={(e) => {
                                                let valIndex =
                                                  state.roles.includes(
                                                    e.target.value
                                                  ) &&
                                                  state.roles.indexOf(
                                                    e.target.value
                                                  );
                                                e.target.checked
                                                  ? setState({
                                                      ...state,
                                                      roles: [
                                                        e.target.value,
                                                        ...state.roles,
                                                      ],
                                                    })
                                                  : state.roles.includes(
                                                      e.target.value
                                                    ) &&
                                                    state.roles.splice(
                                                      valIndex,
                                                      1
                                                    ) &&
                                                    setState({
                                                      ...state,
                                                      roles: state.roles,
                                                    });
                                              }}
                                            />

                                            <label className="form-check-label">
                                              {role.name}
                                            </label>
                                          </div>
                                        </div>
                                      );
                                    })
                                  : null}
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12 mt-3 d-flex">
                            <button type="submit" className="btn btn-primary">
                              {update ? "Update" : "Submit"}
                            </button>

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
                      </form>
                    </>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="col-lg-12">
          <DataTableComponent
            pageName="Modules"
            columns={columns}
            rows={searchTerm.length < 1 ? modules : results}
            handleEdit={handleEdit}
            handleDelete={handleDestroy}
            term={searchTerm}
            searchKeyWord={handleSearch}
            // isFetching={isLoading}
          />
        </div>
      </div>
    </>
  );
};

export default AddModules;
