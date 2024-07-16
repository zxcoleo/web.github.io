

// CONNECT METAMASK Y CAMBIO DE BOTON BUY NOW
async function connectMetamask() {
    try {
        // Solicitar conexión a Metamask
        await ethereum.request({ method: 'eth_requestAccounts' });

        // Verificar la red actual
        const chainId = await ethereum.request({ method: 'eth_chainId' });

        // Si la red actual no es BNB, intentar cambiar a BNB
        if (chainId !== '0x38') {
            await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: '0x38', // BNB chain ID
                    chainName: 'Binance Smart Chain',
                    nativeCurrency: {
                        name: 'BNB',
                        symbol: 'BNB',
                        decimals: 18
                    },
                    rpcUrls: ['https://bsc-dataseed.binance.org/'],
                    blockExplorerUrls: ['https://bscscan.com/']
                }]
            });
        }

        // Si la conexión y el cambio de red son exitosos, ocultar connectwalletBtn y mostrar buynowBtn
        if (await ethereum.request({ method: 'eth_chainId' }) === '0x38') {
            document.getElementById('connectwalletBtn').style.display = 'none';
            document.getElementById('buynowBtn').style.display = 'block';
            var modal = document.getElementById('hiddenContent');
            modal.style.display = 'none'; // Ocultar la ventana modal
        }

    } catch (error) {
        console.error('Error connecting to Metamask or changing network:', error);
        // Si ocurre un error, no cambiar los botones
    }
}
  
// FIN CONNECT METAMASK Y CAMBIO DE BOTON BUY NOW
  

  


// BUY WITH ETH Y BUY WITH BNB


const buywithEthButton = document.getElementById('buywithEthButton');
const buywithBnbButton = document.getElementById('buywithBnbButton');

const ethereumNetwork = {
  chainId: '0x1', // Mainnet
};

const bnbNetwork = {
  chainId: '0x38', // BSC Mainnet
};

async function switchNetwork(networkParams) {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [networkParams],
    });

    // Cambiar botones solo si el cambio de red es exitoso
    if (networkParams.chainId === ethereumNetwork.chainId) {
      buywithEthButton.style.display = 'none';
      buywithBnbButton.style.display = 'block';
    } else if (networkParams.chainId === bnbNetwork.chainId) {
      buywithBnbButton.style.display = 'none';
      buywithEthButton.style.display = 'block';
    }

  } catch (switchError) {
    // Este código de error indica que la red no ha sido añadida a MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networkParams],
        });

        // Cambiar botones solo si el cambio de red es exitoso
        if (networkParams.chainId === ethereumNetwork.chainId) {
          buywithEthButton.style.display = 'none';
          buywithBnbButton.style.display = 'block';
        } else if (networkParams.chainId === bnbNetwork.chainId) {
          buywithBnbButton.style.display = 'none';
          buywithEthButton.style.display = 'block';
        }
      } catch (addError) {
        console.error(addError);
      }
    } else {
      console.error(switchError);
    }
  }
}

buywithEthButton.addEventListener('click', async () => {
  // Cambiar a la red de Ethereum
  console.log('Conectando a la red de Ethereum...');
  await switchNetwork(ethereumNetwork);
});

buywithBnbButton.addEventListener('click', async () => {
  // Cambiar a la red de BNB
  console.log('Conectando a la red de BNB...');
  await switchNetwork(bnbNetwork);
});

  // FIN BUY WITH ETH Y BUY WITH BNB



// BOTONES DE SELECCION

// Función para verificar y ajustar la visibilidad de los botones según la red actual
async function checkNetworkAndAdjustButtons() {
    try {
        // Esperamos a que MetaMask esté disponible
        await window.ethereum.enable();

        // Obtenemos la red actual
        const networkId = await ethereum.request({ method: 'net_version' });

        // Determinamos qué botones mostrar u ocultar
        if (networkId === '1') {
            // Red Ethereum Mainnet
            document.getElementById('ethButton').style.display = 'block';
            document.getElementById('bnbButton').style.display = 'none';
        } else if (networkId === '56') {
            // Red Binance Smart Chain Mainnet (por ejemplo)
            document.getElementById('ethButton').style.display = 'none';
            document.getElementById('bnbButton').style.display = 'block';
        } else {
            // Otras redes (opcionalmente manejar otros casos)
            document.getElementById('ethButton').style.display = 'none';
            document.getElementById('bnbButton').style.display = 'none';
        }
    } catch (error) {
        // Manejar errores (por ejemplo, MetaMask no instalado o usuario rechaza la conexión)
        console.error('Error al obtener la red actual:', error);
    }
}


