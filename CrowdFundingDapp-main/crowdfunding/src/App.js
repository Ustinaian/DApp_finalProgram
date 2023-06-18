import "./App.css";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contract from "./artifacts/contracts/Crowdfunding.sol/Crowdfunding.json";
import Metamask from "./components/Metamask";
import { SetDeadline } from "./components/SetDeadline";
import Postpetiiton from "./components/Postpetiiton";
import { Button, Tab, Tabs, Alert } from "react-bootstrap";
import Petitionslist from "./components/Petitionslist";
import logo from "./images/logo.png";

const contractAddress = "0x3963a8b43E622386687a7bF039459B61FAc94AdC";
const App = () => {
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [show4, setShow4] = useState(false);
    const [show5, setShow5] = useState(false);
    const [show6, setShow6] = useState(false);
    const [web3, setWeb3] = useState({
        provider: "",
        contract: "",
        signer: "",
    });
    const [walletPage, setWalletPage] = useState(false);
    const [deadlines, setDeadlines] = useState({
        totalFundNeed: "",
        deadlineTime: "",
    });
    const [petitions, setPetitions] = useState({
        petitionName: "",
        amountNeed: "",
        recipientAddress: "",
        isFullfilled: "",
    });
    const [managerAdd, setManager] = useState();
    const [listPetition, setListPetition] = useState([]);
    const [page, setPage] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [account, setAccount] = useState("");
    const [raiedAmount, SetRaisedAmount] = useState();
    const [deadLine, SetDeadLine] = useState();
    const walletConnect = async () => {
        if (typeof window.ethereum == "undefined") {
            setWalletPage(true);
        } else {
            try {
                const _provider = new ethers.providers.Web3Provider(window.ethereum);
                if (_provider) {
                    await _provider.send("eth_requestAccounts", []);
                    const _signer = _provider.getSigner();
                    const acc = await _signer.getAddress();
                    setAccount(acc);
                    const fundingContract = new ethers.Contract(
                        contractAddress,
                        contract.abi,
                        _provider
                    );
                    setWeb3({
                        provider: _provider,
                        contract: fundingContract,
                        signer: _signer,
                    });
                    setPage(true);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };
    //checking contract balance Start!!
    useEffect(() => {
        const checkBalance = async () => {
            const balance = await web3.provider.getBalance(
                contractAddress
            );
            SetRaisedAmount(parseInt(balance));
        };
        web3.contract && checkBalance();
    }, [web3.contract, refresh]);
    //Checking Contract Balance End

    

    //Total amount need and deadline time start
    const handleChange = (event) => {
        const { name, value } = event.target;
        setDeadlines((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };
    const setDeadlineTime = async (e) => {
        e.preventDefault();
        try {
            const { totalFundNeed, deadlineTime } = deadlines;
            const contractInstance = web3.contract.connect(web3.signer);
            await contractInstance.setFundTime(totalFundNeed, deadlineTime);
            setTimeout(() => {
                setDeadlines({ totalFundNeed: "", deadlineTime: "" })
            }, 15000);
        } catch (error) {
            setShow1(!show1);
            console.log(error);
        }
    };
    //Total amount need and deadline time end

    //Post the Petition start
    const handlePetition = (event) => {
        const { name, value } = event.target;
        setPetitions((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };
    const petitionPost = async (event) => {
        event.preventDefault();
        try {
            const { petitionName, amountNeed, recipientAddress } = petitions;
            const contractInstance = await web3.contract.connect(web3.signer);
            await contractInstance.setPetition(
                petitionName,
                amountNeed,
                recipientAddress
            );

            setTimeout(() => {
                setPetitions({ petitionName: "", amountNeed: "", recipientAddress: "" })
                setRefresh(!refresh);
            }, 20000);
        } catch (error) {
            setShow2(!show2);
            console.log(error);
        }
    };
    //Post the Petition end

    //Vote For Favour start
    const voteFavour = async (index) => {
        try {
            const contractInstance = await web3.contract.connect(web3.signer);
            const add = await web3.signer.getAddress();
            await contractInstance.votePetition(index, {
                from: add,
            });
            setTimeout(() => {
                setRefresh(!refresh);
            }, 15000);
        } catch (error) {
            setShow3(!show3);
            console.log(error);
        }
    };

    //Vote For Favour end

    //Paid Recipient
    const paid = async (index) => {
        try {
            const contractInstance = await web3.contract.connect(web3.signer);
            const success = await contractInstance.payRecipient(index);
            console.log(success);
            setTimeout(() => {
                setRefresh(!refresh);
            }, 15000);
        } catch (error) {
            setShow3(!show3);
            console.log(error);
        }
    };

    //useffectforaccount start

    useEffect(() => {
        window.ethereum.on("accountsChanged", async (acc) => {
            if (acc.length === 0) console.log("please connect to accounts");
            else if (acc[0] !== account) setAccount(acc[0]);
        });
    }, [account]);

    //useeffect for account End

    //Crowd Funding start
    const crowdFund = async () => {
        try{
            const contractInstance = web3.contract.connect(web3.signer);
            await contractInstance.fundPetitions({
                value: ethers.utils.parseEther("0.01"),
            });
        }catch(error){
            setShow5(!show5);
            console.log(error);
        }
        setTimeout(() => {
            setRefresh(!refresh);
        }, 15000);
    };
    //Crowd Funding end

    //Refund Start
    const crowdRefund = async () => {
        try {
            const contractInstance = await web3.contract.connect(web3.signer);
            await contractInstance.refund();
        } catch (error) {
            if(error.error.code == -32000){
                setShow6(!show6);
            }
            else{
                setShow4(!show4);
            }
            console.log(error);
        }
    };
    //Refund Ends

    //refreshing Petition List start
    useEffect(() => {
        const retrivePetition = async () => {
            const totalPetition = await web3.contract.totalPetitions();
            for (let i = 0; i < parseInt(totalPetition); i++) {
                const dataPetition = await web3.contract.petition(i);
                const fCount = await web3.contract.getnoOfFunders();
                if (dataPetition.name !== "undefined") {
                    const success = listPetition.find(
                        (data) => data.PetitionName === dataPetition.name
                    );
                    if (!success && !dataPetition.isFullfilled) {
                        setListPetition((prevState) => [
                            ...prevState,
                            {
                                PetitionName: dataPetition.name,
                                AmountNeed: parseInt(dataPetition.amountNeeded),
                                RecipientAddress: dataPetition.recipient,
                                IsFullfilled: dataPetition.isFullfilled,
                                favourCount:parseInt(dataPetition.favourCount),
                                funderCount:parseInt(fCount)
                            },
                        ]);
                    }
                }
            }
        };
        web3.contract && retrivePetition();
    }, [web3.contract, refresh]);
    //refreshing Petition List end

    useEffect(() => {
        const getManger = async () => {
            const _provider = new ethers.providers.Web3Provider(window.ethereum);
            await _provider.send("eth_requestAccounts", []);
            const _signer = await _provider.getSigner();
            const promise = _signer.getAddress();
            promise.then((result) =>{
                setManager(result)
            })
        };
        web3.contract && getManger();
    }, [web3.contract, refresh]);


    //checking Dealine Start!!
    
    const getTimeDeadline = async () => {

        const contractInstance = await web3.contract.connect(web3.signer);
        const result = await contractInstance.getTimeDeadline();

        let timestamp = (parseInt(result._hex))* 1000 //截止时间时间戳
        const date = new Date(timestamp);
        const options = { timeZone: 'Asia/Shanghai' }; 
        const formattedDate = date.toLocaleString('en-US', options);//准确截止时间
        // console.log(formattedDate)

        const currentDate = Date.now();
        const difference = (timestamp - currentDate);
        const seconds = Math.floor(difference / 1000);
        // console.log(difference);

        if (difference <= 0) {
            clearInterval(intervalId);
            SetDeadLine("倒计时结束");
            return;
        }
        SetDeadLine(`倒计时: ${seconds} 秒`);

    };
    //Checking Dealine End

    const intervalId = setInterval(() => {
        getTimeDeadline();
    }, 1000);


    return (
        <main className="App">
            {!page && (
                <Metamask walletPage={walletPage} walletConnect={walletConnect} />
            )}
            {page && (
                <Tabs
                    defaultActiveKey="first"
                    transition={true}
                    id="noanim-tab-example"
                    className="mb-2 tabs"
                >
                    <Tab eventKey="first" title="设置时间期限" className="tabtitle">
                        <SetDeadline
                            handleChange={handleChange}
                            totalFundNeed={deadlines.totalFundNeed}
                            deadlineTime={deadlines.deadlineTime}
                            setDeadlineTime={setDeadlineTime}
                            show={show1}
                            setShow={setShow1}
                            Manager={managerAdd}
                            contractAddress={contractAddress}
                        />
                    </Tab>
                    <Tab eventKey="Second" title="发起募捐" className="tabtitle">
                        <Postpetiiton
                            petitionPost={petitionPost}
                            handlePetition={handlePetition}
                            petitionName={petitions.petitionName}
                            amountNeed={petitions.amountNeed}
                            recipientAddress={petitions.recipientAddress}
                            show={show2}
                            setShow={setShow2}
                            manager={managerAdd}
                        />
                    </Tab>
                    <Tab eventKey="third" title="募捐列表" className="tabtitle">
                        {listPetition.length > 0 ? (
                            <Petitionslist
                                listPetition={listPetition}
                                Paid={paid}
                                voteFavour={voteFavour}
                                show={show3}
                                setShow={setShow3}
                                
                            />
                        ) : (
                            <Button className="finalbutton">NO PETITION</Button>
                        )}
                    </Tab>
                    <Tab eventKey="fourth" title="募捐模块" className="tabtitle">
                        {listPetition.length > 0 ? (
                            <div className="container3">
                                <img src={logo} alt="logo" />
                                <p className="add">当前使用者: {account}</p>

                                <h3 className="amount">目前收到 : {raiedAmount} Wei</h3>
                                <p className="error">
                                    在倒计时过程中进行捐款
                                </p>
                                <Button
                                    className="container3button"
                                    onClick={() => crowdFund()}
                                >
                                    捐款
                                </Button>
                                {show5 && (
                                    <Alert
                                        className="alert1"
                                        variant="danger"
                                        onClose={() => setShow5(false)}
                                        dismissible
                                    >
                                        <Alert.Heading className="alertheading1">
                                            倒计时已经结束
                                        </Alert.Heading>
                                    </Alert>
                                )}
                                
                                <p className="error">
                                    倒计时结束后才可退款
                                </p>
                                <Button
                                    variant="danger"
                                    className="container3button"
                                    onClick={() => crowdRefund()}
                                >
                                    退款
                                </Button>
                                <p className="add">{deadLine}</p>
                                {show4 && (
                                    <Alert
                                        className="alert1"
                                        variant="danger"
                                        onClose={() => setShow4(false)}
                                        dismissible
                                    >
                                        <Alert.Heading className="alertheading1">
                                            倒计时还未结束
                                        </Alert.Heading>
                                    </Alert>
                                )}
                                {show6 && (
                                    <Alert
                                        className="alert1"
                                        variant="danger"
                                        onClose={() => setShow6(false)}
                                        dismissible
                                    >
                                        <Alert.Heading className="alertheading1">
                                            你不是捐款者
                                        </Alert.Heading>
                                    </Alert>
                                )}
                            </div>
                        ) : (
                            <Button className="finalbutton">暂时没有募捐</Button>
                        )}
                    </Tab>
                </Tabs>
            )}
        </main>
    );
};

export default App;
