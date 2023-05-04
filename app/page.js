"use client"; // client component

//import list
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; //'next/navigation' et non 'next/router' puisque je navigue avec le app directory
import {regles} from './regles/page'
import Image from 'next/image';
import './globals.css';
import styles from './page.module.css';
import {Container, Row, Col, blueDark, yellow, theme} from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import Link from "next/link";
import {ethers} from "ethers";
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider } from 'next-themes';
//import {router} from "next/client"; //ABI

const WebSocket = require('ws');


//Voting contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
import VotingABI from './artifacts/contracts/votingcontract.sol/Voting.json'
const VotingAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' //ADDRESS

export default function Home() {

    const [newProposalName, setNewProposalName] = useState('') ; // State pour stocker le nouveau nom de proposition
    const [newProposalDesc, setNewProposalDesc] = useState(''); // State pour stocker le nouveau nom de proposition
    const [proposals, setProposals] = useState([]); // State pour stocker les propositions récupérées
    const [props, setProps] = useState([]);
    const [propsDesc, setPropsDesc] = useState([]);
    const [creatorProps, setCreatorProps] = useState([]);
    const [numVotes, setNumVotes] = useState([]);
    const [whoVoted, setWhoVoted] = useState([]);
    const [indexProp, setIndexProp] = useState([]);

    const router = useRouter();

    async function requestAccount() {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    async function addProposal() {
        await requestAccount();
        console.log(newProposalName);
        if(!newProposalName) return
        if (typeof window.ethereum !== 'undefined') {
            try {
                console.log(newProposalName);
                // Se connecter au fournisseur Web3 (MetaMask)
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                //Signer le contrat
                const signer = provider.getSigner();
                // Créer une instance du contrat Voting
                const contract = new ethers.Contract(VotingAddress, VotingABI.abi, signer);
                // Appeler la fonction Solidity pour ajouter une nouvelle proposition
                const transaction = await contract.addProposal(newProposalName, newProposalDesc);

                //this.state.proposals.push(newProposal);
                console.log("coucou");
                // Réinitialiser le champ pour la nouvelle proposition
                setNewProposalName("");
                setNewProposalDesc("");

            } catch (error) {
                console.error("Erreur lors de l'ajout de la proposition : ", error);
            }
        } else {
            console.error("Web3 non disponible. Veuillez installer MetaMask pour interagir avec cette fonction.");
        }

    }

    useEffect(() => {
        console.log('Fetching proposals...');
        async function fetchData() {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(VotingAddress, VotingABI.abi, signer);
            const [indexProp, props, propsDesc, creatorProps, numVotes, votedBy] = await contract.getFullProps();

            setIndexProp(indexProp);
            setProps(props);
            setPropsDesc(propsDesc);
            setCreatorProps(creatorProps);
            setNumVotes(numVotes);
            setWhoVoted(votedBy);
        }

        fetchData();
    }, []);

    return (
        <main>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop:'5%' }}>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft:'5%'}}>
                    <img style={{ width: '220px' }} src="/Marilyn_Monroe_Subway.png" alt="Marilyn_Monroe_Subway" />
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

            <div>
                <div style={{ display: 'grid', justifyContent: 'center' }} >
                    <Row justify="space-between" align="flex-start" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft:'5%'}}>
                        <div>
                            <Row justify="center" align="stretch">
                                <Col css={{ marginTop: '$4' }}>
                                    <ul>
                                        <input placeholder={'Nom de la proposition'} type="text" id="newProposalInputName" value={newProposalName}
                                               onChange={(e) => setNewProposalName(e.target.value)}
                                               style={{ width: '100%'}}/>
                                    </ul>
                                    <br/>
                                    <ul>
                                    <textarea placeholder={'Description de la proposition'} id="newProposalInputDesc" value={newProposalDesc}
                                              onChange={(e) => setNewProposalDesc(e.target.value)}
                                              style={{ width: '100%', height: '50px' }} />
                                    </ul>
                                    <ul>
                                        <Button onPress={addProposal}>Ajouter une proposition ici</Button>
                                    </ul>
                                </Col>
                            </Row>
                        </div>
                    </Row>
                </div>
                <br/>
                <div style={{ display: 'grid', justifyContent: 'center' }} >
                    <Row justify="center" css={{ marginTop: '$4' }}>
                        <Col>
                            <div style={{ color: 'black', backgroundColor: 'white', padding: '16px', borderRadius: '4px', width: '50vw' }}>
                                <u><h1>Liste des propositions</h1></u>
                                <br/>
                                <ul>
                                    {props.map((prop, index) => (
                                        <li key={index}>
                                            <button onClick={() => router.push('/proplink?index=' + indexProp[index])}>
                                                <h2 style={{ color: 'black' }}>
                                                    <strong>{prop}</strong>
                                                </h2>
                                            </button>
                                            <p>{propsDesc[index]}</p>
                                            <p>Proposition faite par : {creatorProps[index]}</p>
                                            <br />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

        </main>
    )
}
