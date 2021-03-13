import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { getSingleEvent, submitForm } from "./apiCall";
import { UserContext } from "../../App";
import { DatePicker, TimePicker, Form, Input, Button, Row, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import moment from "moment";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const showSuccess = (responseMessage) => {
  return alert(responseMessage);
};

const rangeConfig = {
  rules: [
    {
      type: 'array',
      required: true,
      message: 'Please select time.',
    },
  ],
}

const EventForm = () => {
  // const storageRef = firebase.storage().ref
  const [form] = Form.useForm();
  const [event, setEvent] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(undefined);
  const { user } = useContext(UserContext);
  const { mode, id } = useParams();
  const history = useHistory();

  const [fields, setFields] = useState();

  useEffect(() => {
    if (mode === "update") {
      getSingleEvent(id, setEvent);
    }
  }, [mode, id]);

  useEffect(() => {
    if (mode === "update") {
      const initEvent = {
        eventName: event && event.eventName,
        description: event && event.description,
        location: event && event.location,
        address: event && event.address,
        startEndTime: [event && moment(event.startEndTime[0]), event && moment(event.startEndTime[1])],
        date: event && moment(event.date),
      };

      form.setFieldsValue(initEvent);
    }
  }, [event]);

  const { RangePicker } = TimePicker;

  useEffect(() => {
    if (responseMessage !== undefined) showSuccess(responseMessage);
  }, [responseMessage]);

  return (
    <>
      <Form
        form={form}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        className="site-layout-content"
        fields={fields}
        onFieldsChange={(changedFields, allFields) => setFields(allFields)}
        onFinish={(event) => {
          submitForm(event, fields, setResponseMessage, user, history, mode, id, setLoading);
        }}>
        <h1 style={{ textAlign: "center" }}>Event Details</h1>
        <Form.Item label="Event Name:" name="eventName" rules={[
          {
            required: true,
            message: 'Please input event name',
          },
        ]}>
          <Input />
        </Form.Item>

        <Form.Item label="Location:" name="location" rules={[
          {
            required: true,
            message: 'Please input a valid location.',
          },
        ]}>
          <Input />
        </Form.Item>

        <Form.Item label="Address: " name="address" >
          <Input />
        </Form.Item>
        <Form.Item label="Description: " name="description" rules={[
          {
            required: true,
            message: 'Please describe the event.',
          },
        ]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Time: " name="startEndTime">
          <RangePicker 
            format={["h:mm", "h:mm"]}
          />
        </Form.Item>
        <Form.Item label="Date" name="date" rules={[
          {
            required: true,
            message: 'Please input a date.',
          },
        ]}>
          <DatePicker format={"MM-DD-YYYY"}  {...rangeConfig}/>
        </Form.Item>
        <Form.Item label="Photo URL:" name="photo">
          <Input/>
        </Form.Item>
        <Form.Item>
          <Row justify="end">
            <Button type="primary" htmlType="submit">
              {loading && <Spin indicator={antIcon} />}
              Submit
            </Button>
          </Row>
          <p id="formPrompt"></p> <br /> &nbsp;
        </Form.Item>
      </Form>
    </>
  );
};

export default EventForm;
