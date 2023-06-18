import React, { useState } from "react";
import { Button ,Badge,Alert} from "react-bootstrap";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import logo from '../images/logo.png'



const Petitionslist = (prop) => {
  const [index, setIndex] = useState(0);
  const { PetitionName, AmountNeed, RecipientAddress, favourCount, funderCount } =
    prop.listPetition[index];
  const moveRight = () => {
    if (index < prop.listPetition.length - 1) setIndex(index + 1);
    else setIndex(0);
  };
  const moveLeft = () => {
    if (index === 0) setIndex(prop.listPetition.length - 1);
    else setIndex(index - 1);
  };

  return (
    <main>
      <div className="container2">
      <img src={logo} alt="logo"/>
        <h4><Badge bg="secondary">募捐名称: {PetitionName}</Badge> </h4>
        <h4><Badge bg="secondary">需要总数: {AmountNeed} Wei</Badge></h4>
        <h5><Badge bg="secondary">接收人地址: {RecipientAddress}</Badge></h5>
       
        <Button variant="success" className="container2button" onClick={() => prop.Paid(index)}>
          发送给接收方
        </Button>
        {/* <p>Only over half of funders voted can be donated</p> */}
        <p>超过半数以上的人同意才能发送</p>
        <Button
          className="container2button"
          onClick={() => prop.voteFavour(index)}
        >
          {" "}
          为该募捐投票
        </Button>
        <p>已投票人数：{favourCount}</p>
        <p>总捐款人数：{funderCount}</p>
        {prop.show && (
        <Alert className="alert1" variant="danger" onClose={() => prop.setShow(false)} dismissible>
          <Alert.Heading className="alertheading1">不好意思，您不是捐款者</Alert.Heading>
        </Alert>
      )}
        <div className="icons">
          <button onClick={moveLeft}>
            <AiOutlineDoubleLeft />
          </button>
          <text>{index+1}</text>
          <button onClick={moveRight}>
            <AiOutlineDoubleRight />
          </button>
        </div>
      </div>
    </main>
  );
};
export default Petitionslist;
