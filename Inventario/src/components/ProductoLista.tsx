import { useState, useEffect } from 'react';
import { eliminarProducto, escucharProductos, type Producto } from '../services/productoService';
import { useToast } from '../hooks/useToast';

interface Props {
    onEditar: (producto: Producto) => void;
    editandoId?: string;
}

const moneda = new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' });

const estadoStock = (cantidad: number) => {
    if (cantidad <= 0) return { clase: 'stock--agotado', texto: 'Agotado' };
    if (cantidad <= 10) return { clase: 'stock--bajo', texto: 'Stock bajo' };
    return { clase: 'stock--ok', texto: 'En stock' };
};

export const ProductoLista = ({ onEditar, editandoId }: Props) => {
    const { notificar } = useToast();
    const [productos, setProductos] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [porEliminar, setPorEliminar] = useState<Producto | null>(null);
    const [eliminando, setEliminando] = useState(false);


    // Suscripción en tiempo real: la lista se actualiza sola al agregar, editar o eliminar
    useEffect(() => {
        const dejarDeEscuchar = escucharProductos(
            (datos) => {
                setProductos(datos);
                setCargando(false);
            },
            (error) => {
                console.error('Error al obtener los productos:', error);
                setCargando(false);
                notificar({ tipo: 'error', titulo: 'Error de conexión', mensaje: 'No se pudieron cargar los productos.' });
            }
        );
        return dejarDeEscuchar;
    }, [notificar]);

    const confirmarEliminar = async () => {
        if (!porEliminar) return;
        setEliminando(true);
        try {
            await eliminarProducto(porEliminar.id!);
            notificar({
                tipo: 'eliminado',
                titulo: 'Producto eliminado',
                mensaje: `"${porEliminar.nombre}" se quitó del inventario.`,
            });
            setPorEliminar(null);
        } catch (error) {
            console.error('Error al eliminar:', error);
            notificar({ tipo: 'error', titulo: 'No se pudo eliminar', mensaje: 'Inténtalo de nuevo en un momento.' });
        } finally {
            setEliminando(false);
        }
    };

    const filtrados = productos.filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())
    );

    const totalUnidades = productos.reduce((acc, p) => acc + Number(p.cantidad || 0), 0);
    const valorTotal = productos.reduce((acc, p) => acc + Number(p.cantidad || 0) * Number(p.precio || 0), 0);

    return (
        <section className="list-section">
            <div className="stats">
                <div className="stat">
                    <span className="stat__label">Productos</span>
                    <span className="stat__value">{productos.length}</span>
                </div>
                <div className="stat">
                    <span className="stat__label">Unidades</span>
                    <span className="stat__value">{totalUnidades.toLocaleString('es-EC')}</span>
                </div>
                <div className="stat stat--accent">
                    <span className="stat__label">Valor del inventario</span>
                    <span className="stat__value">{moneda.format(valorTotal)}</span>
                </div>
            </div>

            <div className="list-header">
                <h2>Lista de productos</h2>
                <input
                    className="search"
                    type="search"
                    placeholder="Buscar producto…"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            {cargando ? (
                <div className="grid">
                    {[0, 1, 2, 3].map((i) => <div key={i} className="card card--skeleton" />)}
                </div>
            ) : filtrados.length === 0 ? (
                <div className="empty">
                    <div className="empty__icon">📦</div>
                    <p>{productos.length === 0 ? 'Aún no hay productos. ¡Agrega el primero!' : 'Ningún producto coincide con tu búsqueda.'}</p>
                </div>
            ) : (
                <div className="grid">
                    {filtrados.map((producto) => {
                        const stock = estadoStock(Number(producto.cantidad));
                        return (
                            <article
                                key={producto.id}
                                className={`card ${editandoId === producto.id ? 'card--editing' : ''}`}
                            >
                                <div className="card__top">
                                    <div className="card__avatar">{producto.nombre.charAt(0).toUpperCase()}</div>
                                    <span className={`stock ${stock.clase}`}>{stock.texto}</span>
                                </div>

                                <h3 className="card__title">{producto.nombre}</h3>
                                <code className="card__id" title="ID del documento">#{producto.id}</code>

                                <div className="card__data">
                                    <div>
                                        <span>Precio</span>
                                        <strong>{moneda.format(Number(producto.precio))}</strong>
                                    </div>
                                    <div>
                                        <span>Cantidad</span>
                                        <strong>{producto.cantidad}</strong>
                                    </div>

                                    <div>
                                        <span>Categoría</span>
                                        <strong>{producto.categoria || 'Sin categoría'}</strong>
                                    </div>
                                </div>

                                <div className="card__actions">
                                    <button
                                        className="btn btn--soft"
                                        onClick={() => {
                                            onEditar(producto);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button className="btn btn--danger" onClick={() => setPorEliminar(producto)}>
                                        Eliminar
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            {porEliminar && (
                <div className="modal-backdrop" onClick={() => !eliminando && setPorEliminar(null)}>
                    <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
                        <div className="modal__icon">🗑️</div>
                        <h3>¿Eliminar producto?</h3>
                        <p>
                            Vas a eliminar <b>{porEliminar.nombre}</b>. Esta acción no se puede deshacer.
                        </p>
                        <div className="modal__actions">
                            <button className="btn btn--ghost" onClick={() => setPorEliminar(null)} disabled={eliminando}>
                                Cancelar
                            </button>
                            <button className="btn btn--danger-solid" onClick={confirmarEliminar} disabled={eliminando}>
                                {eliminando ? <span className="spinner" /> : null}
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};
