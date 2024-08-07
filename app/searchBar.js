// src/SearchBar.js
import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import {firestore} from '@/firebase';



const SearchBar = ({ setItems }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (event) => {
    event.preventDefault();
    if (searchTerm.trim() === '') return;

    const q = query(collection(firestore, 'inventory'), where('name', '==', searchTerm));
    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    setItems(items);
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search items"
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;

