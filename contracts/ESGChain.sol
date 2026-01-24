// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ESGChain
 * @dev Smart contract for storing and verifying ESG (Environmental, Social, Governance) data on blockchain
 */
contract ESGChain {
    
    struct ESGData {
        string companyName;
        string batchId;
        uint256 emissions; // in tCO2e (multiplied by 100 to handle decimals)
        string energySource;
        uint256 timestamp;
        address submitter;
        bool exists;
    }
    
    // Mapping from transaction hash to ESG data
    mapping(bytes32 => ESGData) public esgRecords;
    
    // Array to store all record hashes for enumeration
    bytes32[] public recordHashes;
    
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
    
    event ESGDataVerified(
        bytes32 indexed recordHash,
        address verifier,
        uint256 timestamp
    );
    
    /**
     * @dev Submit ESG data to the blockchain
     * @param _companyName Name of the company
     * @param _batchId Unique batch identifier
     * @param _emissions Carbon emissions in tCO2e (multiplied by 100)
     * @param _energySource Type of energy source used
     * @return recordHash The unique hash for this record
     */
    function submitESGData(
        string memory _companyName,
        string memory _batchId,
        uint256 _emissions,
        string memory _energySource
    ) public returns (bytes32) {
        // Generate unique hash for this record
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
        
        // Ensure record doesn't already exist
        require(!esgRecords[recordHash].exists, "Record already exists");
        
        // Store the ESG data
        esgRecords[recordHash] = ESGData({
            companyName: _companyName,
            batchId: _batchId,
            emissions: _emissions,
            energySource: _energySource,
            timestamp: block.timestamp,
            submitter: msg.sender,
            exists: true
        });
        
        // Add to array for enumeration
        recordHashes.push(recordHash);
        
        // Emit event
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
     * @dev Verify if ESG data exists and retrieve it
     * @param _recordHash The hash of the record to verify
     * @return exists Whether the record exists
     * @return companyName Company name from the record
     * @return batchId Batch ID from the record
     * @return emissions Emissions value
     * @return energySource Energy source type
     * @return timestamp When the record was created
     * @return submitter Address that submitted the record
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
     * @dev Get total number of records
     * @return Total count of ESG records
     */
    function getTotalRecords() public view returns (uint256) {
        return recordHashes.length;
    }
    
    /**
     * @dev Get record hash by index
     * @param _index Index in the recordHashes array
     * @return Record hash at the given index
     */
    function getRecordHashByIndex(uint256 _index) public view returns (bytes32) {
        require(_index < recordHashes.length, "Index out of bounds");
        return recordHashes[_index];
    }
}
