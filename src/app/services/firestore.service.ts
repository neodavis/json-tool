import { Injectable } from '@angular/core';
import { Firestore, collection, query, limit, orderBy, addDoc, getDocs, doc, getDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { DocumentType } from '../interfaces/document.interface';
import { increment, where } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  async saveDocument(type: DocumentType, content: string, userId: string) {
    const collectionRef = collection(this.firestore, type);
    const doc = { 
      content, 
      timestamp: new Date(), 
      userId,
      version: 1
    };
    return addDoc(collectionRef, doc);
  }

  async getLastVersions(type: DocumentType, userId: string, limitQuantity = 10) {
    const q = query(
      collection(this.firestore, type),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitQuantity)
    );
    return getDocs(q);
  }

  async getJsonById(type: DocumentType, docId: string) {
    const docRef = doc(this.firestore, type, docId);
    return getDoc(docRef);
  }

  async updateJson(type: DocumentType, docId: string, content: string, userId: string) {
    const docRef = doc(this.firestore, type, docId);
    return updateDoc(docRef, {
      content,
      timestamp: new Date(),
      userId,
      version: increment(1)
    });
  }

  async deleteJson(type: DocumentType, docId: string) {
    const docRef = doc(this.firestore, type, docId);
    return deleteDoc(docRef);
  }

  async getAllUserDocuments(type: DocumentType, userId: string) {
    const q = query(
      collection(this.firestore, type),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    return getDocs(q);
  }
}
