import React, { useReducer, useState, useRef, useEffect } from "react";
import "../Style/Todo.css";
import "../Style/Responsive.css";
import { FaEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { IoCheckmarkDoneCircle } from "react-icons/io5";

export const Todo = () => {
  const initialState = { tasks: [], doneTask: [] };
  const [state, dispatch] = useReducer(Reducer, initialState);
  const [inputValue, setInputValue] = useState("");
  const [warning, setWarning] = useState(false);
  const [active, setActive] = useState(true);
  const [reInput, setReInput] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const editInputRef = useRef(null);

  function Reducer(state, action) {
    switch (action.type) {
      case "ADD_TASK":
        return {
          ...state,
          tasks: [
            ...state.tasks,
            { id: state.tasks.length + 1, task: action.payload },
          ],
        };

      case "DELETE_TASK":
        return {
          ...state,
          tasks: state.tasks.filter((value, index) => index !== action.payload),
        };

      case "DELETE_DONE_TASK":
        return {
          ...state,
          doneTask: state.doneTask.filter(
            (value, index) => index !== action.payload
          ),
        };

      case "ADD_DONE":
        const taskToAdd = state.tasks.find(
          (task, index) => index === action.payload
        );
        taskToAdd.completedAt = new Date().toLocaleString();
        return {
          tasks: state.tasks.filter((task, index) => index !== action.payload),
          doneTask: [...state.doneTask, taskToAdd],
        };

      case "EDIT_TASK":
        const updatedTasks = [...state.tasks];
        updatedTasks[action.payload.index] = {
          ...updatedTasks[action.payload.index],
          task: action.payload.task,
        };
        return { ...state, tasks: updatedTasks };

      default:
        return state;
    }
  }

  const handleEvent = (e) => {
    setWarning(false);
    setInputValue(e.target.value);
  };

  const addTask = () => {
    if (inputValue.trim() !== "") {
      dispatch({ type: "ADD_TASK", payload: inputValue });
    } else {
      setWarning(true);
    }
    setInputValue("");
  };

  const deleteTask = (index) => {
    dispatch({ type: "DELETE_TASK", payload: index });
  };

  const deleteDoneTask = (index) => {
    dispatch({ type: "DELETE_DONE_TASK", payload: index });
  };

  const clearInputValue = () => {
    setInputValue("");
    setReInput("");
  };

  const toggleActive = () => {
    setActive(!active);
  };

  const AddDoneData = (index) => {
    dispatch({ type: "ADD_DONE", payload: index });
  };

  const handleEditEvent = (index, task) => {
    setEditIndex(index);
    setReInput(task);
  };

  const addReTask = (index) => {
    if (reInput.trim() === "") {
      window.alert("Task must be filled compulsory");
      setEditIndex(-1);
      setReInput("");
      return;
    }
    dispatch({ type: "EDIT_TASK", payload: { index, task: reInput } });
    setEditIndex(-1);
    setReInput("");
  };

  const buttonEventHandle = (e, index, type) => {
    if (e.key === "Enter") {
      if (type === "addTask") {
        addTask();
      } else if (type === "editTask") {
        if (reInput.trim() === "") {
          window.alert("Task must be filled compulsory");
          setEditIndex(-1);
          setReInput("");
          return;
        }
        dispatch({ type: "EDIT_TASK", payload: { index, task: reInput } });
        setEditIndex(-1);
        setReInput("");
      }
    }
  };

  useEffect(() => {
    if (editIndex !== -1 && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editIndex]);

  return (
    <>
      <div className="main-container">
        <div className="header">
          <h1>To-Do App</h1>
          <h2>🎯</h2>
        </div>

        <div className="data">
          <input
            type="text"
            name="task"
            id="task"
            placeholder="Enter your task....🚀"
            value={inputValue}
            onChange={(e) => handleEvent(e)}
            onKeyDown={(e) => buttonEventHandle(e, null, "addTask")}
          />
          <div className="btn">
            <button onClick={addTask}>Add Task</button>
            <button onClick={clearInputValue}>Clear</button>
          </div>
        </div>

        {warning && <p id="warning">Task cannot be empty!</p>}

        <div className="pages">
          <button className={active ? "active" : ""} onClick={toggleActive}>
            To-Do ⛳
          </button>
          <button className={!active ? "active" : ""} onClick={toggleActive}>
            Done ✅
          </button>
        </div>

        <div className="Tasks">
          {active
            ? state.tasks.map((value, index) => (
                <div className="task" key={value.id}>
                  {editIndex === index ? (
                    <div className="edit-task">
                      <input
                        ref={editInputRef}
                        type="text"
                        id="etask"
                        name="etask"
                        value={reInput}
                        onChange={(e) => setReInput(e.target.value)}
                        onKeyDown={(e) =>
                          buttonEventHandle(e, index, "editTask")
                        }
                      />
                      <button onClick={() => addReTask(index)}>Update</button>
                    </div>
                  ) : (
                    <h3>{value.task}</h3>
                  )}
                  <div className="operations">
                    <FaEdit
                      id="edit"
                      onClick={() => handleEditEvent(index, value.task)}
                    />
                    <MdDeleteSweep
                      id="delete"
                      onClick={() => deleteTask(index)}
                    />
                    <IoCheckmarkDoneCircle
                      id="done"
                      onClick={() => AddDoneData(index)}
                    />
                  </div>
                </div>
              ))
            : state.doneTask.map((value, index) => (
                <div className="task" key={index}>
                  <div className="task-content">
                    <h3
                      style={{ textDecoration: "line-through", color: "#ccc" }}
                    >
                      {value.task}
                    </h3>
                    <div className="completed-time">
                      Completed At: {value.completedAt}
                    </div>
                  </div>
                  <div className="operations">
                    <MdDeleteSweep
                      id="delete"
                      onClick={() => deleteDoneTask(index)}
                    />
                  </div>
                </div>
              ))}
        </div>
      </div>
    </>
  );
};

export default Todo;
