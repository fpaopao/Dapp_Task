//ERC-721是非同质化代币（NFT）的标准接口。
//根据EIP-721，ERC-721标准定义了一组方法，用于管理NFT的所有权、转移和元数据等.
interface IERC721 {
    // 所有权方法
    //返回指定地址的NFT数量；=》owner：查询地址，return 改地址拥有的NFT数量；
    function balanceOf(address owner) external view returns (uint256);
    //返回执行NFT的所有者的地址；=》tokenId：要查询的NFT的标识符，return 改NFT的所有者地址；
    function ownerOf(uint256 tokenId) external view returns (address);
//---------------------------------------------------------------------------------
    // 转移方法
    //安全转移NFT（如果接收地址是合约，则必须实现`onERC721Received`方法,看最下面）； =》form：当前所有者地址；to：新的所有者地址；tokenId:要转移的NFT标识符；data：附加数据，无具体格式，通常是空
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    //转移NFT，不检查接受地址是不是合法，该方法可能存在风险；=》参数和上面一样
    function transferFrom(address from, address to, uint256 tokenId) external;
//------------------------------------------------------------------------------------
    // 授权方法
    //授权你一个地址管理指定的NFT;=》to：被授权的地址，可以转移该NFT，设置为零地址表示取消授权。
    function approve(address to, uint256 tokenId) external;
    //授权或取消授权另一个地址管理该调用者地址的所有NFT；=》operator：被授权或取消授权的地址；approved：true表示授权，false表示取消授权。
    function setApprovalForAll(address operator, bool approved) external;//查询某个NFT的授权地址；=》return：被授权的地址，如果没有被授权，则返回零地址；
    function getApproved(uint256 tokenId) external view returns (address);
    //查询一个地址是否被授权管理另一个地址的所有NFT。=》owner:所有者地址，operator：操作者地址；return：true是被授权
    function isApprovedForAll(address owner, address operator) external view returns (bool);
//-----------------------------------------------------------------------------------------
    // 事件
    //当NFT的所有权转移时触发
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    //当某个NFT的授权地址被设置时触发（包括取消授权）。
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    //当某个操作者被授权或取消授权管理所有NFT时触发
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
}

//如果合约需要接收ERC-721代币（通过`safeTransferFrom`方法），则必须实现以下接口：
interface ERC721TokenReceiver {
    function onERC721Received(
        address _operator,
        address _from,
        uint256 _tokenId,
        bytes calldata _data
    ) external returns (bytes4);
}
//实现此接口的合约必须返回`0x150b7a02`（即`bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`）。