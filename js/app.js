//variables

const carrito = document.getElementById('carrito');
const cursos = document.getElementById('lista-cursos');
const listaCursos = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

// Listeners

cargarEventListeners();

function cargarEventListeners() {
    // Dispara cuando se presiona "agragar carrito"
    cursos.addEventListener('click', comprarCurso);
    //cuando se elimina un curso del carrito
    carrito.addEventListener('click', eliminarCurso);
    //al vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
    //al cargar el documento, mostrar localStorage
    document.addEventListener('DOMContentLoaded', leerLocalStorage);

}


// Funciones

// Funcion que añade el curso al carrito
function comprarCurso(e) {
    e.preventDefault();
    // Delegation para agregar carrito
    if(e.target.classList.contains('agregar-carrito')) {
        const curso = e.target.parentElement.parentElement;
        // enviamos el curso seleccionado para tomar sus datos
        leerDatosCurso(curso);
    }
}

// lee datos del curso
function leerDatosCurso(curso) {

    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id')
    }

    insertarCarrito(infoCurso);
}

// muestra el curso seleccionado en el carrito
function insertarCarrito(curso) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <img src="${curso.imagen}" width=100>
        </td>

        <td>${curso.titulo}</td>
        <td>${curso.precio}</td>
        <td>
            <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
        </td>

    `;
    listaCursos.appendChild(row);
    guardarCursoLocalStorage(curso);
}

//eliminar el curso del DOM
function eliminarCurso(e) {
    e.preventDefault();

    let curso,
        cursoId;
    if(e.target.classList.contains('borrar-curso') ) {
        e.target.parentElement.parentElement.remove();
        curso = e.target.parentElement.parentElement;
        cursoId = curso.querySelector('a').getAttribute('data-id');
    }
    eliminarCursoLocalStorage(cursoId);
}

// elimina los cursos del carrito del DOM
function vaciarCarrito() {
    //forma lenta 
    //listaCursos.innerHTML = '';
    //forma recomendada
    while(listaCursos.firstChild) {
        listaCursos.removeChild(listaCursos.firstChild);
    }
    //vaciar Local Storage
    vaciarLocalStorage();

    return false;
}

//almacenar cursos en el carrito a local storage
function guardarCursoLocalStorage(curso) {
    let cursos;
    //toma el valor de un arreglo con datos del LS o vacío
    cursos = obtenerCursosLocalStorage();
    //curso seleccionado se agrega al arreglo
    cursos.push(curso);

    localStorage.setItem('cursos', JSON.stringify(cursos) );
}
//comprueba que haya elementos en LocalStorage
function obtenerCursosLocalStorage() {
    let cursosLS;

    //comprobamos si hay cursos en el localStorage
    if(localStorage.getItem('cursos') === null) {
        cursosLS = [];
    } else {
        cursosLS = JSON.parse(localStorage.getItem('cursos') );
    }
    return cursosLS;
}
// imprime los cursos del LS en el carrito
function leerLocalStorage() {
    let cursosLS;
    cursosLS = obtenerCursosLocalStorage(); 
    cursosLS.forEach(function(curso){
        //construir el template
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${curso.imagen}" width=100>
            </td>

            <td>${curso.titulo}</td>
            <td>${curso.precio}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
            </td>

            `;
        listaCursos.appendChild(row);
    });
}
// elimina el curso por el ID en Local Storage
function eliminarCursoLocalStorage(curso) {
    let cursosLS;
    //obtenemos el arreglo de cursos
    cursosLS = obtenerCursosLocalStorage();
    //iteramos comparando id del curso borrado con los del lS
    cursosLS.forEach(function(cursoLS, index){
        if(cursoLS.id === curso) {
            cursosLS.splice(index, 1);
        }
    });
    //añadimos el arreglo actual a storage
    localStorage.setItem('cursos', JSON.stringify(cursosLS) );
}

//elimina todos los cursos del Local Storage
function vaciarLocalStorage() {
    localStorage.clear();
}