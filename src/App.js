import React, { useState, useEffect } from "react";
import Web3 from "web3";
import "./Images/Logo2.png";
import abi from "./abi.json";


const contractAddress = "0x55Be3e1F81Fc6d5169882339EcC0Fb8460f91de1";
const tokenAddress = "0x55Be3e1F81Fc6d5169882339EcC0Fb8460f91de1";
const tokenSymbol = "CIA";
const tokenDecimal = 18;



function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [reinvest, setReinvest] = useState(false);
  const [withdrawableDividends, setWithdrawableDividends] = useState(0);
  

  useEffect(() => {
    async function connectToWeb3() {
      if (window.ethereum) {
        try {
          await window.ethereum.enable();
          const web3 = new Web3(window.ethereum);
          setWeb3(web3);
          const contract = new web3.eth.Contract(abi, contractAddress);
          setContract(contract);
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
          const balanceInWei = await contract.methods.balanceOf(accounts[0]).call();
          const balanceInEther = web3.utils.fromWei(balanceInWei, "ether");
          setBalance(balanceInEther);
          const isReinvest = await contract.methods.isReinvest(accounts[0]).call();
          setReinvest(isReinvest);
          const withdrawableDividendInWei = await contract.methods.withdrawableDividendOf(accounts[0]).call();
        const withdrawableDividendInEther = web3.utils.fromWei(withdrawableDividendInWei, "ether");
        setWithdrawableDividends(withdrawableDividendInEther);
        } catch (error) {
          console.error(error);
        }
      }
    }

    connectToWeb3();
  }, [account]);

  async function claim() {
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.claim().send({ from: accounts[0] });
    } catch (error) {
      console.error(error);
    }
  }

  async function toggleReinvest() {
    try {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.setReinvest(!reinvest).send({ from: accounts[0] });
      setReinvest(!reinvest);
    } catch (error) {
      console.error(error);
    }
  }

  async function addToken() {
    try {
      await web3.currentProvider.sendAsync({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimal,
            image: "https://example.com/token-image.png",
          },
        },
        id: Math.round(Math.random() * 100000),
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div id="wrapper">
      <div id="headerwrap">
        <div id="header">
            <img className="header__logo" src={require("./Images/Logo2.png")} />
        </div>
        </div>
        <div id="navigationwrap">
        <div id="navigation">
            <div className="toggle-container">
          <div className="toggle-text">Ethfin</div>
          <label className="toggle">
            <input
              type="checkbox"
              onChange={toggleReinvest}
              checked={reinvest}
            />
            <span className="knob"></span>
          </label>
          <div className="toggle-text">CIA</div>
        </div>
        </div>
        </div>
        <div id="contentwrap">
        <div id="content">
            <div className="flex-container">
                <div className="flex-items"><div className="account">Account</div> {account}</div>
                <div className="flex-items"> <div className="balance">Token Balance</div> {balance} CIA</div>
                <div className="flex-items">
              <div className="account">Rewards Balance</div> {withdrawableDividends} BNB
            </div>
              </div>
              
        </div>
        </div>
        <div id="footerwrap">
        <div id="footer">
            <div id="footer">
        <div className="button-container">
                <button className="button" onClick={claim}>
                  Claim
                </button>
          
                <button
                  className="button"
                  onClick={() => {
                    if (window.ethereum) {
                      try {
                        window.ethereum.request({
                          method: "wallet_watchAsset",
                          params: {
                            type: "ERC20",
                            options: {
                              address: contractAddress,
                              symbol: "CIA",
                              decimals: 18,
                              image:
                                "https://cryptoinnovation.agency/wp-content/uploads/2023/04/4-removebg-preview.png",
                            },
                          },
                        });
                      } catch (error) {
                        console.error(error);
                      }
                    }
                  }}
                >
                  Add $CIA to wallet
                </button>
              </div>
        </div>
        </div>
        </div>
    </div>
  );
}

export default App;
