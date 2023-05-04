"use client";
import React, { useState, useEffect } from 'react';
import {BigNumber, ethers} from 'ethers';
import { useRouter } from 'next/navigation';
//import { useRouter } from 'next/router';
//import {Link, useLocation} from 'react-router-dom';
import {Button, Col, Row} from "@nextui-org/react";
import Link from "next/link";


//Voting contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
import VotingABI from '../artifacts/contracts/votingcontract.sol/Voting.json'
const VotingAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' //ADDRESS


export default function Proplink() {

    const [proposals, setProposals] = useState([]); // State pour stocker les propositions récupérées
    const [props, setProps] = useState('');
    const [propsDesc, setPropsDesc] = useState('');
    const [creatorProps, setCreatorProps] = useState('')
    const [numVotes, setNumVotes] = useState('');
    const [whoVoted, setWhoVoted] = useState([]);
    const [indexProp, setIndexProp] = useState([]);

    //if (typeof window !== 'undefined') {
    /*     const params = new URLSearchParams(window.location.search);
         console.log("params : ", params);
         console.log("window: ", window);
         const index = params.get('index');
         setIndexProp(index);
         console.log(indexProp);
    */// }
    /*
    let indexN;
    const router = useRouter();
    const {index} = router.query;
    indexN={index};*/

    /*
        const params = new URLSearchParams(window.location.search);
        const index = params.get('index');
        if (index!==null) {
            indexN =  BigNumber.from(index);//parseInt(index);
        } else {
            location.assign('/proplink?index=' + index);
            //location.reload();//indexN = 0;
        }
        console.log(indexN);*/


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


    async function voteById() {
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
                console.log("index N = ", index);

                await contract.voteById(index); /* indexN doit être défini quelque part */
                console.log('Vote soumis');
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
    let index;
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        console.log("params : ", params);
        console.log("window: ", window);
        index = params.get('index');
    });
    /*useEffect(() => {
        setIndexProp(index);
    });
    console.log(indexProp);/*
    useEffect(() => {
        /*const params = new URLSearchParams(window.location.search);
        const index = params.get('index');
        setIndexProp(index);
        const params = new URLSearchParams(window.location.search);
        console.log("params : ", params);
        console.log("window: ", window);
        const index = params.get('index');
        setIndexProp(index);
        console.log(indexProp);
    }, []);*/

    console.log(index);
    console.log("props ==> ", {props});
    console.log("votesNum ==> ", {numVotes});

    useEffect(() => {
        console.log('Fetching proposals...');
        async function fetchData() {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(VotingAddress, VotingABI.abi, signer);
            const [indexProp, props, propsDesc, creatorProps, numVotes, votedBy] = await contract.getFullPropById(index);

            setIndexProp(parseInt(indexProp));
            setProps(props);
            setPropsDesc(propsDesc);
            setCreatorProps(creatorProps);
            setNumVotes(parseInt(numVotes));
            setWhoVoted(votedBy);
        }

        fetchData();
    }, [index]);



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
                                    <button onClick={voteById}>Voter pour</button>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
}
