import { Injectable } from '@angular/core';
import { Firestore, collection, query, limit, orderBy, addDoc, getDocs } from '@angular/fire/firestore';
import { DocumentType } from '../interfaces/document.interface';
import { where } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  async saveDocument(type: DocumentType, content: string, userId: string) {
    const collectionRef = collection(this.firestore, type);
    const doc = { content, timestamp: new Date(), userId };
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
}
