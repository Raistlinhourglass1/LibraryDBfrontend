import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BookReservationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { book } = location.state;
  console.log('Getting book:', {book});

  const [formData, setFormData] = useState({
    userId: '',
    reservation_date_time: '',
    reservation_type: book.source,
    book_id: book.id,
    book_title: book.title,
    book_author: book.author
  });

  const [status, setStatus] = useState('');
  const [queuePosition, setQueuePosition] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setFormData((prevData) => ({ ...prevData, userId }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log('Submitting with token:', token);
    setIsSubmitting(true);
    setStatus('Processing reservation...');
    setQueuePosition(null); // Reset queue position

    try {
      const response = await fetch('https://librarydbbackend.onrender.com/_bookReservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData)
      });
  
      const data = await response.json();
      
      if (response.status === 409) {
        // Book is already reserved
        setStatus('This book is already reserved for the selected date.');
        setQueuePosition(data.queue_position);
      } else if (response.ok) {
        setStatus('Reservation created successfully!');
        if (data.queue_position !== undefined) {
          setQueuePosition(data.queue_position);
        }
        // Reset form
        setFormData({
          userId: formData.userId,
          reservation_date_time: '',
          reservation_type: book.source,
          book_id: book.id,
          book_title: book.title,
          book_author: book.author
        });
      } else {
        setStatus(`Error: ${data.message}`);
      }
    } catch(error) {
      console.error('Error submitting reservation:', error);
      setStatus('Error submitting reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = () => {
    if (status.includes('Error')) {
      return 'bg-red-100 text-red-700';
    } else if (status.includes('Processing')) {
      return 'bg-yellow-100 text-yellow-700';
    } else if (status) {
      return queuePosition !== null ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700';
    }
    return '';
  };

  return (
    <div>
      <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', background: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', color: '#333' }}>Book Reservation</h2>
        
        {status && (
          <div className={`mb-4 p-3 rounded ${getStatusColor()}`}>
            {status}
            {queuePosition !== null && (
              <div className="mt-2">
                Your queue position is: {queuePosition}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label htmlFor="book_title">Book Title:</label>
            <input
              type="text"
              id="book_title"
              name="book_title"
              value={formData.book_title}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>


          <div>
            <label htmlFor="book_author">Book Author:</label>
            <input
              type="text"
              id="book_author"
              name="book_author"
              value={formData.book_author}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          
          <div>
            <label htmlFor="reservation_type">Reservation Type:</label>
            <input
              type="text"
              id="reservation_type"
              name="reservation_type"
              value={formData.reservation_type}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: isSubmitting ? '#ccc' : '#d9534f',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Reservation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookReservationForm;
