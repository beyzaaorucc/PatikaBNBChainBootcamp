import React from "react";

const Header = ({ name, lastName, address }) => {
  let stringName = null;
  let stringLastName = null;
  let stringAddress = JSON.stringify(address, null, 2);
  let firstThree = stringAddress.slice(0, 6);
  let lastFour = stringAddress.slice(-5);

  if (name) {
    stringName = JSON.stringify(name, null, 2);
  }
  if (lastName) {
    stringLastName = JSON.stringify(lastName, null, 2);
  }

  return (
    <header
      aria-label="Header"
      className="bg-gradient-to-r from-slate-700 via-blue-900 to-black"
    >
      <div className="mx-auto cursor-default max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl text-white  font-bold  sm:text-3xl">
              Welcome{" "}
              {stringName ? (
                <span>
                  {stringName.replace(/"/g, "")}{" "}
                  {stringLastName.replace(/"/g, "")}
                </span>
              ) : (
                <span></span>
              )}
            </h1>

            <p className="mt-1.5  text-sm text-white ">
              {stringName ? (
                <span>The world of books you are looking for is here</span>
              ) : (
                <span className="text-[25px]">
                  Please login to step into the world of books 
                </span>
              )}
            </p>
          </div>

          <h1 className="border border-black p-4 text-white bg-green-500 rounded-2xl">
            {name ? (
              <span>
                Welcome, {stringName.replace(/"/g, "")} <br />
                {address ? (
                  <span>Your Wallet Address{firstThree + "..." + lastFour}</span>
                ) : (
                  <span></span>
                )}
              </span>
            ) : (
              <span> Login Your Wallet</span> 
            )}
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;