import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Pregunta, Users } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public db: AngularFirestore) { }

  createPregunta(data: any, path: string, id: string): any {
    const collection = this.db.collection(path);
    return collection.doc(id).set(data);
  }

  getDoc<Tipe>(path: string, id: string) {
    const collection = this.db.collection<Tipe>(path);
    return collection.doc(id).valueChanges();
  }

  deleteDoc(path: string, id: string) {
    const collection = this.db.collection(path);
    return collection.doc(id).delete();
  }

  updateDoc(data: Pregunta, path: string, id: string): any {
    const collection = this.db.collection(path);
    return collection.doc(id).update(data);
  }

  getId() {
    return this.db.createId();
  }

  getCollection<Tipe>(path: string) {
    const collection = this.db.collection<Tipe>(path, ref => ref.orderBy('order', 'asc'));
    return collection.valueChanges();
  }

  getUser(path: string, id: string) {
    const collection = this.db.collection(path);
    return collection.doc(id).valueChanges();
  }

}
//
