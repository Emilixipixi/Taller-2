import { useState } from 'react';
import './App.css'
import ProductoForm from './components/ProductoForm';
import { ProductoLista } from './components/ProductoLista';
import { ToastProvider } from './components/ToastProvider';
import type { Producto } from './services/productoService';

function App() {
  const [productosEditar, setProductosEditar] = useState<Producto | null>(null);

  return (
    <ToastProvider>
      <div className="app">
        <div className="bg-orb bg-orb--1" />
        <div className="bg-orb bg-orb--2" />

        <header className="hero">
          <span className="hero__badge">● Conectado a Firebase</span>
          <h1>Formulario de <span className="gradient-text">Inventario</span></h1>
          <p className="hero__sub">Administra tus productos tecnológicos en tiempo real.</p>
        </header>

        <main className="layout">
          <ProductoForm
            key={productosEditar?.id ?? 'nuevo'}
            productosEditar={productosEditar}
            onTerminar={() => setProductosEditar(null)}
          />
          <ProductoLista onEditar={setProductosEditar} editandoId={productosEditar?.id} />
        </main>
      </div>
    </ToastProvider>
  )
}

export default App
