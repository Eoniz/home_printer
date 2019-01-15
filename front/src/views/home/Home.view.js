import React, { Component } from 'react';
import {
    Grid,
    Col,
    Row,
    Button,
    ProgressBar,
    Table,
    Checkbox
} from 'react-bootstrap' ;
import DropZone from 'react-dropzone';

import style from './Home.style';

import axios from 'axios';

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: [],
            loaded: 0,
        };
    }

    onDrop(file) {
        const { files } = this.state;
        let newFiles = files;
        newFiles.push({file: file[0], black: false});

        this.setState({
            files: newFiles
        })
    }

    onClickSend() {
        this.send();
    }

    send() {
        const { files } = this.state;
        this.setState({loaded: 0});
        
        if(files.length === 0) {
            this.setState({
                loaded: 100,
            })

            this.print();

            return;
        }
        
        const file = files[0];

        const data = new FormData();
        data.append('file', file.file, file.name);
        data.append('black', file.black);

        axios.post('http://localhost:7000', data, {
            onUploadProgress: ProgressEvent => {
                this.setState({
                    loaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
                })
            }
        }).then(res => {
            let newFile = files;
            newFile.splice(0, 1);
            this.setState({files: newFile});

            this.send();
        })
    }

    async print() {
        await axios.get('http://localhost:7000/print');
    }

    toggleBlack = (i) => {
        const { files } = this.state;
        let newFiles = files;

        newFiles[i].black = true;

        this.setState({
            files: newFiles
        })
    }

    render() {
        const files = this.state.files.map((file, i) => {
            return (
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>Fichier</td>
                    <td>{file.file.name}</td>
                    <td>
                        <Checkbox style={{margin: 0}} onChange={() => this.toggleBlack(i)} >
                            Noir et blanc
                        </Checkbox>
                    </td>
                </tr>
            )
        });
        
        let i = 0;

        return (
            <div style={style.container}>
                <DropZone onDrop={this.onDrop.bind(this)}>
                    {({getRootProps, getInputProps}) => (
                        <div {...getRootProps() }>
                            <Grid style={style.grid}>
                                <Row>
                                    <Col xs={12} style={style.body}>
                                        <h1>Commencer une impression</h1>
                                        <h3 style={style.h3}>Glissez-déposez ici pour commencer l'envoi de vos documents dès maintenant, ou appuyez sur le bouton "Commencer l'envoi".</h3>
                                        <h4 style={style.h3}>/!\ Assurez vous que l'imprimante est alimentée avant de l'ancer l'impression /!\</h4>
                                    </Col>
                                </Row>

                                <Row>   
                                    <Col xs={4} style={style.body}>
                                        <Button bsStyle={"info"} bsSize={"large"} style={style.mt} >Commencer l'envoi</Button>
                                    </Col>

                                    <Col xs={4} style={style.body}>
                                    </Col>

                                    <Col xs={4} style={style.body}>
                                        <Button 
                                            style={style.mt}
                                            bsStyle={"warning"} 
                                            bsSize={"large"} 
                                            onClick={this.onClickSend.bind(this)}
                                        >
                                            Lancer l'impression
                                        </Button>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={12}>
                                        <ProgressBar
                                            style={style.mt}
                                            label={`${Math.round(this.state.loaded)}%`} 
                                            striped bsStyle="info" now={this.state.loaded} 
                                        />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={12} style={style.body}>
                                        <h4>Fichiers</h4>
                                        <Table striped bordered condensed hover>
                                            <thead >
                                                <tr>
                                                    <th style={{textAlign: 'center'}}>#</th>
                                                    <th style={{textAlign: 'center'}}>Type</th>
                                                    <th style={{textAlign: 'center'}}>Nom</th>
                                                    <th style={{textAlign: 'center'}}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {files}
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </Grid>
                        </div>

                    )}
                </DropZone>
            </div>
        )
    }
}