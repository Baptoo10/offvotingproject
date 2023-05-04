// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Voting {

    mapping(address => bool) public hasVoted; // Mapping pour stocker si une adresse a deja vote
    mapping(string => uint256) public voteCount; // Mapping pour stocker le nombre de votes par proposition
    string[] public proposals; // Tableau pour stocker les propositions
    //address[] public voters; // Tableau pour stocker les adresses des votants
    bool public endVote=false;


    struct prop{
        int256 id;
        bool isActive;
        string props;
        string propsdesc;
        address creatorprops;
        uint256 NumberVotes;
        address[] whoVoted;
    }

    prop[] public proptabl;

    mapping(address => prop) public propcreator;
    mapping(string => prop) public propname;

    // Compteur d'ID pour les propositions
    int256 public propCount=-1;

    constructor() {

    }

    //////////////////////////////////////////////////////////////////////////////////////////

    // Fonction pour ajouter une proposition au tableau de propositions
    function addProposal(string memory proposal, string memory desc) public {

        require(endVote==false, "Le vote est termine");
        require(bytes(proposal).length > 0, "Proposal name cannot be empty"); // Verifie que le nom de la proposition n'est pas vide
        require(!isProposalExists(proposal), "Proposal already exists"); // Verifie que la proposition n'existe pas deja

        propCount++;
        bool active = true;
        prop memory padd = prop(propCount, active, proposal, desc, msg.sender, 0, new address[](0));
        propcreator[msg.sender] = padd;
        propname[proposal] = padd;

        proptabl.push(padd);
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    function removeProposal(string memory proposal) public returns (bool) {
        require(endVote==false, "Le vote est termine");
        for (uint256 i = 0; i < proptabl.length; i++) {
            // Acceder a la proposition à l'indice i
            prop memory proposition = proptabl[i];

            if (keccak256(abi.encodePacked(proposition.props)) == keccak256(abi.encodePacked(proposal))) {
                // require(proposition.isActive == true, "Proposal already removed");
                proptabl[i].isActive = false;
                return true;
            }
        }

        // Si la proposition n'est pas trouvee, retourner false
        return false;
    }

    function removeProposalById(uint256 indexProp) public returns (bool) {
        require(endVote == false, "Le vote est termine");

        if (proptabl[indexProp].isActive) {
            proptabl[indexProp].isActive = false;
            return true;
        }

        // Si la proposition n'est pas trouvée, retourner false
        return false;
    }


    //////////////////////////////////////////////////////////////////////////////////////////

    //function to have the full proposal (prop, desc, creator prop)
    function getFullProps() public view returns (int256[] memory, string[] memory, string[] memory, address[] memory, uint256[] memory, address[][] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < proptabl.length; i++) {
            if (proptabl[i].isActive) {
                count++;
            }
        }

        int256[] memory id = new int256[](count);
        string[] memory props = new string[](count);
        string[] memory propsdesc = new string[](count);
        address[] memory creatorprops = new address[](count);
        uint256[] memory numVotes = new uint256[](count);
        address[][] memory votedBy = new address[][](count);

        uint256 index = 0;
        for (uint256 i = 0; i < proptabl.length; i++) {
            if (proptabl[i].isActive) {
                id[index] = proptabl[i].id;
                props[index] = proptabl[i].props;
                propsdesc[index] = proptabl[i].propsdesc;
                creatorprops[index] = proptabl[i].creatorprops;
                numVotes[index] = proptabl[i].NumberVotes;
                votedBy[index] = proptabl[i].whoVoted;
                index++;
            }
        }

        return (id, props, propsdesc, creatorprops, numVotes, votedBy);
    }


    //function to get the full proposal (prop, desc, creator prop)
    function getFullPropById(uint256 indexProp) public view returns (int256[] memory, string[] memory, string[] memory, address[] memory, uint256[] memory, address[][] memory) {

        int256[] memory id = new int256[](1);
        string[] memory props = new string[](1);
        string[] memory propsdesc = new string[](1);
        address[] memory creatorprops = new address[](1);
        uint256[] memory numVotes = new uint256[](1);
        address[][] memory votedBy = new address[][](1);

        if (proptabl[indexProp].isActive) {
            id[0] = proptabl[indexProp].id;
            props[0] = proptabl[indexProp].props;
            propsdesc[0] = proptabl[indexProp].propsdesc;
            creatorprops[0] = proptabl[indexProp].creatorprops;
            numVotes[0] = proptabl[indexProp].NumberVotes;
            votedBy[0] = proptabl[indexProp].whoVoted;
        }

        return (id, props, propsdesc, creatorprops, numVotes, votedBy);
    }


    //////////////////////////////////////////////////////////////////////////////////////////

    // Fonction pour voter pour une proposition
    function vote(string memory proposal) public {

        require(endVote==false, "Le vote est termine");
        require(!hasVoted[msg.sender], "You have already voted"); // Verifie que l'adresse du votant n'a pas encore participee au vote
        require(isProposalExists(proposal), "Invalid proposal"); // Verifie que la proposition existe

        for (uint256 i = 0; i < proptabl.length; i++) {
            // Acceder a la proposition a l'indice i
            prop storage proposition = proptabl[i];

            if (keccak256(abi.encodePacked(proposition.props)) == keccak256(abi.encodePacked(proposal))) {
                //require(proposition.isActive == true, "Proposal not existing");
                hasVoted[msg.sender] = true;
                proposition.whoVoted.push(msg.sender);
                proposition.NumberVotes += 1;
            }
        }
    }

    // Fonction pour voter pour une proposition
    function voteById(uint256 indexProp) public {

        require(endVote==false, "Le vote est termine");
        require(!hasVoted[msg.sender], "You have already voted"); // Verifie que l'adresse du votant n'a pas encore participee au vote
        require(indexProp < proptabl.length, "Invalid proposal ID"); // Vérifie que l'ID de proposition est valide

        // Accéder à la proposition à l'indice propId
        prop storage proposition = proptabl[indexProp];

        require(proposition.isActive == true, "Proposal not existing");

        hasVoted[msg.sender] = true;
        proposition.whoVoted.push(msg.sender);
        proposition.NumberVotes += 1;
    }


    //////////////////////////////////////////////////////////////////////////////////////////


    // Fonction pour obtenir le nombre de votes pour une proposition donnee
    function getVoteCount(string memory proposal) public view returns (uint256) {

        //verification if la proposal existe
        for (uint256 i = 0; i < proptabl.length; i++) {
            // Accéder à la proposition à l'indice i
            prop storage proposition = proptabl[i];

            if (keccak256(abi.encodePacked(proposition.props)) == keccak256(abi.encodePacked(proposal))) {
                require(proposition.isActive == true, "Proposal not existing");
                return proposition.NumberVotes; // Retourne le nombre de votes pour la proposition "proposal" entree en parametre
            }
        }

        return 0; // Retourne 0 sinon
    }

    // Fonction pour obtenir le nombre de votes pour une proposition donnee
    function getVoteCountById(uint256 indexProp) public view returns (uint256) {

        require(indexProp < proptabl.length, "Invalid proposal"); // Verifie que l'identifiant de proposition existe

        prop storage proposition = proptabl[indexProp];
        require(proposition.isActive == true, "Proposal not existing");

        return proposition.NumberVotes; // Retourne le nombre de votes pour la proposition avec l'identifiant "proposalId"

    }

    //////////////////////////////////////////////////////////////////////////////////////////


    // Fonction pour verifier si une proposition existe deja
    function isProposalExists(string memory proposal) internal view returns (bool) {
        for (uint256 i = 0; i < proptabl.length; i++) {
            if (keccak256(bytes(proptabl[i].props)) == keccak256(bytes(proposal)) && proptabl[i].isActive) {
                return true;
            }
        }
        return false; // Retourne false si la proposition n'existe pas
    }

    // Fonction pour verifier si une proposition existe deja
    function isProposalExistsById(uint256 indexProp) internal view returns (bool) {
        if (indexProp <= proptabl.length && proptabl[indexProp].isActive) {
            return true;
        }
        return false; // Retourne false si la proposition n'existe pas
    }

    //////////////////////////////////////////////////////////////////////////////////////////


    //Fonction pour afficher tous les votants (adresses)
    function getVoters() public view returns (address[] memory) {
        uint256 count = 0;

        for (uint256 i = 0; i < proptabl.length; i++) {
            if (proptabl[i].isActive) {
                count += proptabl[i].whoVoted.length;
            }
        }

        address[] memory voters = new address[](count); // Tableau pour stocker les adresses des votants
        uint256 index = 0;

        for (uint256 i = 0; i < proptabl.length; i++) {
            if (proptabl[i].isActive) {
                prop storage proposition = proptabl[i];
                for (uint256 j = 0; j < proposition.whoVoted.length; j++) {
                    voters[index] = proposition.whoVoted[j];
                    index++;
                }
            }
        }

        return voters;
    }



    // Fonction pour afficher les resultats des votes
    function getResultats() public view returns (string[] memory) {

        require(endVote == true, "Le vote n'est pas encore termine");


        uint256 maxVotes = 0;
        uint256 count = 0;
        string[] memory winningProposal;
        winningProposal = new string[](proptabl.length);

        //search for the max votes proposal
        for (uint256 i = 0; i < proptabl.length; i++) {
            if (proptabl[i].isActive && proptabl[i].NumberVotes > maxVotes) {
                maxVotes = proptabl[i].NumberVotes;
            }
        }

        //search for egal max votes proposal
        for (uint256 i = 0; i < proptabl.length; i++) {
            if (proptabl[i].isActive && proptabl[i].NumberVotes == maxVotes) {
                count++;
                winningProposal[count-1] = proptabl[i].props;
            }
        }

        //on retourne le/les gagnants
        return winningProposal;
    }

    //function pour finir le vote
    function endVoteFunction() public {
        require(msg.sender==0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, "vous n'avez pas les privileges pour arreter le vote"); //account 2 on hardhat
        endVote=true;
    }

    //function pour finir le vote
    function newVoteFunction() public {
        require(msg.sender==0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266, "vous n'avez pas les privileges pour refaire un vote"); //account 2 on hardhat
        endVote=false;

        for (uint256 i = 0; i < proposals.length; i++) {
            delete voteCount[proposals[i]];
        }

        delete proposals;

        address[] memory voters = getVoters();

        for (uint256 i = 0; i < voters.length; i++) {
            hasVoted[voters[i]] = false;
        }


        while(proptabl.length > 0) {
            // supprimer toutes les propositions du tableau
            proptabl.pop();
        }

    }

}

