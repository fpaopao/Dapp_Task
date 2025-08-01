// SPDX-License-Identifier: MIT
pragma solidity ~0.8.0;
import {IERC20} from "../ERC20/ERC20.SOL";
import {IERC20Metadata} from "../ERC20/IERC20Metadata.sol";

contract MyToken is ERC20, IERC20Metadata {
    string private _name = "MyToken";
    string private _symbol = "MTK";
    uint8 private _decimals = 18;

    function name() public view override returns (string memory) {
        return _name;
    }
    
    function symbol() public view override returns (string memory) {
        return _symbol;
    }
    
    function decimals() public view override returns (uint8) {
        return _decimals;
    }
}
