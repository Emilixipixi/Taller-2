import ProductoForm from './components/ProductoForm';


import './App.css'
import { ProductoLista } from './components/ProductoLista';
import { useState } from 'react';
import type { Producto } from './services/productoService';

function App() {
  const [productosEditar, setProductosEditar] = useState<Producto | null>(null);

  return (
    <div className="App">
      <ProductoForm key={productosEditar?.id?? "nuevo"} productosEditar={productosEditar} />
      <ProductoLista onEditar={setProductosEditar} />
    </div>
  )
}


export default App
