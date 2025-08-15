export const formatAddress = (address) => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};

export const formatBalance = (balance, decimals = 18) => {
  if (!balance) return "0";
  return (BigInt(balance) / BigInt(10 ** decimals)).toString();
};

export const toWei = (amount, decimals = 18) => {
  return BigInt(Number(amount) * 10 ** decimals);
};
