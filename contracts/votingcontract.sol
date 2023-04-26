// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Voting {

    mapping(address => bool) public hasVoted; // Mapping pour stocker si une adresse a déjà voté
    mapping(string => uint256) public voteCount; // Mapping pour stocker le nombre de votes par proposition
    string[] public proposals; // Tableau pour stocker les propositions
    address[] public voters; // Tableau pour stocker les adresses des votants

    constructor() {

    }


    // Fonction pour voter pour une proposition
    function vote(string memory proposal) public {

        require(!hasVoted[msg.sender], "You have already voted"); // Verifie que l'adresse du votant n'a pas encore participee au vote
        require(isProposalExists(proposal), "Invalid proposal"); // Verifie que la proposition existe

        voteCount[proposal]++; // Incremente le nombre de votes pour la proposition donnée
        hasVoted[msg.sender] = true; // Marque l'adresse de l'électeur comme ayant voté
        voters.push(msg.sender);

    }


    // Fonction pour ajouter une proposition au tableau de propositions
    function addProposal(string memory proposal) public {

        require(bytes(proposal).length > 0, "Proposal name cannot be empty"); // Verifie que le nom de la proposition n'est pas vide
        require(!isProposalExists(proposal), "Proposal already exists"); // Verifie que la proposition n'existe pas deja
        proposals.push(proposal); // Ajoute la proposition au tableau de propositions

        getProposals(); //appel a getProposals() pour maj l'interface visible par l'user de la liste

    }




    // Fonction pour obtenir le nombre de votes pour une proposition donnee
    function getVoteCount(string memory proposal) public view returns (uint256) {
        require(isProposalExists(proposal), "Invalid proposal"); // Verifie que la proposition existe
        return voteCount[proposal]; // Retourne le nombre de votes pour la proposition donnee
    }


    //Fonction pour afficher toutes les propositions
    function getProposals() public view returns (string[] memory) {
        return proposals;
    }

    //Fonction pour afficher tous les votants (adresses)
    function getVoters() public view returns (address[] memory) {
        return voters;
    }


    // Fonction pour afficher les resultats des votes
    function getResultats() public view returns (string[] memory, uint256[] memory) {

        uint256[] memory voteCounts = new uint256[](proposals.length); // Tableau pour stocker le nombre de votes pour chaque proposition

        for (uint256 i = 0; i < proposals.length; i++) {

            voteCounts[i] = voteCount[proposals[i]]; // Obtient le nombre de votes pour chaque proposition

        }

        return (proposals, voteCounts); // Retourne les noms de propositions et les nombres de votes correspondants
    }



    // Fonction pour verifier si une proposition existe deja
    function isProposalExists(string memory proposal) internal view returns (bool) {
        for (uint256 i = 0; i < proposals.length; i++) {
            if (keccak256(bytes(proposals[i])) == keccak256(bytes(proposal))) {
                // Compare le hachage des noms de proposition pour savoir si elles sont identiques
                return true; // Retourne true si la proposition existe deja
            }
        }
        return false; // Retourne false si la proposition n'existe pas
    }
}