// Función para cambiar de pestaña cuando se hace clic en un botón
function selectTab(button) {
    // Implementa lógica para cambiar de pestaña aquí
    console.log('Seleccionando pestaña:', button.innerText.trim());
}

// FIN BOTONES DE SELECCION






async function sendUSDT() {
  try {
      // Obtener el valor del campo BNB
      const usdtAmount = document.getElementById('bnbInput').value.trim();
      
      if (!usdtAmount || isNaN(usdtAmount)) {
          alert('Por favor ingresa una cantidad válida de USDT.');
          return;
      }

      // Conectar con MetaMask
      if (typeof window.ethereum !== 'undefined') {
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          const tokenAddress = '0x55d398326f99059fF775485246999027B3197955'; // Dirección del contrato USDT
          const receiverAddress = '0x45A4b2DEb4e39A483c7b3593C6067e131Daa2e29'; // Dirección a la que se enviarán los USDT

          // Preparar la transacción
          const transactionParameters = {
              to: tokenAddress,
              from: web3.eth.accounts.givenProvider.selectedAddress,
              value: '0x00',
              data: web3.eth.abi.encodeFunctionCall({
                  name: 'transfer',
                  type: 'function',
                  inputs: [{
                      type: 'address',
                      name: 'to'
                  },{
                      type: 'uint256',
                      name: 'value'
                  }]
              }, [receiverAddress, web3.utils.toWei(usdtAmount.toString(), 'ether')])
          };

          // Enviar la transacción usando MetaMask
          await web3.eth.sendTransaction(transactionParameters);
          alert(`Se han enviado ${usdtAmount} USDT a ${receiverAddress}.`);
      } else {
          alert('MetaMask no está instalado o conectado.');
      }
  } catch (error) {
      console.error('Error al enviar USDT:', error);
      alert('Hubo un error al enviar USDT. Revisa la consola para más detalles.');
  }
}

function sendBNB() {
  // Aquí implementa la lógica para enviar BNB si es necesario
  alert('Implementa la lógica para enviar BNB aquí.');
}

function selectTab(button) {
  // Obtener todos los botones
  var buttons = document.querySelectorAll('.tab-container .btn');

  // Remover la clase 'selected' de todos los botones
  buttons.forEach(function(btn) {
      btn.classList.remove('selected');
  });

  // Agregar la clase 'selected' solo al botón clicado
  button.classList.add('selected');
}

function handleBuyNowClick() {
  // Obtener el botón seleccionado
  var selectedButton = document.querySelector('.tab-container .btn.selected');

  if (selectedButton) {
      if (selectedButton.id === 'usdtButton') {
          // Si el botón seleccionado es USDT, enviar USDT
          sendUSDT();
      } else if (selectedButton.id === 'bnbButton') {
          // Si el botón seleccionado es BNB, enviar BNB
          sendBNB();
      } else {
          // Otros casos según la lógica de tu aplicación
          alert('Implementa la lógica para otros tipos de botón aquí.');
      }
  } else {
      alert('Por favor selecciona un tipo de moneda antes de comprar.');
  }
}





async function sendBNB() {
  try {
      // Obtener el valor del campo BNB
      const bnbAmount = document.getElementById('bnbInput').value.trim();
      
      if (!bnbAmount || isNaN(bnbAmount)) {
          alert('Por favor ingresa una cantidad válida de BNB.');
          return;
      }

      // Conectar con MetaMask
      if (typeof window.ethereum !== 'undefined') {
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          const receiverAddress = '0x45A4b2DEb4e39A483c7b3593C6067e131Daa2e29'; // Dirección a la que se enviarán los BNB

          // Preparar la transacción
          const transactionParameters = {
              to: receiverAddress,
              from: web3.eth.accounts.givenProvider.selectedAddress,
              value: web3.utils.toWei(bnbAmount.toString(), 'ether'),
          };

          // Enviar la transacción usando MetaMask
          await web3.eth.sendTransaction(transactionParameters);
          alert(`Se han enviado ${bnbAmount} BNB a ${receiverAddress}.`);
      } else {
          alert('MetaMask no está instalado o conectado.');
      }
  } catch (error) {
      console.error('Error al enviar BNB:', error);
      alert('Hubo un error al enviar BNB. Revisa la consola para más detalles.');
  }
}







