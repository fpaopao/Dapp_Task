// SPDX-License-Identifier: MIT
pragma solidity ~0.8.0;

interface IERC20COPY {

    // 返回代币总量
    function totalSupply() external view returns (uint256);

    // 查看eth地址的的余额；
    // account：查询eth的地址
    function balanceOf(address account) external view returns (uint256);

    // 将value数量的代币从调用者账户转移到to账户
    // to：接收者的地址
    // value：转移的数量
    function transfer(address to, uint256 value) external returns (bool);

    // 设置spender可以操作调用者代币的额度为value;
    // spender：被授权操作地址
    // value：被授权操作的额度
    function approve(address spender, uint256 value) external returns (bool);

    // 返回spender被允许代表owner通过{transferFrom}花费的剩余代币数量
    // owner：代币持有者地址
    // spender：被查询的授权地址
    function allowance(address owner, address spender) external returns (uint256);

    //通过授权机制从from账户向to账户转移value数量的代币。转移的代币将从调用者的授权额度中扣除；
    // from：转出地址（需余额≥value）
    // to：接收地址
    // value：转账数量（需≤授权额度）
    function transferFrom(address from, address to, uint256 value) external returns (bool);

//    value从一个账户到另一个账户的时候触发
    event Transfer(address indexed from, address indexed to, uint256 value);

//    当通过调用{approve}设置spender对owner的授权额度时触发。value是新设置的授权额度
    event Approval(address indexed owner, address indexed spender, uint256 value);

}