// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LastroForgeArtifact
 * @dev Artifacts are the core assets. Their value is tied to their provenance.
 */
contract LastroForgeArtifact is ERC721Enumerable, Ownable {
    struct ArtifactRecord {
        string metadataUri;
        uint256 creationTimestamp;
        address[] history; // The Provenance Tree
    }

    mapping(uint256 => ArtifactRecord) public artifactDetails;
    uint256 private _nextTokenId;

    event ArtifactForged(uint256 indexed tokenId, address indexed creator, string metadataUri);
    event ProvenanceUpdated(uint256 indexed tokenId, address indexed formerOwner, address indexed newOwner);

    constructor() ERC721("LastroForge Artifact", "LFA") Ownable(msg.sender) {}

    function forge(address to, string memory uri) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        
        artifactDetails[tokenId].metadataUri = uri;
        artifactDetails[tokenId].creationTimestamp = block.timestamp;
        artifactDetails[tokenId].history.push(to);

        emit ArtifactForged(tokenId, to, uri);
        return tokenId;
    }

    // Overriding transfer to track history
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = super._update(to, tokenId, auth);
        
        if (from != address(0) && to != address(0)) {
            artifactDetails[tokenId].history.push(to);
            emit ProvenanceUpdated(tokenId, from, to);
        }
        
        return from;
    }

    function getHistory(uint256 tokenId) public view returns (address[] memory) {
        return artifactDetails[tokenId].history;
    }
}
