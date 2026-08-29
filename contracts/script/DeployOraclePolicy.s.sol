// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {OraclePolicy} from "../src/OraclePolicy.sol";

contract DeployOraclePolicy is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        OraclePolicy policy = new OraclePolicy();
        console.log("OraclePolicy deployed to:", address(policy));

        vm.stopBroadcast();
    }
}
