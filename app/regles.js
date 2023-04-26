"use client"; // this is a client component
/*
import styles from './page.module.css'
import {Col, Row} from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';


export default function regles() {
    return (
        <html>
        <main className={styles.main}>



            <div>
                <Row justify="center">
                    <Col css={{ marginTop: '$8' }}>
                        <img style={{ width: '220px' }} src="/Marilyn_Monroe_Subway.png"  alt={"Marilyn_Monroe_Subway"}/>
                    </Col>
                </Row>
            </div>




        </main></html>
   )
}
*/

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import React from 'react';

const Regles = () => {
    return (
        <div>
            <h1>Les règles du vote</h1>
            <p>Voici les règles du vote:</p>
            <ul>
                <li>Règle 1</li>
                <li>Règle 2</li>
                <li>Règle 3</li>
            </ul>
        </div>
    );
};

export default Regles;

