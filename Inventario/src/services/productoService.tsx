import {addDoc, collection, getDocs} from 'firebase/firestore'
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