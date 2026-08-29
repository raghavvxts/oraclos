// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {OraclePolicy} from "../src/OraclePolicy.sol";

contract OraclePolicyTest is Test {
    OraclePolicy public policy;

    function setUp() public {
        policy = new OraclePolicy();
    }

    function test_SetAndGetPolicy() public {
        policy.setPolicy(20, 85, 10, true);
        
        OraclePolicy.Policy memory p = policy.getPolicy(address(this));
        
        assertEq(p.maxTradeAmount, 20);
        assertEq(p.minConfidence, 85);
        assertEq(p.minEdge, 10);
        assertTrue(p.autoExecute);
    }
}
