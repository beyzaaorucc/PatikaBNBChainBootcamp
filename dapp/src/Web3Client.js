import Web3 from "web3";
import RenterABI from "./ABI/BookRentalPlatform.json"; 

let selectedAccount;
let renterContract;
let isİnitialized = false;
let renterContractAddress = "0x00FC7A92ED74e9bcAF60490fC42369C35DD2Ff6C";

export const init = async () =>{
    //Configure contract
    let provider = window.ethereum;

    if (typeof provider !== "undefined") {
        provider
            .request({method:"eth_requestAccounts"})
            .then((accounts) => {
                selectedAccount = accounts[0];
            })
            .catch((err) => {
                //console.log(err);
                return;
            });
    }

    window.ethereum.on("accountChanged", function (accounts) {
        selectedAccount = accounts[0];
    });

    const web3 = new Web3(provider);

    const networkId = await web3.eth.net.getId();

    renterContract = new web3.eth.Contract(RenterABI.abi, renterContractAddress);

    isİnitialized = true;
};

export const getUserAddress = async () => {
    if (!isİnitialized) {
        await init();
    }
    return selectedAccount;
};

//execute functıons

export const setOwner = async (newOwner) => {
    if (!isİnitialized) {
        await init();
    }
    try {
        let res = await renterContract.methods
        .setOwner(newOwner.toLowerCase())
        .send({ from: selectedAccount });
        return res;
    } catch (e) {
        console.error(e);
    }
};

export const register = async (name, surname) => {
    if (!isİnitialized) {
        await init();
    }
    try {
        let res = await renterContract.methods
        .addUser(name, surname)
        .send({ from: selectedAccount });
        return res;
    } catch (e) {
        console.error(e);
    }
};

export const addBook = async (name, url, rentFee, saleFee) => {
    if (!isİnitialized) {
        await init();
    }
    try {
        let res = await renterContract.methods
        .addBook(name, url, rentFee, saleFee)
        .send({ from: selectedAccount });
        return res;
    } catch (e) {
        console.error(e);
    }
};

export const editBookMetadata = async (id, name, imgUrl, rentFee, saleFee) => {
    if (!isİnitialized) {
        await init();
    }
    try {
        let res = await renterContract.methods
        .editBookMetadata(id, name, imgUrl, rentFee, saleFee)
        .send({ from: selectedAccount });
        return res;
    } catch (e) {
        console.error(e);
    }
}

export const editBookStatus = async (id, status) => {
    if (!isİnitialized) {
        await init();
    }
    try {
        let res = await renterContract.methods
        .editBookStatus(id, status)
        .send({ from: selectedAccount });
        return res;
    } catch (e) {
        console.error(e);
    }
}

export const checkOut = async (id) => {
    if (!isİnitialized) {
        await init();
    }
    try {
        let res = await renterContract.methods
        .checkOut(id)
        .send({ from: selectedAccount });
        return res;
    } catch (e) {
        console.error(e);
    }
};

export const checkIn = async () => {
    if (!isİnitialized) {
        await init();
    }
    try {
        let res = await renterContract.methods
        .checkIn()
        .send({ from: selectedAccount });
        return res;
    } catch (e) {
        console.error(e);
    }
};

export const deposit = async (value) => {
    if (!isİnitialized) {
        await init();
    }
    let send_value = Web3.utils.toWei(value, "ether");
    try {
        let res = await renterContract.methods
        .deposit()
        .send({ from: selectedAccount, value: send_value});
        return res;
    }catch(e) {
        console.error(e);
    }
};

export const makePayment = async () => {
    if (!isİnitialized) {
        await init();
    }
    try {
        let res = await renterContract.methods
        .makePayment()
        .send({ from: selectedAccount });
        return res;
    } catch (e) {
        console.error(e);
    }
};

export const withdrawBalance = async (value) => {
    if (!isİnitialized) {
        await init();
    }
    let send_value = Web3.utils.toWei(value, "ether");
    try {
        let res = await renterContract.methods
        .withdrawBalance(send_value)
        .send({ from: selectedAccount });
        return res;
    }catch(e) {
        console.error(e);
    } 
};

export const withdrawOwnerBalance = async (value) => {
    if (!isİnitialized) {
        await init();
    }
    let send_value = Web3.utils.toWei(value, "ether");
    try {
        let res = await renterContract.methods
        .withdrawOwnerBalance(send_value)
        .send({ from: selectedAccount });
        return res;
    }catch(e) {
        console.error(e);
    } 
};

// query functions

export const getOwner = async () => {
    if (!isİnitialized) {
        await init();
    }
    try {
        let res = await renterContract.methods.getOwner().call();
        return res.toString();
    } catch (e) {
        console.error(e);
    } 
};

export const login = async () => {
    if (!isİnitialized) {
        await init();
    }
    try {
        let res = await renterContract.methods.getUser(selectedAccount).call();
        return res;
    } catch (e) {
        console.error(e);
    }
};

export const getBook = async (id) => {
    if (!isİnitialized) {
        await init();
    }
    try {
        let res = await renterContract.methods.getBook(id).call();
        return res;
    } catch (e) {
        console.error(e);
    }
};

export const getBooksByStatus = async (status) => {
    if (!isİnitialized) {
        await init();
    }
    try {
        let res = await renterContract.methods.getBooksByStatus(status).call();
        return res;
    } catch (e) {
        console.error(e);
    }
};

export const getCurrentCount = async () => {
    if (!isİnitialized) {
        await init();
    }
    try {
        let res = await renterContract.methods.getCurrentCount().call();
        return res;
    } catch (e) {
        console.error(e);
    }
};

export const getContractBalance = async () => {
    if (!isİnitialized) {
        await init();
    }
    try {
        let res = await renterContract.methods.getContractBalance().call({ from: selectedAccount});
        return res;
    } catch (e) {
        console.error(e);
    }
};

export const getTotalPayments = async () => {
    if (!isİnitialized) {
        await init();
    }
    try {
        let res = await renterContract.methods.getTotalPayments().call({ from: selectedAccount});
        return res;
    } catch (e) {
        console.error(e);
    }
};
