import { useState,type SyntheticEvent } from 'react'
import { guardarProducto } from '../services/productoService'


function ProductoForm() {
  const [nombre, setNombre] = useState('')
  const [cantidad, setCantidad] = useState(0)
  const [precio, setPrecio] = useState(0.0)

  const guardarProductoTecnologico = async (e: SyntheticEvent<HTMLFormElement,SubmitEvent>) => {
    e.preventDefault();
    try {
     await guardarProducto(nombre, cantidad, precio);
      setNombre('');
      setCantidad(0);
      setPrecio(0.0);
      
    } catch (error) {

      console.error('Error al guardar el producto:', error);
      
    }
  }

  return (
    <>
      
          <div>
            <h1>Formulario de Inventario</h1>
            <form onSubmit={guardarProductoTecnologico}>
              <div>
                <label htmlFor="nombre">Nombre:</label>
                <input type="text" id="nombre" name="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </div>
              <div>
                <label htmlFor="cantidad">Cantidad:</label>
                <input type="number" id="cantidad" name="cantidad" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} />
              </div>
              <div>
                <label htmlFor="precio">Precio:</label>
                <input type="number" id="precio" name="precio" step="0.01" value={precio} onChange={(e) => setPrecio(Number(e.target.value))} />
              </div>
              <button type="submit">Guardar</button>
            </form>

          </div>
          
    </>
  )
}

export default ProductoForm;
