"use client"; // client component

import {regles} from './regles/page'
import Test from './test'
import Image from 'next/image';
import styles from './page.module.css';
import { Container, Row, Col } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import Link from "next/link";
import { NextUIProvider } from '@nextui-org/react';


export default function Home() {
    return (
        <main className={styles.main}>

            <div>
                <Row justify="center">
                    <Col css={{ marginTop: '$8' }}>
                        <img style={{ width: '220px' }} src="/Marilyn_Monroe_Subway.png"  alt={"Marilyn_Monroe_Subway"}/>
                    </Col>
                </Row>
            </div>
            <div>
                <Row justify="center">
                    <Col css={{ marginTop: '$8' }}>
                        <Link href='/regles'>

                                <Button
                                    size="sm"
                                    style={{
                                        background: '#00000070',
                                        boxShadow: '0px 0px 4px #ffffff',
                                    }}
                                >
                              <span
                                  style={{
                                      color: 'white',
                                      fontSize: '20px',
                                  }}
                              >
                                  Règles
                              </span>
                                </Button>

                        </Link>
                    </Col>
                </Row>
            </div>
        </main>
    )
}
