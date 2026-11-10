import {addDoc, collection, doc, getDocs, updateDoc} from 'firebase/firestore'
import { db } from '../firebase';

export interface Producto {
  id?: string;
  nombre: string;
  cantidad: number;
  precio: number;
}


export async function guardarProducto(nombre: string, cantidad: number, precio: number) {
    try {
      const docRef = await addDoc(collection(db, 'productos'), {
        nombre: nombre,
        cantidad: cantidad, 
        precio: precio
      });
      console.log('Producto guardado con ID:', docRef.id);
      
      
    } catch (error) {

      console.error('Error al guardar el producto:', error);
      
    }
}

export const obtenerProductos = async (): Promise<Producto[]> => {
    const querySnapshot = await getDocs( collection(db, 'productos'));

    const productos = querySnapshot.docs.map((docs) => ({
      id: docs.id,
      ...docs.data() 
    })) as Producto[];

    return productos;
  }

  export const actualizarProducto = async (id: string, nombre: string, cantidad: number, precio: number) => {
    const productoRef = doc(db, 'productos', id);
    await updateDoc(productoRef, {
      nombre,
      cantidad,
      precio
    });
  }