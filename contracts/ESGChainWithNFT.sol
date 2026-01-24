// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ESGChainWithNFT
 * @dev Enhanced smart contract for ESG data with NFT certificate minting
 */
contract ESGChainWithNFT {

    struct ESGData {
        string companyName;
        string batchId;
        uint256 emissions; // in tCO2e (multiplied by 100 to handle decimals)
        string energySource;
        uint256 timestamp;
        address submitter;
        bool exists;
        uint256 certificateId; // NFT certificate ID if minted
    }

    struct Certificate {
        uint256 id;
        bytes32 recordHash;
        string companyName;
        uint256 totalEmissions;
        uint256 recordCount;
        uint256 mintedAt;
        address owner;
        string achievementLevel; // "Bronze", "Silver", "Gold", "Platinum"
    }

    // Mappings
    mapping(bytes32 => ESGData) public esgRecords;
    mapping(uint256 => Certificate) public certificates;
    mapping(address => uint256[]) public companyCertificates;
    mapping(address => uint256) public companyTotalEmissions;
    mapping(address => uint256) public companyRecordCount;

    // Arrays
    bytes32[] public recordHashes;
    uint256 public certificateCounter;

    // Events
    event ESGDataSubmitted(
        bytes32 indexed recordHash,
        string companyName,
        string batchId,
        uint256 emissions,
        string energySource,
        uint256 timestamp,
        address submitter
    );

    event CertificateMinted(
        uint256 indexed certificateId,
        address indexed owner,
        string companyName,
        string achievementLevel,
        uint256 totalEmissions,
        uint256 recordCount
    );

    /**
     * @dev Submit ESG data to the blockchain
     */
    function submitESGData(
        string memory _companyName,
        string memory _batchId,
        uint256 _emissions,
        string memory _energySource
    ) public returns (bytes32) {
        bytes32 recordHash = keccak256(
            abi.encodePacked(
                _companyName,
                _batchId,
                _emissions,
                _energySource,
                block.timestamp,
                msg.sender
            )
        );

        require(!esgRecords[recordHash].exists, "Record already exists");

        esgRecords[recordHash] = ESGData({
            companyName: _companyName,
            batchId: _batchId,
            emissions: _emissions,
            energySource: _energySource,
            timestamp: block.timestamp,
            submitter: msg.sender,
            exists: true,
            certificateId: 0
        });

        recordHashes.push(recordHash);

        // Update company stats
        companyTotalEmissions[msg.sender] += _emissions;
        companyRecordCount[msg.sender] += 1;

        emit ESGDataSubmitted(
            recordHash,
            _companyName,
            _batchId,
            _emissions,
            _energySource,
            block.timestamp,
            msg.sender
        );

        return recordHash;
    }

    /**
     * @dev Mint NFT certificate for ESG achievements
     */
    function mintCertificate(
        bytes32 _recordHash,
        string memory _companyName
    ) public returns (uint256) {
        require(esgRecords[_recordHash].exists, "Record does not exist");
        require(esgRecords[_recordHash].submitter == msg.sender, "Not record owner");
        require(esgRecords[_recordHash].certificateId == 0, "Certificate already minted");

        certificateCounter++;
        uint256 newCertificateId = certificateCounter;

        uint256 totalEmissions = companyTotalEmissions[msg.sender];
        uint256 recordCount = companyRecordCount[msg.sender];

        // Determine achievement level based on records
        string memory level = "Bronze";
        if (recordCount >= 50) {
            level = "Platinum";
        } else if (recordCount >= 25) {
            level = "Gold";
        } else if (recordCount >= 10) {
            level = "Silver";
        }

        certificates[newCertificateId] = Certificate({
            id: newCertificateId,
            recordHash: _recordHash,
            companyName: _companyName,
            totalEmissions: totalEmissions,
            recordCount: recordCount,
            mintedAt: block.timestamp,
            owner: msg.sender,
            achievementLevel: level
        });

        companyCertificates[msg.sender].push(newCertificateId);
        esgRecords[_recordHash].certificateId = newCertificateId;

        emit CertificateMinted(
            newCertificateId,
            msg.sender,
            _companyName,
            level,
            totalEmissions,
            recordCount
        );

        return newCertificateId;
    }

    /**
     * @dev Verify ESG data
     */
    function verifyESGData(bytes32 _recordHash)
        public
        view
        returns (
            bool exists,
            string memory companyName,
            string memory batchId,
            uint256 emissions,
            string memory energySource,
            uint256 timestamp,
            address submitter
        )
    {
        ESGData memory data = esgRecords[_recordHash];
        return (
            data.exists,
            data.companyName,
            data.batchId,
            data.emissions,
            data.energySource,
            data.timestamp,
            data.submitter
        );
    }

    /**
     * @dev Get certificate details
     */
    function getCertificate(uint256 _certificateId)
        public
        view
        returns (
            uint256 id,
            string memory companyName,
            uint256 totalEmissions,
            uint256 recordCount,
            uint256 mintedAt,
            address owner,
            string memory achievementLevel
        )
    {
        Certificate memory cert = certificates[_certificateId];
        return (
            cert.id,
            cert.companyName,
            cert.totalEmissions,
            cert.recordCount,
            cert.mintedAt,
            cert.owner,
            cert.achievementLevel
        );
    }

    /**
     * @dev Get company's certificates
     */
    function getCompanyCertificates(address _company)
        public
        view
        returns (uint256[] memory)
    {
        return companyCertificates[_company];
    }

    /**
     * @dev Get company stats
     */
    function getCompanyStats(address _company)
        public
        view
        returns (uint256 totalEmissions, uint256 recordCount)
    {
        return (companyTotalEmissions[_company], companyRecordCount[_company]);
    }

    /**
     * @dev Get total number of records
     */
    function getTotalRecords() public view returns (uint256) {
        return recordHashes.length;
    }

    /**
     * @dev Get record hash by index
     */
    function getRecordHashByIndex(uint256 _index) public view returns (bytes32) {
        require(_index < recordHashes.length, "Index out of bounds");
        return recordHashes[_index];
    }
}
