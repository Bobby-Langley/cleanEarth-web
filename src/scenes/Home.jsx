import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import Head from "../components/home/Head";
import EventList from "../components/home/EventList";
import { Col, Row } from "antd";


function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  useEffect(() => {
    console.log(user)
    if (user) {
      setLoading(true);
      fetch("https://us-central1-cleanearth-api.cloudfunctions.net/app/events")
        .then((res) => res.json())
        .then((data) => {
          setEvents(data); console.log('data', data)
          setLoading(false);
        })
        .catch((e) => {
          console.log(e)
          setLoading(false)
        });
    } else {
      setEvents([]);
      setLoading(false);
    }
  }, [user]);
  console.log(events)

  return (

    <>

      <Head setEvents={setEvents} setLoading={setLoading} />
      <Row justify="space-around" >
      <Col span={20} >
        <EventList  
        events={events}
        setEvents={setEvents}
        loading={loading}
        setLoading={setLoading}
      />
      </Col>
      </Row>
      
      
    </>
  );
}

export default Home;
