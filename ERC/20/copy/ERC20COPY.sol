// SPDX-License-Identifier: MIT
pragma solidity ~0.8.0;

import {IERC20} from "./IERC20.sol";
import {IERC20Metadata} from "./IERC20Metadata.sol";
import {Context} from "./Context.sol";
import {IERC20Errors} from "./draft-IERC6093.sol";

contract ERC20COPY is Context, IERC20, IERC20Metadata, IERC20Errors {
    string private _name;
    string private _symbol;

    uint256 private _totalSupply;

    mapping(address account => uint256) private _balances;
    //_balances:{
    //    account1:"",
    //    account2:""
    //}

    mapping(address account => mapping(address spender => uint256))
    private _allowances;
    //_allowances:{
    //    account1:{
    //        spender1:"",
    //        spender2:""
    //    },
    //    account2:{
    //        spender21:"",
    //        spender22:""
    //    }
    //}

//设置代币的名称和类型符号
    constructor (string memory name_, string memory symbol_){
        _name = name_;
        _symbol = symbol_;
    }

//返回货币名称
    function name() public view virtual returns (string memory){
        return _name;
    }

//返回货币符号
    function symbol() public view virtual returns (string memory){
        return _symbol;
    }

//精度值，默认是18，对应以太坊单位体系，1 token = 10¹⁸基础单位
    function decimals() public view virtual returns (uint8) {
        return 18;
    }

// 返回代币总量
    function totalSupply() public view virtual returns (uint256){
        return _totalSupply;
    }

//根据地址查询余额
    function balanceOf(address account) public view virtual returns (uint256){
        return _balances[account];
    }

//转移value，从from->to账户
    function _transfer(address from, address to, uint256 value) internal {
        if (from == address(0)) {
            revert ERC20InvalidSender(address(0));
        }
        if (to == address(0)) {
            revert ERC20InvalidReceiver(address(0));
        }
        _update(from, to, value);
    }

//通过from和to地址的零地址检测，实现转账/铸造/销毁三合一处理
    function _update(address from, address to, uint256 value) internal virtual {
        if (from == address(0)) {
            _totalSupply += value;
        } else {
            uint256 fromBalance = _balances[from];
            if (fromBalance < value) {
                revert ERC20InsufficientBalance(from, fromBalance, value);
            }
            unchecked {
                _balances[from] = fromBalance - value;
            }
        }

        if (to == address(0)) {
            unchecked {
                _totalSupply -= value;
            }
        } else {
            unchecked {
                _balances[to] += value;
            }
        }

        emit Transfer(from, to, value);
    }

//to 账户多少value
    function transfer(address to, uint256 value) public view virtual returns (bool){
        address owner = _msgSender();
        _transfer(owner, to, value);
        return true;
    }

    function _approve(address owner, address spender, uint256 value, bool emitEvent) internal virtual {
        if (owner == address(0)) {
            revert ERC20InvalidApprover(address(0));
        }
        if (spender == address(0)) {
            revert ERC20InvalidSpender(address(0));
        }
        _allowances[owner][spender] = value;
        if (emitEvent) {
            emit Approval(owner, spender, value);
        }
    }

//重写方法
    function _approve(address owner, address spender, uint256 value) internal {
        _approve(owner, spender, value, true);
    }

//设置spender可以操作调用者代币的额度为value;
    function approve(address spender, uint256 value) public view virtual returns (bool){
        address owner = _msgSender();
        _approve(owner, spender, value);
        return true;
    }

//查看owner地址类型的
    function allowance(address owner, address spender) public view virtual returns (uint256){
        return _allowances[owner][spender];
    }

//用于在转账后更新授权额度。当用户A授权给用户B一定额度后，用户B使用部分额度时，需要相应减少剩余授权额度
//unchecked{}块是用于‌禁用算术运算溢出检查‌的特性，主要应用于性能优化和特定场景下的数值处理
    function _spendAllowance(address owner, address spender, uint256 value) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance < type(uint256).max) {
            if (currentAllowance < value) {
                revert ERC20InsufficientAllowance(spender, currentAllowance, value);
            }
            unchecked {
                _approve(owner, spender, currentAllowance - value, false);
            }
        }
    }

//通过授权机制从from账户向to账户转移value数量的代币
    function transferFrom(address from, address to, uint256 value) public view virtual returns (bool){
        address spender = _msgSender();
        _spendAllowance(from, spender, value);
        _transfer(from, to, value);
        return true;
    }
//主要用于在 ERC20 代币合约中创建（铸造）新代币
    function _mint(address account, uint256 value) internal {
        if (account == address(0)) {
            revert ERC20InvalidReceiver(address(0));
        }
        _update(address(0), account, value);
    }

//用于销毁（燃烧）指定账户中的代币
    function _burn(address account, uint256 value) internal {
        if (account == address(0)) {
            revert ERC20InvalidSender(address(0));
        }
        _update(account, address(0), value);
    }

}