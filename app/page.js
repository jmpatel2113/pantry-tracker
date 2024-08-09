"use client"
import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, doc, querySnapshot, query, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore"; 
import { db } from "./firebase";

export default function Home() {

  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState({name:'', amount:''});

  const addItem = async (e) => {
    e.preventDefault();
    
    newItem.name = newItem.name.trim().charAt(0).toUpperCase() + newItem.name.slice(1).toLowerCase();
    newItem.amount = newItem.amount.trim();
    if(newItem.name === '' && newItem.amount === ''){
      alert("Please enter both item name and its amount.");
      return;
    }
    if(newItem.name !== '' && newItem.amount === ''){
      alert("Please enter the amount.");
      return;
    }
    if(newItem.name === '' && newItem.amount !== ''){
      alert("Please enter the item name.");
      return;
    }
    if(isNaN(newItem.amount) || newItem.amount <= 0 || newItem.amount > 100) {
      alert('Amount must be a number between 1 and 100.');
      return;
    }
    
    let itemExists = false;
    const querySnapshot = await getDocs(collection(db, "pantry-items"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if(newItem.name === data.name){
        itemExists = true;
        return;
      }
    });

    if(itemExists){
      alert("This item already exists in the pantry.")
      setNewItem({name: '', amount:''});
      return;
    }

    await addDoc(collection(db, "pantry-items"), {
      name: newItem.name,
      amount: newItem.amount,
    });
    setNewItem({name: '', amount:''});
  }

  useEffect(() => {
    const q = query(collection(db, 'pantry-items'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = []
      querySnapshot.forEach((doc) => {
        itemsArr.push({...doc.data(), id: doc.id});
        //console.log({...doc.data(), id: doc.id});
      })
      setItems(itemsArr);
    })
    return () => unsubscribe();
  }, []);

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'pantry-items', id))
  }

  const editAmount = async(itemId, itemAmount) => {

    if(itemAmount > 100 || itemAmount < 1){
      if(itemAmount == 0){
        deleteItem(itemId);
        return;
      }
      alert("Amount must be between 1 and 100");
      return;
    }

    const docRef = doc(db, "pantry-items", itemId);
    await updateDoc(docRef, {
      "amount": itemAmount
    })
    return;
    
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="p-4 text-4xl text-center">Pantry Tracker</h1>
        <div className="bg-slate-800 p-4 rounded-2xl">
          <form className="grid grid-cols-6 items-center text-black text-lg">
            <input value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} className="col-span-3 p-3 border rounded-md" type="text" placeholder="Enter Item"/>
            <input value={newItem.amount} onChange={(e) => setNewItem({...newItem, amount: e.target.value})} className="col-span-2 p-3 border mx-3 rounded-md" type="number" min={1} max={100} placeholder="Enter Amount"/>
            <button onClick={addItem} className="text-white bg-gray-400 hover:bg-slate-500 p-3 rounded-md" type="submit">+</button>
          </form>
          <ul>
            {items.map((item, id) => (
              <li key={id} className="my-4 grid grid-cols-6 text-lg w-full items-center text-white">
                <div className="p-4 w-full col-span-3 flex justify-between">
                  <span className="">{item.name}</span>
                </div>
                <div className="p-4 w-full col-span-2 flex justify-center">
                  <span onClick={() => editAmount(item.id, Number(item.amount)-1)} className="mr-10 cursor-pointer">-</span>
                  <span>{item.amount}</span>
                  <span onClick={() => editAmount(item.id, Number(item.amount)+1)} className="ml-10 cursor-pointer">+</span>
                </div>
                <button onClick={() => deleteItem(item.id)} className="p-4 justify-center col-span-1 hover:bg-gray-400 bg-gray-700 rounded-md">Delete Item</button>
              </li>
            ))}
          </ul>
          {}
        </div>
      </div>
    </main>
  );
}
