import './style.css';

(() => {
    'use strict';

    let deck = [];
    const tipos = ['♠', '♥', '♦', '♣'];
    const especiales = ['A', 'J', 'Q', 'K'];
    
    let puntosJugador = 0;
    let puntosComputadora = 0;

    // Referencias del HTML
    const btnPedir = document.querySelector('#btnPedir');
    const btnDetener = document.querySelector('#btnDetener');
    const btnNuevo = document.querySelector('#btnNuevo');
    const divCartasJugador = document.querySelector('#jugador-cartas');
    const divCartasComputadora = document.querySelector('#computadora-cartas');
    const puntosJugadorHTML = document.querySelector('#puntosJugador');
    const puntosComputadoraHTML = document.querySelector('#puntosComputadora');
    const mensaje = document.querySelector('#mensaje');

    // Función para mezclar array (reemplazo de _.shuffle)
    const mezclarArray = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    // Esta función inicializa el juego
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugador = 0;
        puntosComputadora = 0;
        
        puntosJugadorHTML.textContent = 0;
        puntosComputadoraHTML.textContent = 0;
        
        divCartasJugador.innerHTML = '';
        divCartasComputadora.innerHTML = '';
        
        btnPedir.disabled = false;
        btnDetener.disabled = false;
        
        console.log('Juego inicializado correctamente');
    };

    // Esta función crea un nuevo deck
    const crearDeck = () => {
        const nuevoDeck = [];
        
        // Cartas numéricas (2-10)
        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                nuevoDeck.push(i + tipo);
            }
        }

        // Cartas especiales (A, J, Q, K)
        for (let tipo of tipos) {
            for (let esp of especiales) {
                nuevoDeck.push(esp + tipo);
            }
        }
        
        return mezclarArray(nuevoDeck);
    };

    // Esta función permite tomar una carta
    const pedirCarta = () => {
        if (deck.length === 0) {
            throw 'No hay cartas en el deck';
        }
        return deck.pop();
    };

    // Función para obtener el valor de una carta
    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);
        if (isNaN(valor)) {
            return valor === 'A' ? 11 : 10;
        }
        return parseInt(valor);
    };

    // Función para crear elemento visual de carta (usando tus imágenes)
    // Mapeo de símbolos a letras usadas en tus archivos
    const paloMap = {
        '♠': 'S', // Spades
        '♥': 'H', // Hearts
        '♦': 'D', // Diamonds
        '♣': 'C'  // Clubs
    };

    const crearCartaElement = (carta) => {
        const valor = carta.substring(0, carta.length - 1); // ejemplo: "10", "A", "Q"
        const palo = carta[carta.length - 1]; // ejemplo: "♠"

        // Convertir a inicial del palo
        const paloAbreviado = paloMap[palo];
        const nombreArchivo = `${valor}${paloAbreviado}.png`; 
        // Ejemplo: "10♠" → "10S.png"

        const img = document.createElement('img');
        img.src = `assets/cartas/${nombreArchivo}`;
        img.classList.add('carta');
        img.alt = carta;
        return img;
    };


    // Función para mostrar mensaje
    const mostrarMensaje = (texto, duracion = 3000) => {
        mensaje.textContent = texto;
        mensaje.style.display = 'block';
        setTimeout(() => {
            mensaje.style.display = 'none';
        }, duracion);
    };

    // Turno de la computadora
    const turnoComputadora = (puntosMinimos) => {
        let intervalId = setInterval(() => {
            const carta = pedirCarta();
            puntosComputadora += valorCarta(carta);
            puntosComputadoraHTML.textContent = puntosComputadora;
            
            const cartaElement = crearCartaElement(carta);
            divCartasComputadora.appendChild(cartaElement);

            // Condiciones para terminar el turno de la computadora
            if (puntosComputadora >= puntosMinimos || puntosComputadora >= 21) {
                clearInterval(intervalId);
                
                setTimeout(() => {
                    if (puntosComputadora === puntosMinimos) {
                        mostrarMensaje('🤝 ¡Empate! Nadie gana');
                    } else if (puntosMinimos > 21) {
                        mostrarMensaje('🤖 ¡La computadora gana! Te pasaste de 21');
                    } else if (puntosComputadora > 21) {
                        mostrarMensaje('🎉 ¡Ganaste! La computadora se pasó de 21');
                    } else if (puntosComputadora > puntosMinimos) {
                        mostrarMensaje('🤖 ¡La computadora gana! Tiene mayor puntaje');
                    } else {
                        mostrarMensaje('🎉 ¡Ganaste! Tienes mayor puntaje');
                    }
                }, 100);
            }
        }, 800); // Intervalo de 800ms entre cartas
    };

    // Eventos de botones
    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta();
        puntosJugador += valorCarta(carta);
        puntosJugadorHTML.textContent = puntosJugador;
        
        const cartaElement = crearCartaElement(carta);
        divCartasJugador.appendChild(cartaElement);

        if (puntosJugador > 21) {
            console.warn('Lo siento mucho, perdiste');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        } else if (puntosJugador === 21) {
            console.warn('21, genial!');
            mostrarMensaje('🎯 ¡21! ¡Perfecto!', 1000);
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        }
    });

    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugador);
    });

    btnNuevo.addEventListener('click', () => {
        console.clear();
        inicializarJuego();
    });

    // Inicializar el juego al cargar la página
    inicializarJuego();

})();