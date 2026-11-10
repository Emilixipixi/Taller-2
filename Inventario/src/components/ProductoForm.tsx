
import { useState, useEffect, type FormEvent } from 'react'
import {
  guardarProducto,
  actualizarProducto,
  type Producto
} from '../services/productoService'

interface Props {
  productosEditar: Producto | null;
}

function ProductoForm({ productosEditar }: Props) {

  const [nombre, setNombre] = useState(productosEditar?.nombre ?? '')
  const [cantidad, setCantidad] = useState(productosEditar?.cantidad ?? 0)
  const [precio, setPrecio] = useState(productosEditar?.precio ?? 0.0)

  useEffect(() => {
    setNombre(productosEditar?.nombre ?? '')
    setCantidad(productosEditar?.cantidad ?? 0)
    setPrecio(productosEditar?.precio ?? 0.0)
  }, [productosEditar])

  const guardarProductoTecnologico = async (
    e: FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault()

    try {

      if (productosEditar) {

        await actualizarProducto(
          productosEditar.id!,
          nombre,
          cantidad,
          precio
        )

        console.log('Producto actualizado')

      } else {

        await guardarProducto(
          nombre,
          cantidad,
          precio
        )

        console.log('Producto guardado')

      }

      setNombre('')
      setCantidad(0)
      setPrecio(0.0)

    } catch (error) {

      console.error('Error al guardar el producto:', error)

    }

  }

  return (
    <>

      <div>

        <h1>Formulario de Inventario</h1>

        <form onSubmit={guardarProductoTecnologico}>

          <div>

            <label htmlFor="nombre">
              Nombre:
            </label>

            <input
              type="text"
              id="nombre"
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

          </div>

          <div>

            <label htmlFor="cantidad">
              Cantidad:
            </label>

            <input
              type="number"
              id="cantidad"
              name="cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />

          </div>

          <div>

            <label htmlFor="precio">
              Precio:
            </label>

            <input
              type="number"
              id="precio"
              name="precio"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(Number(e.target.value))}
            />

          </div>

          <button type="submit">
            {productosEditar ? 'Actualizar Producto' : 'Guardar Producto'}
          </button>

        </form>

      </div>

    </>
  )

}

export default ProductoForm
