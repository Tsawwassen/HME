// React imports
import React, { Component } from 'react';
import { Col, Row, Form, Button, ListGroup  } from 'react-bootstrap';

// Helper Class
import FileReaderHelper from '../class/FileReaderHelper';

// UploadV2 component
// Render one file input and text field for multiple parts, and submit button
class UploadV2 extends Component {
  
    // Store two file paths and two file data as JSON array
    constructor(props){
        super(props);
        this.state = {
            expectedFilePath: {},
            activePartNumber: "",
            actualPartList: []
        };

        // OnChange functions
        this.expectedFileOnChange = this.expectedFileOnChange.bind(this);
        this.activePartNumberOnChange = this.activePartNumberOnChange.bind(this);

        // OnExit functions
        this.partNumberOnExit = this.partNumberOnExit.bind(this);

        //Submit function
        this.submit = this.submit.bind(this);

        //Test Button Test
        this.testButtonClicked = this.testButtonClicked.bind(this);  
        
    }

    // Submit input files paths to be parsed
    submit(){  
        //This helper function needs to be updates     
       FileReaderHelper.getFileContent(this.state.expectedFilePath, 
                                        this.props.setters, 
                                        "Please select an expected inventory file",
                                        );
      
       
    }

    // OnChange functions
    expectedFileOnChange(e){
        this.setState({expectedFilePath: e.target.files[0]});
    }
    activePartNumberOnChange(e){
        this.setState({activePartNumber: e.target.value});
    }

    // OnExit Function
    // -On focus exit of Scanned Part number input field:
    // ---Add new part number to list
    // ---Clear input field
    // ---Set focus back to input field
    partNumberOnExit(e){
        //console.log("onExit Function")
        let temp = this.state.actualPartList;
        temp.push(this.state.activePartNumber);
        e.target.value = "";
        e.target.focus();
        this.setState({actualPartList: temp, activePartNumber: ""});
    }

    //Test Button Function
    testButtonClicked(){
        console.log(this.state.activePartNumber);
    }


    
    // Render two file inputs and submit button.
    render() {
        return (<>
            <h2>Upload V2 COMPONENT</h2>
            <Row>
                <Col>
                <Form>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Expected Inventory file</Form.Label>
                        <Form.Control type="file" onChange={this.expectedFileOnChange}  />
                        <Form.Label>Scanned Part Number</Form.Label>
                        <Form.Control autoFocus type="text" placeholder="Part Number" onChange={this.activePartNumberOnChange} onBlur={this.partNumberOnExit} />
                    </Form.Group>
                    <Button variant="primary" type="button" onClick={this.submit}>Submit</Button>
                </Form>
                </Col>
            </Row>
            <ListGroup>
                {this.state.actualPartList.map( (l, i) => {
                    return <ListGroup.Item key={i}>{l}</ListGroup.Item>
                })}
            </ListGroup>
            {/** Test Button to see component state variables */}<br /><Button variant="primary" type="button" onClick={this.testButtonClicked}>testButtonClicked</Button>
        </>);
      };
    }
    export default UploadV2;