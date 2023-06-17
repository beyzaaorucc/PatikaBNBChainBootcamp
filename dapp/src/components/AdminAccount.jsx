import React, { useState, useEffect } from "react";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import {
  addBook,
  getTotalPayments,
  withdrawOwnerBalance,
  setOwner,
  getOwner,
  editBookMetadata,
  editBookStatus,
} from "../Web3Client";
const web3 = new Web3();

const AdminAccount = () => {
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [rent, setRent] = useState("");
  const [sale, setSale] = useState("");
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [status, setStatus] = useState(null);
  const [newRent, setNewRent] = useState("");
  const [newSale, setNewSale] = useState("");
  const [totalPayments, setTotalPayments] = useState(null);
  const [withdrawBalance, setWithdrawBalance] = useState(null);
  const [ownerAddress, setOwnerAddress] = useState(null);
  const [currentOwner, setCurrentOwner] = useState(null);

  const convertDecimalToInteger = (decimal, decimalPlaces) => {
    const decimalString = decimal.toString();
    const decimalFactor = new BigNumber(10).exponentiatedBy(decimalPlaces);
    const integer = new BigNumber(decimalString).multipliedBy(decimalFactor);
    return integer.toFixed();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rentInWei = convertDecimalToInteger(rent, 18);
    const saleInWei = convertDecimalToInteger(sale, 18);

    let result = await addBook(name, url, rentInWei, saleInWei);
    if (result) {
      console.log("Book addition completed");
    }
    console.log(result);
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      let result = await withdrawOwnerBalance(withdrawBalance);
      if (result) {
        console.log("Withdrawn completed" + result);
      }
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  const editBookData = async (e) => {
    e.preventDefault();
    const newRentInWei = convertDecimalToInteger(newRent, 18);
    const newSaleInWei = convertDecimalToInteger(newSale, 18);
    try {
      let result = await editBookMetadata(
        id,
        newName,
        newUrl,
        newRentInWei,
        newSaleInWei
      );
      if (result) {
        console.log("Book editing completed" + result);
      }
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  const editBookStatusData = async (e) => {
    e.preventDefault();
    try {
      let result = await editBookStatus(id, status);
      if (result) {
        console.log("Book status editing completed" + result);
      }
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSetOwner = async (e) => {
    e.preventDefault();
    try {
      let result = await setOwner(ownerAddress);
      if (result) {
        console.log("Owner setting completed" + result);
      }
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const fetchInfo = async () => {
      const owner = await getOwner();
      const totalEarnings = await getTotalPayments();
      console.log(totalEarnings);
      setTotalPayments(totalEarnings);
      setCurrentOwner(owner);
    };
    fetchInfo();
  }, []);

  return (
	<div className="admin-account">
    <h2>Admin Account</h2>

    <div className="add-book-section">
      <h3>Add Book</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Book ID:</label>
          <input type="number" value={id} onChange={(e) => setId(e.target.value)} />
        </div>
        <div>
          <label>Book Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Image URL:</label>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <div>
          <label>Rent Price:</label>
          <input type="text" value={rent} onChange={(e) => setRent(e.target.value)} />
        </div>
        <div>
          <label>Sale Price:</label>
          <input type="text" value={sale} onChange={(e) => setSale(e.target.value)} />
        </div>
        <button type="submit">Add Book</button>
      </form>
    </div>

    <div className="withdraw-section">
      <h3>Withdraw Owner Balance</h3>
      <form onSubmit={handleWithdraw}>
        <div>
          <label>Withdraw Amount:</label>
          <input type="text" value={withdrawBalance} onChange={(e) => setWithdrawBalance(e.target.value)} />
        </div>
        <button type="submit">Withdraw</button>
      </form>
    </div>

    <div className="edit-book-section">
      <h3>Edit Book Metadata</h3>
      <form onSubmit={editBookData}>
        <div>
          <label>Book ID:</label>
          <input type="number" value={id} onChange={(e) => setId(e.target.value)} />
        </div>
        <div>
          <label>New Book Name:</label>
          <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          <label>New Image URL:</label>
          <input type="text" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
        </div>
        <div>
          <label>New Rent Price:</label>
          <input type="text" value={newRent} onChange={(e) => setNewRent(e.target.value)} />
        </div>
        <div>
          <label>New Sale Price:</label>
          <input type="text" value={newSale} onChange={(e) => setNewSale(e.target.value)} />
        </div>
        <button type="submit">Edit Metadata</button>
      </form>
    </div>

    <div className="edit-status-section">
      <h3>Edit Book Status</h3>
      <form onSubmit={editBookStatusData}>
        <div>
          <label>Book ID:</label>
          <input type="number" value={id} onChange={(e) => setId(e.target.value)} />
        </div>
        <div>
          <label>New Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value={null}>Select Status</option>
            <option value={0}>Available</option>
            <option value={1}>Rented</option>
            <option value={2}>Sold</option>
          </select>
        </div>
        <button type="submit">Edit Status</button>
      </form>
    </div>

    <div className="set-owner-section">
      <h3>Set Owner</h3>
      <form onSubmit={handleSetOwner}>
        <div>
          <label>New Owner Address:</label>
          <input type="text" value={ownerAddress} onChange={(e) => setOwnerAddress(e.target.value)} />
        </div>
        <button type="submit">Set Owner</button>
      </form>
    </div>

    <div className="owner-info-section">
      <h3>Owner Information</h3>
      <div>
        <strong>Current Owner:</strong> {currentOwner}
      </div>
      <div>
        <strong>Total Payments:</strong> {totalPayments}
      </div>
    </div>
  </div>
  
  );
};

export default AdminAccount;