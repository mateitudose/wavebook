const main = async () => {
    const ContractFactory = await hre.ethers.getContractFactory("CheckInPortal");
    const Contract = await ContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.1"),
    });
    await Contract.deployed();
    console.log("Contract address:", Contract.address);

    let checkInsCount;
    checkInsCount = await Contract.getTotalCheckIns();
    console.log(checkInsCount.toNumber());

    let contractBalance = await hre.ethers.provider.getBalance(
        Contract.address
    );
    console.log(
        "Contract balance:",
        hre.ethers.utils.formatEther(contractBalance)
    );

    /**
     * Let's send a few waves!
     */
    let checkInTX = await Contract.checkIn();
    await checkInTX.wait(); // Wait for the transaction to be mined

    contractBalance = await hre.ethers.provider.getBalance(
        Contract.address
    );
    console.log(
        "Contract balance:",
        hre.ethers.utils.formatEther(contractBalance)
    );

    const [_, randomPerson] = await hre.ethers.getSigners();
    checkInTX = await Contract.connect(randomPerson).checkIn();
    await checkInTX.wait(); // Wait for the transaction to be mined

    let allCheckIns = await Contract.getCheckInsList();
    console.log(allCheckIns);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();
