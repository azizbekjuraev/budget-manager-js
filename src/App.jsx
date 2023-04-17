import React, { useState, useEffect } from "react";
import "./App.css";
import { nanoid } from "nanoid";

import { ExpenseList } from "./components/ExpenseList";
import { ExpenseForm } from "./components/ExpenseForm";
import { Alert } from "./components/Alert";

const initialExpenses = localStorage.getItem("expenses")
  ? JSON.parse(localStorage.getItem("expenses"))
  : [];

function App() {
  // state values
  // all expenses, add expense
  const [expenses, setExpenses] = useState(initialExpenses);

  // single expense
  const [charge, setCharge] = useState(" ");

  // single amount
  const [amount, setAmount] = useState(" ");

  // alert
  const [alert, setAlert] = useState({ show: false });

  // edit
  const [edit, setEdit] = useState(false);

  //edit item
  const [id, setId] = useState(0);

  // useEffect
  useEffect(() => {
    console.log(`we called use effect`);
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]); // calling useEffect when expenses value changes

  // functionality
  //handle charge
  const handleCharge = (e) => {
    setCharge(e.target.value);
  };

  // handle amount
  const handleAmount = (e) => {
    setAmount(e.target.value);
  };

  // handle alert
  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });

    setTimeout(() => {
      setAlert({ show: false });
    }, 3000);
  };

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (charge !== "" && amount > 0) {
      if (edit) {
        let tempExpenses = expenses.map((item) => {
          return item.id === id ? { ...item, charge, amount } : item;
        });
        setExpenses(tempExpenses);
        setEdit(false);
        handleAlert({ type: "success", text: "item edited successfully!" });
      } else {
        const singleExpense = { id: nanoid(), charge, amount };
        setExpenses([...expenses, singleExpense]);
        handleAlert({ type: "success", text: "item added" });
      }
      setCharge("");
      setAmount("");
    } else {
      // Handle Alert Called
      handleAlert({ type: "danger", text: "fill in the all inputs" });
    }
  };

  // Clear all items
  const clearItems = () => {
    setExpenses([]);
    handleAlert({ type: "danger", text: "all items deleted" });
  };

  // handle delete
  const handleDelete = (id) => {
    console.log(`item deleted ${id}`);
    let tempExpenses = expenses.filter((item) => item.id !== id);
    setExpenses(tempExpenses);
    handleAlert({ type: "danger", text: "item deleted" });
  };

  // handle edit
  const handleEdit = (id) => {
    let expense = expenses.find((item) => item.id === id);
    let { charge, amount } = expense; //distructing properties from obj
    setAmount(amount);
    setCharge(charge);
    setEdit(true);
    setId(id);
    console.log(expense);
  };

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <h1>budget calculator</h1>
      <main className="App">
        <ExpenseForm
          charge={charge}
          amount={amount}
          handleAmount={handleAmount}
          handleCharge={handleCharge}
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList
          expenses={expenses}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          clearItems={clearItems}
        />
      </main>
      <h1>
        total spending :{" "}
        <span className="total">
          $
          {expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount));
          }, 0)}
        </span>
      </h1>
    </>
  );
}

export default App;
