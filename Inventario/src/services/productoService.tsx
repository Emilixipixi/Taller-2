import { addDoc, collection, doc, getDocs, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase';

export interface Producto {
  id?: string;
  nombre: string;
  cantidad: number;
  precio: number;
}

const productosRef = collection(db, 'productos');

export async function guardarProducto(nombre: string, cantidad: number, precio: number) {
  // Dejamos que el error suba para que el formulario pueda mostrar la notificación de error
  const docRef = await addDoc(productosRef, { nombre, cantidad, precio });
  console.log('Producto guardado con ID:', docRef.id);
  return docRef.id;
}

export const obtenerProductos = async (): Promise<Producto[]> => {
  const querySnapshot = await getDocs(productosRef);

  return querySnapshot.docs.map((d) => ({
    id: d.id,
    ...d.data()
  })) as Producto[];
}

/**
 * Escucha la colección en tiempo real: cada vez que se agrega, edita o elimina
 * un producto, se llama a `callback` con la lista actualizada.
 * Devuelve la función para dejar de escuchar.
 */
export const escucharProductos = (
  callback: (productos: Producto[]) => void,
  onError?: (error: Error) => void
) => {
  return onSnapshot(
    productosRef,
    (snapshot) => {
      const productos = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      })) as Producto[];
      callback(productos);
    },
    onError
  );
}

export const actualizarProducto = async (id: string, nombre: string, cantidad: number, precio: number) => {
  const productoRef = doc(db, 'productos', id);
  await updateDoc(productoRef, { nombre, cantidad, precio });
}

export const eliminarProducto = async (id: string) => {
  const productoRef = doc(db, 'productos', id);
  await deleteDoc(productoRef);
}
