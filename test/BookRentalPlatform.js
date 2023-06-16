const BookRentalPlatform = artifacts.require("BookRentalPlatform");

contract("BookRentalPlatform", (accounts) => {
  let bookRentalPlatform;
  const owner = accounts[0];
  const user1 = accounts[1];

  beforeEach(async () => {
    bookRentalPlatform = await BookRentalPlatform.new();
  });

  describe("Add user and book", () => {
    it("adds a new user", async () => {
      await bookRentalPlatform.addUser("Beyza", "Oruc", { from: user1 });
      const user = await bookRentalPlatform.getUser(user1);
      assert.equal(user.name, "Beyza", "Problem with user name");
      assert.equal(user.lastname, "Oruc", "Problem with user lastname");
    });

    it("adds a book", async () => {
      await bookRentalPlatform.addBook(
        "Nutuk - M.Kemal Atatürk",
        "example url",
        30,
        50,
        { from: owner }
      );
      const book = await bookRentalPlatform.getBook(1);
      assert.equal(
        book.name,
        "Nutuk - M.Kemal Atatürk",
        "Problem with book name"
      );
      assert.equal(book.imgUrl, "example url", "Problem with img url");
      assert.equal(book.rentFee, 20, "Problem with rent fee");
      assert.equal(book.saleFee, 50, "Problem with sale fee");
    });
  });

  describe("Check out and check in book", () => {
    it("Check out a book", async () => {
      await bookRentalPlatform.addUser("Beyza", "Oruc", { from: user1 });
      await bookRentalPlatform.addBook(
        "Nutuk - M.Kemal Atatürk",
        "example url",
        30,
        50,
        { from: owner }
      );
      await bookRentalPlatform.checkOut(1, { from: user1 });

      const user = await bookRentalPlatform.getUser(user1);
      assert.equal(user.rentedBookId, 1, "User could not check out the book");
    });

    it("checks in a book", async () => {
      await bookRentalPlatform.addUser("Beyza", "Oruc", { from: user1 });
      await bookRentalPlatform.addBook(
        "Nutuk - M.Kemal Atatürk",
        "example url",
        30,
        50,
        { from: owner }
      );
      await bookRentalPlatform.checkOut(1, { from: user1 });
      await new Promise((resolve) => setTimeout(resolve, 60000)); // 1 minute

      await bookRentalPlatform.chechIn({ from: user1 });

      const user = await bookRentalPlatform.getUser(user1);

      assert.equal(user.rentedBookId, 0, "User could not check in the book");
      assert.equal(user.debt, 10, "User debt did not get treated");
    });
  });

  describe("Deposit token and make payment", () => {
    it("deposits token", async () => {
      await bookRentalPlatform.addUser("Beyza", "Oruc", { from: user1 });
      await bookRentalPlatform.deposit({ from: user1, value: 10 });
      const user = await bookRentalPlatform.getUser(user1);
      assert.equal(user.balance, 10, "User could not deposit tokens");
    });

    it("makes a payment", async () => {
      await bookRentalPlatform.addUser("Beyza", "Oruc", { from: user1 });
      await bookRentalPlatform.addBook(
        "Nutuk - M.Kemal Atatürk",
        "example url",
        30,
        50,
        { from: owner }
      );
      await bookRentalPlatform.checkOut(1, { from: user1 });
      await new Promise((resolve) => setTimeout(resolve, 60000)); // 1 minute
      await bookRentalPlatform.chechIn({ from: user1 });

      await bookRentalPlatform.deposit({ from: user1, value: 10 });
      await bookRentalPlatform.makePayment({ from: user1 });
      const user = await bookRentalPlatform.getUser(user1);

      assert.equal(
        user.debt,
        0,
        "Something went wrong while trying to make the payment"
      );
    });
  });

  describe("edit book", () => {
    it("should edit an existing book's metadata with valid parameters", async () => {
      await bookRentalPlatform.addBook(
        "Nutuk - M.Kemal Atatürk",
        "example url",
        30,
        50,
        { from: owner }
      );

      const newName = "İntibah - Namik Kemal";
      const newImgUrl = "new img url";
      const newRentFee = 20;
      const newSaleFee = 40;
      await bookRentalPlatform.editBookMetadata(
        1,
        newName,
        newImgUrl,
        newRentFee,
        newSaleFee,
        { from: owner }
      );

      const book = await bookRentalPlatform.getBook(1);
      assert.equal(book.name, newName, "Problem editing book name");
      assert.equal(book.imgUrl, newImgUrl, "Problem updating the img url");
      assert.equal(book.rentFee, newRentFee, "Problem editing rent fee");
      assert.equal(book.saleFee, newSaleFee, "Problem editing sale fee");
    });

    it("should edit an existing book's status", async () => {
      await bookRentalPlatform.addBook(
        "Nutuk - M.Kemal Atatürk",
        "example url",
        30,
        50,
        { from: owner }
      );
      const newStatus = 0;
      await bookRentalPlatform.editBookStatus(1, newStatus, { from: owner });
      const book = await bookRentalPlatform.getBook(1);
      assert.equal(book.status, newStatus, "Problem with editing book status");
    });
  });

  describe("Withdraw balance", () => {
    it("should send the desired amount of tokens to the user", async () => {
      await bookRentalPlatform.addUser("Beyza", "Oruc", { from: user1 });
      await bookRentalPlatform.deposit({ from: user1, value: 10 });
      await bookRentalPlatform.withdrawBalance(5, { from: user1 });

      const user = await bookRentalPlatform.getUser(user1);
      assert.equal(user.balance, 5, "User could not get his/her tokens");
    });

    it("should send the desired amount of tokens to the owner", async () => {
      await bookRentalPlatform.addUser("Beyza", "Oruc", { from: user1 });
      await bookRentalPlatform.addBook(
        "Nutuk - M.Kemal Atatürk",
        "example url",
        30,
        50,
        { from: owner }
      );
      await bookRentalPlatform.checkOut(1, { from: user1 });
      await new Promise((resolve) => setTimeout(resolve, 60000)); // 1 minute
      await bookRentalPlatform.chechIn({ from: user1 });
      await bookRentalPlatform.deposit({ from: user1, value: 100 });
      await bookRentalPlatform.makePayment({ from: user1 });

      const totalPaymentAmount = await bookRentalPlatform.getTotalPayments({
        from: owner,
      });
      const amountToWithdraw = totalPaymentAmount - 5;
      await bookRentalPlatform.withdrawOwnerBalance(amountToWithdraw, {
        from: owner,
      });
      const totalPayment = await bookRentalPlatform.getTotalPayments({
        from: owner,
      });
      assert.equal(totalPayment, 5, "Owner could not withdraw tokens");
    });
  });
});
