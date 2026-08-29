// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OraclePolicy {
    struct Policy {
        uint256 maxTradeAmount;
        uint256 minConfidence; // 0 to 100
        uint256 minEdge; // 0 to 100
        bool autoExecute;
    }

    mapping(address => Policy) public policies;

    event PolicyUpdated(
        address indexed user,
        uint256 maxTradeAmount,
        uint256 minConfidence,
        uint256 minEdge,
        bool autoExecute
    );

    function setPolicy(
        uint256 _maxTradeAmount,
        uint256 _minConfidence,
        uint256 _minEdge,
        bool _autoExecute
    ) external {
        policies[msg.sender] = Policy({
            maxTradeAmount: _maxTradeAmount,
            minConfidence: _minConfidence,
            minEdge: _minEdge,
            autoExecute: _autoExecute
        });

        emit PolicyUpdated(msg.sender, _maxTradeAmount, _minConfidence, _minEdge, _autoExecute);
    }

    function getPolicy(address _user) external view returns (Policy memory) {
        return policies[_user];
    }
}
