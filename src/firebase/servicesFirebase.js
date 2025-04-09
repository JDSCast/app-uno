import { db } from "./config.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

// Funciones CRUD para Firestore
//Todos los metodos crean con ids automaticos, no es necesario especificar el id al crear un documento

export const emptyCollection = async (nombreColeccion) => {
  try {
    // Obtén una referencia a la colección
    const coleccionRef = collection(db, nombreColeccion);

    // Agrega un documento temporal
    const docRef = await addDoc(coleccionRef, {
      temporal: true,
    });

    console.log("Documento temporal agregado con ID: ", docRef.id);

    // Elimina el documento temporal inmediatamente
    await deleteDoc(doc(db, nombreColeccion, docRef.id));

    console.log("Documento temporal eliminado");
  } catch (e) {
    console.error("Error al crear la colección: ", e);
  }
};

export const createDocument = async (nombreColeccion, dataDocument) => {
  try {
    // Obtén una referencia a la colección
    const coleccionRef = collection(db, nombreColeccion);

    // Agrega un documento temporal
    const docRef = await addDoc(coleccionRef, dataDocument);

    console.log("Documento agregado con ID: ", docRef.id);
  } catch (e) {
    console.error("Error al crear el documento: ", e);
  }
};

export const readDocuments = async (nombreColeccion) => {
  try {
    // Obtén una referencia a la colección
    const coleccionRef = collection(db, nombreColeccion);

    // Obtén todos los documentos de la colección
    const querySnapshot = await getDocs(coleccionRef);

    // Mapea los documentos a un array de objetos
    // Necesario para poder usarlo en el template
    const documentos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return documentos;
  } catch (e) {
    console.error("Error al leer los documentos: ", e);
  }
};

export const readDocumentById = async (nombreColeccion, id) => {
  try {
    // Obtén una referencia al documento
    const docRef = doc(db, nombreColeccion, id);

    // Obtén el documento
    const docSnap = await getDocs(docRef);

    // Verifica si el documento existe y lo formatea
    if (docSnap.exists()) {
      console.log("Documento encontrado: ", docSnap.data());
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No se encontró el documento con ID: ", id);
      return null;
    }
  } catch (e) {
    console.error("Error al leer el documento: ", e);
  }
};

export const updateDocument = async (nombreColeccion, id, dataDocument) => {
  try {
    // Obtén una referencia al documento
    const docRef = doc(db, nombreColeccion, id);

    // Actualiza el documento
    await updateDoc(docRef, dataDocument);

    console.log("Documento actualizado con ID: ", id);
  } catch (e) {
    console.error("Error al actualizar el documento: ", e);
  }
};

export const deleteDocument = async (nombreColeccion, id) => {
  try {
    // Obtén una referencia al documento
    const docRef = doc(db, nombreColeccion, id);

    // Elimina el documento
    await deleteDoc(docRef);

    console.log("Documento eliminado con ID: ", id);
  } catch (e) {
    console.error("Error al eliminar el documento: ", e);
  }
};

export const deleteCollection = async (nombreColeccion) => {
  try {
    // Obtén una referencia a la colección
    const coleccionRef = collection(db, nombreColeccion);

    // Obtén todos los documentos de la colección
    const querySnapshot = await getDocs(coleccionRef);

    // Elimina cada documento
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
      console.log("Documento eliminado con ID: ", doc.id);
    });
  } catch (e) {
    console.error("Error al eliminar la colección: ", e);
  }
};

export const createSubCollection = async (
  nombreColeccion,
  id,
  nombreSubColeccion,
  dataDocument
) => {
  try {
    // Obtén una referencia al documento padre
    const docRef = doc(db, nombreColeccion, id);

    // Obtén una referencia a la subcolección
    const subColeccionRef = collection(docRef, nombreSubColeccion);

    // Agrega un documento a la subcolección
    const docSubRef = await addDoc(subColeccionRef, dataDocument);

    console.log("Documento agregado a la subcolección con ID: ", docSubRef.id);
  } catch (e) {
    console.error("Error al crear el documento en la subcolección: ", e);
  }
};

//Mantener actualizacion en tiempo real de una coleccion
export const onSnapshotCollection = (nombreColeccion, callback) => {
  try {
    // Obtén una referencia a la colección
    const coleccionRef = collection(db, nombreColeccion);

    // Escucha los cambios en tiempo real
    const unsubscribe = onSnapshot(coleccionRef, (snapshot) => {
      const documentos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(documentos);
    });

    return unsubscribe; // Devuelve la función de cancelación
  } catch (e) {
    console.error("Error al escuchar la colección: ", e);
  }
};
