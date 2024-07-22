function updateCountdown() {
  // Recuperar la fecha objetivo del almacenamiento local, si está disponible
  let targetDate = localStorage.getItem('targetDate');

  // Si no hay una fecha objetivo almacenada o si la fecha es inválida, establecer una nueva fecha objetivo
  if (!targetDate || isNaN(new Date(targetDate))) {
      targetDate = new Date(); // Fecha actual
      targetDate.setDate(targetDate.getDate() + 3); // Sumar 4 días
      targetDate.setHours(19); // Establecer las horas a 19:00
      targetDate.setMinutes(38); // Establecer los minutos a 38
      targetDate.setSeconds(26); // Establecer los segundos a 26
      localStorage.setItem('targetDate', targetDate);
  } else {
      targetDate = new Date(targetDate); // Convertir la fecha almacenada de cadena a objeto de fecha
  }

  const daysElement = document.getElementById('days').querySelector('.value');
  const hoursElement = document.getElementById('hours').querySelector('.value');
  const minutesElement = document.getElementById('minutes').querySelector('.value');
  const secondsElement = document.getElementById('seconds').querySelector('.value');

  // Función para actualizar el contador
  function update() {
      const now = new Date().getTime();
      let distance = targetDate - now;

      // Si la distancia es menor o igual a cero, reiniciar el contador a los días originales
      if (distance <= 0) {
          targetDate = new Date(); // Fecha actual
          targetDate.setDate(targetDate.getDate() + 3); // Sumar 4 días
          targetDate.setHours(19); // Establecer las horas a 19:00
          targetDate.setMinutes(38); // Establecer los minutos a 38
          targetDate.setSeconds(26); // Establecer los segundos a 26
          localStorage.setItem('targetDate', targetDate);

          // Calcular nueva distancia
          distance = targetDate - now;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      daysElement.textContent = days;
      hoursElement.textContent = hours;
      minutesElement.textContent = minutes;
      secondsElement.textContent = seconds;
  }

  // Actualizar el contador inicialmente
  update();

  // Actualizar el contador cada segundo
  setInterval(update, 1000);
}

updateCountdown();


// FIN DE EL TIEMPO DE LA INTERFAZ




// BOTONES DE MODALS


          // SUMA DE $

// Función para generar un número aleatorio en un rango
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// Función para actualizar el valor progresivo y el tiempo de espera
function updateValue() {
  let currentValue = parseFloat(localStorage.getItem('usdt-raised')) || 879320.00; // Valor inicial
  const targetValue = 600000000.00; // Valor objetivo
  
  // Incremento en montos específicos: 20, 50, o 100
  const increments = [20, 20, 20];
  const increment = increments[Math.floor(Math.random() * increments.length)];
  
  // Incrementar el valor actual
  const newValue = Math.min(currentValue + increment, targetValue);

  // Actualizar el texto con formato de moneda
  document.getElementById('usdt-raised').innerText = '$' + newValue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  
  // Guardar el nuevo valor en el almacenamiento local
  localStorage.setItem('usdt-raised', newValue);
  
  // Generar tiempo de espera aleatorio entre 1000ms (1 segundo) y 10000ms (10 segundos)
  const randomWaitTime = getRandomNumber(5000, 20000);
  
  // Si no hemos alcanzado el valor objetivo, programar la próxima actualización
  if (newValue < targetValue) {
      setTimeout(updateValue, randomWaitTime);
  }
}

// Llamar a la función inicialmente para comenzar la cuenta progresiva
updateValue();




