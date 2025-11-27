import React from "react";
import Image from "next/image";
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import "./Grids.css";

export default function Grids() {
    return (
        <Row className="grid-container">
            <Col md={6}>
                <div className="text-content">
                    <h2>Analiza datelor statistice a platilor comunale.</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elementum nisi aliquet volutpat pellentesque volutpat est. Sapien in etiam vitae nibh nunc mattis imperdiet sed nullam. </p>
                </div>
            </Col>
            <Col md={6}>
                <Image
                    src="/images/main-screen.png"
                    layout="responsive"
                    alt="Main Screen" width={500} height={300}>
                </Image>
            </Col>
            <Col md={6}>
                <div className="text-content">
                    <p>ASDPSC este un website care se ocupă cu analiza statistică a datelor comunale. Acesta efectuează calculul pentru achitarea taxelor comunale în luna curentă și analizează creșterea taxelor în toate regiunile din Republica Moldova.</p>
                </div>
            </Col>
            <Col md={6}>
                <Image
                    src="/images/123.png"
                    layout="static"
                    alt="" width={450} height={450}
                    className="image-content">
                </Image>
            </Col>
        </Row>
    );
}