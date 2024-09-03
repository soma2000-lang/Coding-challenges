const chai = require("chai");
const { expect } = chai;
const chaiHttp = require("chai-http");

const app = require("../../server");
const authService = require("../../services/authService");
const addUser = require("../utils/addUser");
const cleanDb = require("../utils/cleanDb");

const { createNewAuction } = require("../../models/auctions");
const { createWallet } = require("../../models/wallets");

// Import fixtures
const userData = require("../fixtures/user/user")();
const { auctionData, auctionKeys, auctionWithIdKeys } = require("../fixtures/auctions/auctions");
const { initial_price: initialPrice, item_type: itemType, end_time: endTime, quantity } = auctionData;
const currencyDataArray = require("../fixtures/currencies/currencies");
const currenciesData = currencyDataArray.default;


const config = require("config");
const cookieName = config.get("userToken.cookieName");

chai.use(chaiHttp);