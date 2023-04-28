"use client"; // client component

//import list
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {regles} from './regles/page'
import Image from 'next/image';
import styles from './page.module.css';
import { Container, Row, Col } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import Link from "next/link";
import {ethers} from "ethers";
import { NextUIProvider } from '@nextui-org/react';

const WebSocket = require('ws');

//Voting contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
import VotingABI from './artifacts/contracts/votingcontract.sol/Voting.json' //ABI
const VotingAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' //ADDRESS

export default function Home() {

    const [newProposalName, setNewProposalName] = useState(''); // State pour stocker le nouveau nom de proposition
    const [newProposalDesc, setNewProposalDesc] = useState(''); // State pour stocker le nouveau nom de proposition
    const [proposals, setProposals] = useState([]); // State pour stocker les propositions récupérées
    const [props, setProps] = useState([]);
    const [propsDesc, setPropsDesc] = useState([]);
    const [creatorProps, setCreatorProps] = useState([]);
    const [numVotes, setNumVotes] = useState([]);
    const [whoVoted, setWhoVoted] = useState([]);


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
                //await transaction.wait();
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
            const [props, propsDesc, creatorProps, numVotes, votedBy] = await contract.getFullProps();

            setProps(props);
            setPropsDesc(propsDesc);
            setCreatorProps(creatorProps);
            setNumVotes(numVotes);
            setWhoVoted(votedBy);
           // getProposal();
        }

        fetchData();
    }, []);

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
                                  Règles du vote
                              </span>
                            </Button>

                        </Link>
                    </Col>
                </Row>
            </div>

            <div>
                <Row justify="center">
                    <Col css={{ marginTop: '$4' }}>
                        <ul>
                            <input type="text" id="newProposalInputName" value={newProposalName} onChange={(e) => setNewProposalName(e.target.value)} />
                        </ul>
                        <ul>
                            <input type="text" id="newProposalInputDesc" value={newProposalDesc} onChange={(e) => setNewProposalDesc(e.target.value)} />
                        </ul>
                        <ul>
                            <Button onPress={addProposal}>Ajouter une proposition ici</Button>
                        </ul>
                    </Col>
                </Row>
            </div>


            <div>
                <Row justify="center">
                    <Col css={{ marginTop: '$4' }}>
                        <u><h1>Liste des propositions</h1></u>
                        <ul>
                            {props.map((prop, index) => (
                                <li key={index}>
                                    <h2><strong>{prop}</strong></h2>
                                    <p>{propsDesc[index]}</p>
                                    <p>Proposition faite par : {creatorProps[index]}</p>
                                    <br></br>
                                </li>
                            ))}
                        </ul>
                    </Col>
                </Row>
            </div>

        </main>
    )
}
