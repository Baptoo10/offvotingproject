"use client";
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
//import {Link, useLocation} from 'react-router-dom';


//Voting contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
import VotingABI from '../artifacts/contracts/votingcontract.sol/Voting.json'
import {Button, Col, Row} from "@nextui-org/react";
import Link from "next/link";
const VotingAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3' //ADDRESS


export default function Proplink() {

    const [proposals, setProposals] = useState([]); // State pour stocker les propositions récupérées
    const [props, setProps] = useState('');
    const [propsDesc, setPropsDesc] = useState('');
    const [creatorProps, setCreatorProps] = useState('')
    const [numVotes, setNumVotes] = useState('');
    const [whoVoted, setWhoVoted] = useState([]);

    let indexN;

    if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const index = params.get('index');
        indexN = index;
        console.log(index);
    }

    async function requestAccount() {
       await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    function numVotesFunction() {

        if (!numVotes || numVotes === "0") {
            return 0;
        } else {
            return numVotes;
        }

    }


    async function vote() {

        console.log("coucouvote32");

       await requestAccount();

        if (typeof window.ethereum !== 'undefined') {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(VotingAddress, VotingABI.abi, signer);
                const transaction = await contract.voteById(indexN);
                console.log('Vote submitted');
            } catch (error) {
                console.error('Erreur lors du vote : ', error);
            }
        } else {
            console.error(
                'Web3 non disponible. Veuillez installer MetaMask pour interagir avec cette fonction.'
            );
        }

    }




    console.log(indexN);
    console.log("props ==> ", {props});
    console.log("votesNum ==> ", {numVotesFunction});

    useEffect(() => {

       /* const params = new URLSearchParams(window.location.search);
        const index = params.get('index');
        indexN = index;
        console.log(index);
*/
        console.log('Fetching proposals...');
        async function fetchData() {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(VotingAddress, VotingABI.abi, signer);
            const [propsData, propsDescData, creatorPropsData, numVotesData, votedByData] = await contract.getFullPropById(indexN);

            setProps(propsData);
            setPropsDesc(propsDescData);
            setCreatorProps(creatorPropsData);
            setNumVotes(parseInt(numVotesData));
            setWhoVoted(votedByData);
        }

        fetchData();
    }, []);

    return (
    <div>
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

            <div>
                <div style={{ display: 'grid', justifyContent: 'center' }} >
                    <Row justify="center" css={{ marginTop: '$4' }}>
                        <Col>
                            <div style={{ color: 'black', backgroundColor: 'white', padding: '16px', borderRadius: '4px', width: '50vw' }}>
                                <u><h1 align={"center"}>{props}</h1></u>
                                <br/>
                                <ul>
                                    <p><b>Description de la proposition :</b> {propsDesc}</p>
                                    <p><b>Proposition faite par :</b> {creatorProps}</p>
                                    <p>Il y a actuellement {numVotesFunction()} voix pour la proposition</p>
                                    <button onPress={vote}>Voter pour</button>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
    </div>
    );
}
