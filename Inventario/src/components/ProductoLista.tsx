import {useState, useEffect} from 'react';
import {obtenerProductos, type Producto} from '../services/productoService';

interface Props {
    onEditar: (producto: Producto) => void;
}

export const ProductoLista = ({ onEditar }: Props) => {
    const [productos, setProductos] = useState<Producto[]>([]);

    useEffect(() => {
        const cargarProductos = async () => {
            try{
                const datos = await obtenerProductos();
                setProductos(datos);
            } catch (error) {

                console.error('Error al obtener los productos:', error);

            }
        }
        cargarProductos();
    }, []) 

    return (
        <div>
            <h2>Lista de Productos</h2>
            {
                productos.map((producto) => (
                    <div>
                        <h3>ID: ${producto.id}</h3>
                        <p>Nombre: ${producto.nombre}</p>
                        <p>Precio: ${producto.precio}</p>
                        <p>Cantidad: {producto.cantidad}</p>
                        <button onClick={() => onEditar(producto)}>Editar</button>
                    </div>
                ))
            }
        </div>
    )    
}