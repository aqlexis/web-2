// Archivo: js/firebase-config.js

// Configuración de Firebase usando la URL de Realtime Database y el token secreto
const databaseURL = "https://sitio-web-dinamico-f288d-default-rtdb.firebaseio.com";
const databaseSecret = "VcYw7YHEfUMoQfFsF2p4h3XUSbgmbuxVMs4DEMc";

// Función para realizar solicitudes a la base de datos con el token de autenticación
async function firebaseRequest(path, method = 'GET', data = null) {
  const url = `${databaseURL}/${path}.json?auth=${databaseSecret}`;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  if (data && (method === 'PUT' || method === 'POST' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    console.error("Error en la solicitud a Firebase:", error);
    throw error;
  }
}

// Función para cargar datos iniciales a la base de datos
async function cargarDatosIniciales() {
  try {
    // Verificar si ya existen productos
    const productosExistentes = await firebaseRequest('productos');
    
    if (productosExistentes && Object.keys(productosExistentes).length > 0) {
      console.log('Ya existen productos en la base de datos.');
      return false;
    }
    
    // Datos de ejemplo para productos
    const productosEjemplo = [
      {
        nombre: "Smartphone XYZ",
        descripcion: "Teléfono inteligente de última generación con cámara de alta resolución y procesador rápido.",
        precio: 599.99,
        categoria: "Electrónica",
        stock: 15,
        imagen: "https://cdn-icons-png.flaticon.com/512/5217/5217391.png"
      },
      {
        nombre: "Laptop Pro",
        descripcion: "Laptop potente para profesionales con pantalla retina y SSD ultrarrápido.",
        precio: 1299.99,
        categoria: "Informática",
        stock: 8,
        imagen: "https://cdn-icons-png.flaticon.com/512/689/689355.png"
      },
      {
        nombre: "Auriculares Wireless",
        descripcion: "Auriculares inalámbricos con cancelación de ruido y batería de larga duración.",
        precio: 149.99,
        categoria: "Audio",
        stock: 20,
        imagen: "https://cdn-icons-png.flaticon.com/512/5906/5906180.png"
      },
      {
        nombre: "Smartwatch Fit",
        descripcion: "Reloj inteligente con monitor de actividad física y notificaciones.",
        precio: 179.99,
        categoria: "Wearables",
        stock: 12,
        imagen: "https://cdn-icons-png.flaticon.com/512/6447/6447804.png"
      },
      {
        nombre: "Cámara DSLR",
        descripcion: "Cámara profesional con sensor de alta calidad y lentes intercambiables.",
        precio: 849.99,
        categoria: "Fotografía",
        stock: 6,
        imagen: "https://cdn-icons-png.flaticon.com/512/1645/1645360.png"
      },
      {
        nombre: "Altavoz Bluetooth",
        descripcion: "Altavoz portátil con conectividad Bluetooth y sonido envolvente.",
        precio: 89.99,
        categoria: "Audio",
        stock: 18,
        imagen: "https://cdn-icons-png.flaticon.com/512/5072/5072173.png"
      }
    ];
    
    // Crear una estructura con ID para cada producto
    const productosConId = {};
    productosEjemplo.forEach((producto, index) => {
      productosConId[`producto_${index + 1}`] = {
        ...producto,
        fechaCreacion: new Date().toISOString()
      };
    });
    
    // Guardar todos los productos de una vez
    await firebaseRequest('productos', 'PUT', productosConId);
    console.log('Datos iniciales cargados correctamente.');
    return true;
    
  } catch (error) {
    console.error("Error al cargar datos iniciales:", error);
    return false;
  }
}

// Función para obtener todos los productos
async function obtenerProductos() {
  try {
    const productos = await firebaseRequest('productos');
    
    if (!productos) {
      return [];
    }
    
    // Convertir el objeto de productos en un array con IDs
    return Object.entries(productos).map(([id, producto]) => ({
      id,
      ...producto
    }));
    
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
}

// Función para obtener un producto por su ID
async function obtenerProductoPorId(id) {
  try {
    const producto = await firebaseRequest(`productos/${id}`);
    return producto ? { id, ...producto } : null;
  } catch (error) {
    console.error(`Error al obtener el producto con ID ${id}:`, error);
    return null;
  }
}

// Función para obtener productos por categoría
async function obtenerProductosPorCategoria(categoria) {
  try {
    const todosLosProductos = await obtenerProductos();
    return todosLosProductos.filter(producto => producto.categoria === categoria);
  } catch (error) {
    console.error(`Error al obtener productos de la categoría ${categoria}:`, error);
    return [];
  }
}

// Exponer funciones para uso global
window.cargarDatosIniciales = cargarDatosIniciales;
window.obtenerProductos = obtenerProductos;
window.obtenerProductoPorId = obtenerProductoPorId;
window.obtenerProductosPorCategoria = obtenerProductosPorCategoria;