import {addDoc, collection} from 'firebase/firestore'
import { db } from '../firebase';


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