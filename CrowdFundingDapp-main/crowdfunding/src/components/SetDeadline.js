import React from "react";
import { Button, Form, Alert } from "react-bootstrap";
import manager from "../images/manager.png";

export const SetDeadline = (props) => {
  return (
    <div className="container1">
      <div className="manager">
        <img src={manager} alt="manager" />
      </div>
      <h3>管理员</h3>
      <p>{props.Manager}</p>
      <h8>合约地址</h8>
      <p>{props.contractAddress}</p>
      <form onSubmit={props.setDeadlineTime}>
        <Form.Floating className="mb-3 form1">
          <Form.Control
            id="floatingInputCustom"
            name="totalFundNeed"
            type="number"
            placeholder="number"
            value={props.totalFundNeed}
            onChange={props.handleChange}
            required
          />

          <label htmlFor="floatingInputCustom">总募捐金额池（单位为Wei）</label>
        </Form.Floating>

        <Form.Floating className="mb-3 form1">
          <Form.Control
            id="floatingInputCustom"
            name="deadlineTime"
            type="number"
            placeholder="number"
            value={props.deadlineTime}
            onChange={props.handleChange}
            required
          />
          <label htmlFor="floatingInputCustom">
            请设置时间期限（单位为秒）
          </label>
        </Form.Floating>
        <Button className="container1button" type="submit">
          提交
        </Button>
      </form>
      {props.show && (
        <Alert
          className="alert1"
          variant="danger"
          onClose={() => props.setShow(false)}
          dismissible
        >
          <Alert.Heading className="alertheading1">需要管理员权限</Alert.Heading>
        </Alert>
      )}
    </div>
  );
};
