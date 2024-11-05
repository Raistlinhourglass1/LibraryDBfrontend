// src/api/openLibraryAPI.js
import axios from 'axios';

const OPEN_LIBRARY_API_URL = 'https://openlibrary.org/api/books';

/**
 * Fetch book details by ISBN from Open Library API
 * @param {string} isbn - ISBN of the book
 * @returns {Promise<Object>} - Book data
 */
export const fetchBookByISBN = async (isbn) => {
  try {
    const response = await axios.get(OPEN_LIBRARY_API_URL, {
      params: {
        bibkeys: `ISBN:${isbn}`,
        format: 'json',
        jscmd: 'data',
      },
    });

    const bookData = response.data[`ISBN:${isbn}`];
    if (!bookData) {
      throw new Error('No book found with the given ISBN.');
    }

    return bookData;
  } catch (error) {
    console.error('Error fetching book data:', error);
    throw error;
  }
};
