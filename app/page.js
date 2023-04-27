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
import Voting from './artifacts/contracts/votingcontract.sol/Voting.json' //ABI
const votingAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3' //ADDRESS

export default function Home() {

    const [newProposal, setNewProposal] = useState(""); // State pour stocker la nouvelle proposition
    const [proposals, setProposals] = useState([]); // State pour stocker les propositions récupérées

    let state = {
        voters:[],
        proposals:[],
    };

    useEffect(()=>{
        console.log("Fetching proposals...");
        getProposal();
    }, [])

    async function requestAccount(){
        await window.ethereum.request({method: 'eth_requestAccounts'})
    }

    async function getProposal(){
        console.log("Getting proposals...");
       // await requestAccount();
        if (typeof window.ethereum !== 'undefined') {

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const Constvotingcontract = new ethers.Contract(votingAddress, Voting.abi, provider);

            try {
                const data = await Constvotingcontract.getProposals();
                console.log("Proposals fetched:", data);

                setProposals(data);
            } catch (error) {
                console.error("Probleme lors de l'affichage des votant : ", error);
            }
        }
    }


    async function addProposal() {
        await requestAccount();
        console.log(newProposal);
        if(!newProposal) return
        if (typeof window.ethereum !== 'undefined') {
            try {
                console.log(newProposal);
                // Se connecter au fournisseur Web3 (MetaMask)
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                //Signer le contrat
                const signer = provider.getSigner();
                // Créer une instance du contrat Voting
                const votingContract = new ethers.Contract(votingAddress, Voting.abi, signer);
                // Appeler la fonction Solidity pour ajouter une nouvelle proposition
                const transaction = await votingContract.addProposal(newProposal);

                //this.state.proposals.push(newProposal);
                console.log("coucou");
                // Réinitialiser le champ pour la nouvelle proposition
                setNewProposal("");
                //await transaction.wait();
                getProposal()
            } catch (error) {
                console.error("Erreur lors de l'ajout de la proposition : ", error);
            }
        } else {
            console.error("Web3 non disponible. Veuillez installer MetaMask pour interagir avec cette fonction.");
        }
    }


    function handleNewProposal(event) {
        setNewProposal(event.target.value);
        // event.target.value contient la valeur du champ de saisie de la nouvelle proposition
        setProposals([...proposals, event.target.value]);
    }



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
                        <input type="text" id="newProposalInput" value={newProposal} onChange={(e) => setNewProposal(e.target.value)} />
                        <Button onPress={addProposal}>Ajouter une proposition ici</Button>
                    </Col>
                </Row>
            </div>


            <div>
                <Row justify="center">
                    <Col css={{ marginTop: '$4' }}>
                        <h2>Liste des propositions</h2>
                        <ul>
                            {proposals.map((proposal, index) => (
                                <li key={index}>{proposal}</li>
                            ))}
                        </ul>
                    </Col>
                </Row>
            </div>

        </main>
    )
}
