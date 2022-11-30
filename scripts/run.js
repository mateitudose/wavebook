const main = async () => {
    const [owner] = await hre.ethers.getSigners();
    const checkInContractFactory = await hre.ethers.getContractFactory("CheckInPortal");
    const checkInContract = await checkInContractFactory.deploy();
    await checkInContract.deployed();

    console.log("Contract deployed to:", checkInContract.address);
    console.log("Contract deployed by:", owner.address);

    await checkInContract.getTotalCheckIns();

    const firstWaveTxn = await checkInContract.checkin();
    await firstWaveTxn.wait();
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
