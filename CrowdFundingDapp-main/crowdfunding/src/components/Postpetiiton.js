import React from "react";
import { Form, Button,Alert} from "react-bootstrap";
import manager from "../images/manager.png";
const Postpetiiton = (prop) => {
  return (
    <div className="container1">
      <div className="manager">
        <img src={manager} alt="manager"/>
      </div>
      <h3>管理员</h3>
      <p>{prop.manager}</p>
    <Form  onSubmit={prop.petitionPost}>
    <Form.Floating className="mb-3 form1" >
        <Form.Control
          id="floatingInputCustom"
          type="text"
          placeholder="text"
          name="petitionName"
          value={prop.petitionName}
          onChange={prop.handlePetition}
          required
        />
        <label htmlFor="floatingInputCustom">募捐名称</label>
        </Form.Floating>
        <Form.Floating className="mb-3 form1" >
        <Form.Control
          id="floatingInputCustom"
          type="number"
          placeholder="Number"
          name="amountNeed"
          value={prop.amountNeed}
          onChange={prop.handlePetition}
          required
        />
        <label htmlFor="floatingInputCustom">需要总数</label>
        </Form.Floating>
        <Form.Floating className="mb-3 form1" >
        <Form.Control
          id="floatingInputCustom"
          type="text"
          placeholder="text"
          name="recipientAddress"
          value={prop.recipientAddress}
          onChange={prop.handlePetition}
          required
        />
        <label htmlFor="floatingInputCustom">接收人地址</label>
        </Form.Floating>
      <Button  className="container1button" type="submit">发起募捐</Button>
    </Form>
    {prop.show && (
        <Alert
          className="alert1"
          variant="danger"
          onClose={() => prop.setShow(false)}
          dismissible
        >
          <Alert.Heading className="alertheading1">需要管理员权限</Alert.Heading>
        </Alert>
      )}
    </div>
  );
};

export default Postpetiiton;
