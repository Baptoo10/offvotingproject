"use client"; // client component

//import list
import React, { useState, useEffect } from 'react';
import {BigNumber, ethers} from 'ethers';
import { useRouter } from 'next/navigation';
//import { useRouter } from 'next/router';
//import {Link, useLocation} from 'react-router-dom';
import {Button, Col, Row} from "@nextui-org/react";
import Link from "next/link";

const WebSocket = require('ws');

//Voting contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
import VotingABI from '../artifacts/contracts/votingcontract.sol/Voting.json'
const VotingAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3' //ADDRESS

export default function Home() {

    const [proposals, setProposals] = useState([]); // State pour stocker les propositions récupérées
    const [props, setProps] = useState([]);
    const [propsDesc, setPropsDesc] = useState([]);
    const [creatorProps, setCreatorProps] = useState([]);
    const [numVotes, setNumVotes] = useState(new Array(props.length).fill(0));
    const [whoVoted, setWhoVoted] = useState([]);
    const [indexProp, setIndexProp] = useState([]);

    console.log("idxProp", indexProp);

    const router = useRouter();

    async function requestAccount() {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    async function removeProposalById(indexprop) {
        console.log("coucouvote32");

        await requestAccount(); /* appel à requestAccount(), qui doit être une fonction définie ailleurs */
        console.log("coucouvote4");

        if (typeof window.ethereum !== 'undefined') {
            try {
                console.log("coucouvote5");

                const provider = new ethers.providers.Web3Provider(window.ethereum);
                console.log("coucouvote51");

                const signer = provider.getSigner();
                console.log("coucouvote52");

                const contract = new ethers.Contract(VotingAddress, VotingABI.abi, signer);
                console.log("coucouvote53");
                console.log("props = ", props);

                const transaction = await contract.removeProposalById(indexprop);
                // const newProps = props.filter((_, index) => index !== indexprop);
                //setProps(newProps);
                //setProposals(newProps);
                console.log('Remove soumis, indexprop = ', indexprop);

            } catch (error) {
                console.log("coucouvote6");
                console.error('Erreur lors du vote : ', error);
            }
        } else {
            console.log("coucouvote7");
            console.error(
                'Web3 non disponible. Veuillez installer MetaMask pour interagir avec cette fonction.'
            );
        }
    }


    useEffect(() => {

        console.log('Fetching proposals...');
        async function fetchData() {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(VotingAddress, VotingABI.abi, signer);
            const [indexProp, props, propsDesc, creatorProps, numVotes, votedBy] = await contract.getFullProps();

            setIndexProp(indexProp.map((idx) => parseInt(idx)));
            setProps(props);
            setPropsDesc(propsDesc);
            setCreatorProps(creatorProps);
            setNumVotes(numVotes.map((votes) => parseInt(votes)));
            setWhoVoted(votedBy);
        }

        fetchData();
    }, []);

    return (
        <main>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:'5%' }}>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft:'5%'}}>
                    <a href="/"><img style={{ width: '220px' }} src="/Marilyn_Monroe_Subway.png" alt="Marilyn_Monroe_Subway" /></a>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft:'-5%'}}>
                    <Link href="/regles">
                        <Button size="sm" style={{ background: '#00000070', boxShadow: '0px 0px 4px #ffffff' }}>
                            <span style={{ color: 'white', fontSize: '20px' }}>Règles du vote</span>
                        </Button>
                    </Link>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight:'5%'}}>
                    <Link href="/gestions">
                        <Button size="sm" style={{ background: '#00000070', boxShadow: '0px 0px 4px #ffffff' }}>
                            <span style={{ color: 'white', fontSize: '20px' }}>Gestion du vote</span>
                        </Button>
                    </Link>
                </div>
            </header>

            <div>
                <br/>
            </div>

            <div style={{ display: 'grid', justifyContent: 'center' }} >
                <Row justify="center" css={{ marginTop: '$4' }}>
                    <Col>
                        <div style={{ color: 'black', backgroundColor: 'white', padding: '16px', borderRadius: '4px', width: '50vw' }}>
                            <u><h1>Liste des propositions</h1></u>
                            <br/>
                            <ul>
                                {props.map((prop, index) => (
                                    <li key={index}>
                                        <button onClick={() => router.push('/proplink?index=' + indexProp)}>
                                            <h2 style={{ color: 'black' }}>
                                                <strong>{prop}</strong>
                                            </h2>
                                        </button>
                                        <p>{propsDesc[index]}</p>
                                        <p>Proposition {index} faite par : {creatorProps[index]}</p>
                                        <p>Il y a actuellement {numVotes[index]} voix pour la proposition</p>
                                        <button onClick={() => removeProposalById(indexProp[index])}>Supprimer la proposition</button>                                            <br/>
                                        <br/>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Col>
                </Row>
            </div>

        </main>
    )
}
