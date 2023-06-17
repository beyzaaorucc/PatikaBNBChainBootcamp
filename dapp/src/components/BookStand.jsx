import React from "react";
import { checkOut, CheckIn } from "../Web3Client";
import Web3 from "web3";

const BookStand = ({ name, id, image, saleFee, rentFee, bookStatus, due }) => {
  const handleCheckOut = async () => {
    const res = await checkOut(id);
    console.log(res);
  };

  console.log(due);

  const handleCheckIn = async () => {
    await CheckIn(id);
  };

	return (
  <div className="book-stand">
    <img src={image} alt={name} />
    <h3>{name}</h3>
    <p>Book ID: {id}</p>
    <p>Sale Fee: {saleFee}</p>
    <p>Rent Fee: {rentFee}</p>

    {bookStatus === 0 && (
      <button onClick={handleCheckOut}>Check Out</button>
    )}

    {bookStatus === 1 && (
      <>
        <p>Due: {due}</p>
        <button onClick={handleCheckIn}>Check In</button>
      </>
    )}
  </div>
   );

};

export default BookStand;