// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract BookRentalPlatform is ReentrancyGuard {
     // DATA
     // Counter 
     using Counters for Counters.Counter;
     Counters.Counter private _counter;


     // Owner 
     address private owner;


     // totalPayments
     uint private totalPayments;


     // user struct
     struct User{
          address walletAddress;
          string name;
          string lastname;
          uint rentedBookId;
          uint balance;
          uint debt;
          uint start;

     }


     // book struct
     struct Book{
          uint id;
          string name;
          string imgUrl;
          Status status;
          uint rentFee;
          uint saleFee;


     }


     // enum to indicate status of the book
     enum Status{
          Retired,
          InUse,
          Available

     }


     // events
     event BookAdded(uint indexed id,string name,string imgUrl,uint rentFee,uint saleFee);
     event BookMetadataEdited(uint indexed id,string name,string imgUrl,uint rentFee,uint saleFee);
     event BookStatusEdited(uint indexed id,Status status);
     event UserAdded(address walletAddress,string name,string lastname);
     event Deposit(address indexed walletAddress,uint amount);
     event CheckOut(address indexed walletAddress,uint indexed bookId);
     event CheckIn(address indexed walletAddress,uint indexed bookId);
     event PaymentMade(address indexed walletAddress,uint amount);
     event BalanceWithdrawn(address indexed walletAddress,uint amount);


     // user mapping  
     mapping(address => User) private users;


     // book mapping 
     mapping(uint => Book) private books;


     // constructor 
     constructor() {
          owner = msg.sender;
          totalPayments = 0;
     }
     

     // MODIFIERS
     // onlyOwner 
     modifier onlyOwner() {
          require(msg.sender == owner,"Only the owner can call this function");
          _;
     }


     // FUNCTIONS 
     // Execute Function 


     // setOwner #onlyOwner
     function setOwner(address _newOwner) external onlyOwner{
          owner = _newOwner;
     }


     // addUser #nonExisting
     function addUser(string calldata name, string calldata lastname) external {
          require(!isUser(msg.sender),"User already exists");
          users[msg.sender] = User(msg.sender, name, lastname, 0, 0, 0, 0);

          emit UserAdded(msg.sender, users[msg.sender].name, users[msg.sender].lastname);
     }


     // addBook #onlyOwner #nonExistingBook
     function addBook(string calldata name, string calldata url, uint rent, uint sale) external onlyOwner{
          _counter.increment();
          uint counter = _counter.current();
          books[counter] = Book(counter, name, url, Status.Available, rent, sale);

          emit BookAdded(counter, books[counter].name, books[counter].imgUrl, books[counter].rentFee, books[counter].saleFee);
     }


     // editBookMetadata #onlyOwner #existingBook 
     function editBookMetadata(uint id, string calldata name, string calldata imgUrl, uint rentFee, uint saleFee) external onlyOwner{
          require(books[id].id != 0,"Book with given ID does not exists");
          Book storage book = books[id];
          if(bytes(name).length != 0){
               book.name = name;
          }
          if(bytes(imgUrl).length != 0){
               book.imgUrl = imgUrl;
          }
          if( rentFee > 0){
               book.rentFee = rentFee;
          }
          if( saleFee > 0){
               book.saleFee = saleFee;
          }

          emit BookMetadataEdited(id, book.name, book.imgUrl, book.rentFee, book.saleFee);

     }


     //editBookStatus #onlyOwner #existingBook
     function editBookStatus(uint id, Status status) external onlyOwner{
          require(books[id].id != 0, "Book with given id does not exist");
          books[id].status = status;

          emit BookStatusEdited(id, status);
     }


     // checkOut #existingUser #isBagAvaliable #userHasNotRentedABook #userHasNoDebt
     function checkOut(uint id) external {
          require(isUser(msg.sender), "User does not exist!");
          require(books[id].status == Status.Available, "Book is not Available for use");
          require(users[msg.sender].rentedBookId == 0, "User has already rented a book");
          require(users[msg.sender].debt == 0, "User has an outstanding debt!");

          users[msg.sender].start = block.timestamp;
          users[msg.sender].rentedBookId = id;
          books[id].status = Status.InUse;

          emit CheckOut(msg.sender, id);
     }


     // chechIn #existingUser #userHasRentedABook 
     function checkIn() external {
          require(isUser(msg.sender), "User does not exists!");
          uint rentedBookId = users[msg.sender].rentedBookId;
          require(rentedBookId != 0, "User has not rented a book");

          uint usedSeconds = block.timestamp - users[msg.sender].start;
          uint rentFee = books[rentedBookId].rentFee;
          users[msg.sender].debt += calculateDebt(usedSeconds, rentFee);

          users[msg.sender].rentedBookId = 0;
          users[msg.sender].start = 0;
          books[rentedBookId].status = Status.Available;

          emit CheckIn(msg.sender, rentedBookId);
     }
     

     // deposit #existingUser 
     function deposit() external payable{
          require(isUser(msg.sender), "User does not exist");
          users[msg.sender].balance += msg.value;

          emit Deposit(msg.sender, msg.value);
     }


     // makePayment #existingUser #existingDebt #suffiecientBalance
     function makePayment() external {
          require(isUser(msg.sender), "User does not exist");
          uint debt = users[msg.sender].debt;
          uint balance = users[msg.sender].balance;

          require(debt > 0, "User has no debt to pay");
          require(balance >= debt, "User has insufficient balance");

          unchecked {
               users[msg.sender].balance -= debt;
          }
          totalPayments += debt;
          users[msg.sender].debt = 0;

          emit PaymentMade(msg.sender, debt);
     }


     // withdrawBalance #existingUser
     function withdrawBalance(uint amount) external nonReentrant {
          require(isUser(msg.sender), "User does not exist");
          uint balance = users[msg.sender].balance;
          require(balance >= amount, "Insufficient balance to withdraw");

          unchecked {
               users[msg.sender].balance -= amount;
          }

          (bool success, ) = msg.sender.call{value: amount}("");
          require(success, "Transfer failed");

          emit BalanceWithdrawn(msg.sender, amount);
     }


     // withdrawOwnerBalance #onlyOwner 
     function withdrawOwnerBalance(uint amount) external onlyOwner {
          require(totalPayments >= amount, "Insufficient contract balance to withdraw");

          (bool success, ) = owner.call{value: amount}("");
          require(success, "Transfer failed");

          unchecked {
               totalPayments -= amount;
          }
     }


     // Query Functions 
     // getOwner 
     function getOwner() external view returns(address){
          return owner;
     }


     // isUser
     function isUser(address walletAddress) private view returns(bool){
          return users[walletAddress].walletAddress != address(0);
     }


     // getUser #existingUser
     function getUser(address walletAddress) external view returns(User memory){
          require(isUser(walletAddress), "User does not exist");
          return users[walletAddress];
     }


     // getBook #existingBook 
     function getBook(uint id) external view returns(Book memory){
          require(books[id].id != 0, "Book does not exist");
          return books[id];
     }


     // getBookByStatus
     function getBookByStatus(Status _status) external view returns(Book[] memory){
          uint count = 0;
          uint lenght = _counter.current();
          for(uint i = 1;i <= lenght; i++ ){
               if(books[i].status == _status){
                    count ++;
               }
          }
          Book[] memory booksWithStatus = new Book[](count);
          count = 0;
          for (uint i = 1; i <=  lenght; i++) {
               if(books[i].status == _status){
                    booksWithStatus[count] = books[i];
                    count ++;
               }
               
          }
          return booksWithStatus;
     }


     // calculateDebt
     function calculateDebt(uint usedSeconds,uint rentFee) private pure returns(uint){
          uint usedMinutes = usedSeconds / 60;
          return usedMinutes * rentFee;
     } 


     // getCurrentCount
     function getCurrentCount() external view returns(uint){
          return _counter.current();
     }


     // getContractBalance #onlyOwner
     function getContractBalance() external view onlyOwner returns(uint){
          return address(this).balance;
     }


     // getTotalPayments #onlyOwner  
     function getTotalPayments() external view onlyOwner returns(uint){
          return totalPayments;
     }

}
