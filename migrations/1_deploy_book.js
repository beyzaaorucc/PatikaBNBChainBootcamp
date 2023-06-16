const BookRentalPlatform = artifacts.require("BookRentalPlatform");

module.exports = async function (deployer) {
  await deployer.deploy(BookRentalPlatform);
  const instance = await BookRentalPlatform.deployed();
  const BookRentalPlatformAddress = instance.address;

  console.log("BookRentalPlatform Address:", BookRentalPlatformAddress);
};