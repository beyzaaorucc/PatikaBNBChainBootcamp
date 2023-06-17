import { useState, useEffect } from "react";
import BookStand from "./components/BookStand";
import Header from "./components/Header";
import Information from "./components/Information";
import AdminAccount from "./components/AdminAccount";
import Web3 from "web3";
const web3 = new Web3();
import {
  getUserAddress,
  register,
  getBookByStatus,
  getBook,
  getOwner,
  login,
} from "./Web3Client";
function App() {
  const [address, setAddress] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [book, setBook] = useState([]);
  const [name, setName] = useState({});
  const [lastName, setLastName] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [userCredit, setUserCredit] = useState("0");
  const [due, setDue] = useState(0);
  const [isAvailable, setIsAvailable] = useState("You can rent a house");
  const [rideMins, setRideMins] = useState("0");

  const emptyAddress = "0x0000000000000000000000000000000000000000";

  useEffect(() => {
    let handleInit = async () => {
      let isAUser = await login();
      if (isAUser?.address !== emptyAddress) {
        if (isAUser?.name) {
          setLoggedIn(true);
          setUserCredit(web3.utils.fromWei(isAUser[4], "ether"));
        }
        setUserName(isAUser?.name);
        setLastName(isAUser[2]);
        setAddress(isAUser?.walletAddress);
        let userDue = Web3.utils.fromWei(isAUser.debt, "ether");
        setDue(Number(userDue));

        let address = await getUserAddress();
        let owner = await getOwner();
        if (address === owner.toLowerCase()) {
          setIsAdmin(true);
        }
        // get books
        let bookArray = [];
        let bookByStatus = await getBookByStatus(2);
        bookArray.push(...bookByStatus);
        if (isAUser.rentedBookId !== "0") {
          let rentedBook = await getBook(Number(isAUser.rentedBookId));
          bookArray.push(rentedBook);
        }
        setBook(bookArray);

        if (isAUser.rentedBookId !== "0") {
          let rentedBook = await getBook(Number(isAUser.rentedBookId));
          setIsAvailable(`Rented: ${rentedBook.name} - Id :${rentedBook.id}`);
        }

        let rideMins = "0";
        if (isAUser.rentedBookId !== "0") {
          rideMins = Math.floor(
            Math.floor(Date.now() / 1000 - isAUser.start) / 60
          ).toString();
        }
        setRideMins(rideMins);
      }
    };
    handleInit();
  }, []);
  const handleNameChange = async (e) => {
    setName(e.target.value);
  };

  const handleLastNameChange = async (e) => {
    setLastName(e.target.value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      let res = await register(name, lastName);
      if (res) {
        setLoggedIn(true);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (due !== 0) {
      setIsAvailable("You have to pay your debt");
    }
  }, [due]);

  return (
      <div className="container">
        <Header name={userName} lastName={lastName} address={address} />
    
        {loggedIn ? (
          <div className="book-stand">
            {book.map((book) => (
              <BookStand key={book.id}
              name={book.name}
              id={book.id}
              image={book.imgUrl}
              saleFee={book.saleFee}
              rentFee={book.rentFee}
              bookStatus={book.status}
              due={due} />
            ))}
          </div>
        ) : (
          <div className="information">
            <Information userCredit={userCredit}
              due={due}
              rideMins={rideMins}
              isAvailable={isAvailable}/>
          </div>
        )}
    
        {isAdmin && (
          <div className="admin-account">
            <AdminAccount />
          </div>
        )}
    
        {loggedIn ? (
          <div className="user-info">
            <div>
              <strong>User Name:</strong> {userName} {lastName}
            </div>
            <div>
              <strong>User Address:</strong> {address}
            </div>
            <div>
              <strong>User Credit:</strong> {userCredit}
            </div>
            <div>
              <strong>Due Amount:</strong> {due}
            </div>
            <div>
              <strong>Ride Minutes:</strong> {rideMins}
            </div>
            <div className="available">{isAvailable}</div>
          </div>
        ) : (
          <form className="register-form" onSubmit={handleRegister}>
            <div className="register-input">
              <label>
                Name:
                <input type="text" value={name} onChange={handleNameChange} />
              </label>
            </div>
            <div className="register-input">
              <label>
                Last Name:
                <input type="text" value={lastName} onChange={handleLastNameChange} />
              </label>
            </div>
            <button className="btn" type="submit">Register</button>
          </form>
        )}
      </div>
    );
}

export default App;
