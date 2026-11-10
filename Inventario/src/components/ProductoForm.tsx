import { useState, type FormEvent } from 'react'
import {
  guardarProducto,
  actualizarProducto,
  type Producto
} from '../services/productoService'
import { useToast } from '../hooks/useToast'

interface Props {
  productosEditar: Producto | null;
  onTerminar: () => void;
}

function ProductoForm({ productosEditar, onTerminar }: Props) {
  const { notificar } = useToast()

  // El componente se re-monta (key en App) al cambiar de producto, así que
  // basta con inicializar el estado aquí.
  const [nombre, setNombre] = useState(productosEditar?.nombre ?? '')
  const [cantidad, setCantidad] = useState(productosEditar?.cantidad ?? 0)
  const [precio, setPrecio] = useState(productosEditar?.precio ?? 0.0)
  const [guardando, setGuardando] = useState(false)

  const editando = productosEditar !== null

  const limpiar = () => {
    setNombre('')
    setCantidad(0)
    setPrecio(0.0)
  }

  const guardarProductoTecnologico = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const nombreLimpio = nombre.trim()
    if (!nombreLimpio) {
      notificar({ tipo: 'aviso', titulo: 'Falta el nombre', mensaje: 'Escribe un nombre para el producto.' })
      return
    }
    if (cantidad < 0 || precio < 0) {
      notificar({ tipo: 'aviso', titulo: 'Valores inválidos', mensaje: 'Cantidad y precio no pueden ser negativos.' })
      return
    }

    setGuardando(true)
    try {
      if (editando) {
        await actualizarProducto(productosEditar.id!, nombreLimpio, cantidad, precio)
        notificar({
          tipo: 'editado',
          titulo: 'Producto actualizado',
          mensaje: `"${nombreLimpio}" se guardó con los nuevos datos.`,
        })
        onTerminar()
      } else {
        await guardarProducto(nombreLimpio, cantidad, precio)
        notificar({
          tipo: 'exito',
          titulo: 'Producto agregado',
          mensaje: `"${nombreLimpio}" ya forma parte del inventario.`,
        })
        limpiar()
      }
    } catch (error) {
      console.error('Error al guardar el producto:', error)
      notificar({ tipo: 'error', titulo: 'No se pudo guardar', mensaje: 'Revisa tu conexión e inténtalo de nuevo.' })
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section className={`panel form-panel ${editando ? 'form-panel--editing' : ''}`}>
      <div className="panel__header">
        <span className="panel__eyebrow">{editando ? 'Modo edición' : 'Nuevo registro'}</span>
        <h2>{editando ? 'Editar producto' : 'Agregar producto'}</h2>
        {editando && <p className="panel__hint">Editando: <b>{productosEditar.nombre}</b></p>}
      </div>

      <form onSubmit={guardarProductoTecnologico} className="form">
        <div className="field">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            placeholder="Ej. Teclado mecánico"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="cantidad">Cantidad</label>
            <input
              type="number"
              id="cantidad"
              name="cantidad"
              min="0"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label htmlFor="precio">Precio</label>
            <div className="input-prefix">
              <span>$</span>
              <input
                type="number"
                id="precio"
                name="precio"
                step="0.01"
                min="0"
                value={precio}
                onChange={(e) => setPrecio(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="form__actions">
          <button type="submit" className="btn btn--primary" disabled={guardando}>
            {guardando ? <span className="spinner" /> : null}
            {editando ? 'Actualizar producto' : 'Guardar producto'}
          </button>
          {editando && (
            <button type="button" className="btn btn--ghost" onClick={onTerminar} disabled={guardando}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  )
}

export default ProductoForm
