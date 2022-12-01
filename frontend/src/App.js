import React, { useEffect, useState } from "react";
import abi from "./utils/CheckInPortal.json"
import {ethers} from "ethers";
import "./App.css";

const getEthereumObject = () => window.ethereum;

const findMetaMaskAccount = async () => {
  try {
    const ethereum = getEthereumObject();
    if (!ethereum) {
      console.error("Make sure you have Metamask!");
      return null;
    }

    console.log("We have the Ethereum object", ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    } else {
      console.error("No authorized account found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [checkInsList, setCheckInsList] = useState([]);
  const contractAddress = "0x54F2c5B40Cb4B273479ca2DA0dC0874b40b5ED16";
  const contractABI = abi.abi;

  const getAllCheckIns = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const checkInPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        const checkIns = await checkInPortalContract.getCheckInsList();
        let processedCheckIns = [];
        checkIns.forEach(checkIn => {
          processedCheckIns.push({
            address: checkIn.person,
            timestamp: new Date(checkIn.timestamp * 1000)
          });
        });
        setCheckInsList(processedCheckIns);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let checkInPortalContract;

    const onNewCheckIn = (from, timestamp) => {
      console.log("New Check-in:", from, timestamp);
      setCheckInsList(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000)
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      checkInPortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      checkInPortalContract.on("NewCheckIn", onNewCheckIn);
    }

    return () => {
      if (checkInPortalContract) {
        checkInPortalContract.off("NewCheckIn", onNewCheckIn);
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const checkIn = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const checkInPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await checkInPortalContract.getTotalCheckIns();
        console.log("Retrieved total check-ins count...", count.toNumber());
        const waveTxn = await checkInPortalContract.checkIn({gasLimit:300000});
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await checkInPortalContract.getTotalCheckIns();
        console.log("Retrieved total check-ins count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function verifyIfAuthorized(){
      return await findMetaMaskAccount();
    }
    verifyIfAuthorized().then(account => {
      if (account != null) {
        setCurrentAccount(account);
        getAllCheckIns();
      }
    })
  }, []);

  return (
      <div className="mainContainer">
        <div className="dataContainer">
          <div className="header">
            🔒 Hey there!
          </div>
          <div className="bio">
            This is Check-in Portal, a place where people check-in using their Ethereum wallets (Metamask, Enkrypt)
          </div>
          <button className="waveButton" onClick={checkIn}>
            Check-in
          </button>
          {!currentAccount && (
              <button className="waveButton" onClick={connectWallet}>
                Connect Wallet
              </button>
          )}
          {checkInsList.map((checkIn, index) => {
            return (
                <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
                  <div>Address: {checkIn.address}</div>
                  <div>Time: {checkIn.timestamp.toString()}</div>
                </div>)
          })}
        </div>
      </div>
  );
};

export default App;