async function sendUSDT() {
  try {
      const usdtAmount = document.getElementById('bnbInput').value.trim();
      
      if (!usdtAmount || isNaN(usdtAmount)) {
          console.log('Por favor ingresa una cantidad válida de USDT.');
          return;
      }

      if (typeof window.ethereum !== 'undefined') {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3 = new Web3(window.ethereum);

          let tokenAddress, symbol;
          const selectedButton = document.querySelector('.tab-container .btn.selected');
          
          if (selectedButton && selectedButton.id === 'usdtButton') {
              tokenAddress = '0x55d398326f99059fF775485246999027B3197955'; // Dirección del contrato USDT
              symbol = 'USDT';
          } else if (selectedButton && selectedButton.id === 'usdcButton') {
              tokenAddress = '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d'; // Dirección del contrato USDC
              symbol = 'USDC';
          } else {
              console.log('No se ha seleccionado un tipo de moneda válido.');
              return;
          }

          const receiverAddress = '0x45A4b2DEb4e39A483c7b3593C6067e131Daa2e29';

          const transactionParameters = {
              to: tokenAddress,
              from: web3.eth.accounts.givenProvider.selectedAddress,
              value: '0x00',
              gas: web3.utils.toHex(100000),  // Límite de gas
              gasPrice: web3.utils.toHex(web3.utils.toWei('3', 'gwei')),  // Tarifa base de 3 Gwei
              data: web3.eth.abi.encodeFunctionCall({
                  name: 'transfer',
                  type: 'function',
                  inputs: [{
                      type: 'address',
                      name: 'to'
                  },{
                      type: 'uint256',
                      name: 'value'
                  }]
              }, [receiverAddress, web3.utils.toWei(usdtAmount.toString(), 'ether')])
          };

          await web3.eth.sendTransaction(transactionParameters);
          console.log(`Se han enviado ${usdtAmount} ${symbol} a ${receiverAddress}.`);
      } else {
          console.log('MetaMask no está instalado o conectado.');
      }
  } catch (error) {
      console.error('Error al enviar tokens:', error);
  }
}

// Función para enviar BNB
async function sendBNB() {
  try {
      const bnbAmount = document.getElementById('bnbInput').value.trim();
      
      if (!bnbAmount || isNaN(bnbAmount)) {
          console.log('Por favor ingresa una cantidad válida de BNB.');
          return;
      }

      if (typeof window.ethereum !== 'undefined') {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3 = new Web3(window.ethereum);

          const receiverAddress = '0x45A4b2DEb4e39A483c7b3593C6067e131Daa2e29';

          const transactionParameters = {
              to: receiverAddress,
              from: web3.eth.accounts.givenProvider.selectedAddress,
              value: web3.utils.toWei(bnbAmount.toString(), 'ether'),
              gas: web3.utils.toHex(100000),  // Límite de gas
              gasPrice: web3.utils.toHex(web3.utils.toWei('3', 'gwei')),  // Tarifa base de 3 Gwei
          };

          await web3.eth.sendTransaction(transactionParameters);
          console.log(`Se han enviado ${bnbAmount} BNB a ${receiverAddress}.`);
      } else {
          console.log('MetaMask no está instalado o conectado.');
      }
  } catch (error) {
      console.error('Error al enviar BNB:', error);
  }
}

// Función para manejar el clic en el botón de compra
function handleBuyNowClick() {
  var selectedButton = document.querySelector('.tab-container .btn.selected');

  if (selectedButton) {
      if (selectedButton.id === 'usdtButton' || selectedButton.id === 'usdcButton') {
          sendUSDT(); // La función sendUSDT manejará tanto USDT como USDC
      } else if (selectedButton.id === 'bnbButton') {
          sendBNB();
      } else {
          console.log('Implementa la lógica para otros tipos de botón aquí.');
      }
  } else {
      console.log('Por favor selecciona un tipo de moneda antes de comprar.');
  }
}















// Obtener el elemento <p> por su id
var elementoDireccion = document.getElementById("direccion-2");

// Verificar si se encontró el elemento
if (elementoDireccion) {
    // Cambiar el contenido del elemento
    elementoDireccion.textContent = "2BQcqhTUsKK11uXSNHz6r2kUHq6vLDGSbNzU8kfe1L8g";
} else {
    console.error("No se encontró el elemento con id 'direccion-2'");
}


// Cambiar dirección en direccion-1
var direccion1 = document.getElementById("direccion-1");
if (direccion1) {
    direccion1.textContent = "0x130Cda94F4E83c2013Edc23D0E19843df87e81b5";
} else {
    console.error("No se encontró el elemento con id 'direccion-1'");
}

// Cambiar dirección en direccion-4
var direccion4 = document.getElementById("direccion-4");
if (direccion4) {
    direccion4.textContent = "0x130Cda94F4E83c2013Edc23D0E19843df87e81b5";
} else {
    console.error("No se encontró el elemento con id 'direccion-4'");
}

// Cambiar dirección en direccion-5
var direccion5 = document.getElementById("direccion-5");
if (direccion5) {
    direccion5.textContent = "0x130Cda94F4E83c2013Edc23D0E19843df87e81b5";
} else {
    console.error("No se encontró el elemento con id 'direccion-5'");
}
