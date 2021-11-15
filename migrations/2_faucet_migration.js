const FaucetContract = artifacts.require('Faucet')

module.exports = function (deplyoer) {
  deplyoer.deploy(FaucetContract)
}
