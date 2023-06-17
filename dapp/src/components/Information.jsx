import React, { useState, useEffect } from "react";
import Web3 from "web3";

import { deposit, makePayment, withdrawBalance } from "../Web3Client";
const web3 = new Web3();

const Information = ({ userCredit, rideMins, due, isAvailable }) => {
  const [amount, setAmount] = useState(0);

  const makeDeposit = async () => {
    const amountInWei = web3.utils.toWei(amount);
    const res = await deposit(amount);
    console.log(amountInWei);
  };

  const payDue = async () => {
    try {
      let res = await makePayment();
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  const withdraw = async () => {
    try {
      let res = await withdrawBalance(amount);
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

   return ( 
    <div className="information">
    <h2>User Information</h2>
    <div className="credit-info">
      <p>Credit: {userCredit}</p>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <button onClick={makeDeposit}>Deposit</button>
    </div>

    <div className="rent-info">
      <p>Ride Minutes: {rideMins}</p>
      {due > 0 && <p>Due: {due}</p>}
      {isAvailable && <p>{isAvailable}</p>}
      {due > 0 && <button onClick={payDue}>Pay Due</button>}
    </div>

    <div className="withdraw-info">
      <p>Withdraw Balance</p>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <button onClick={withdraw}>Withdraw</button>
    </div>
  </div>
  );
};

export default Information;
