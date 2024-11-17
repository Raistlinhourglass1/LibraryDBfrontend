import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';



const AppContainer = styled.div`
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  min-height: 100vh;
`;

const Header = styled.header`
  background-color: #cc0000;
  color: white;
  padding: 10px 20px;
`;

const AppTitle = styled.h1`
  margin: 0;
  font-size: 24px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
  margin-top: 10px;
`;

const NavItem = styled.a`
  color: white;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const MainContent = styled.main`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const FormTitle = styled.h2`
  margin-top: 0;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;

const SubmitButton = styled.button`
  background-color: #cc0000;
  color: white;
  border: none;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    background-color: #990000;
  }
`;

const CatalogContainer = styled.div`
  margin-top: 40px;
`;

const CatalogItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
`;

const ActionButton = styled.button`
  background-color: #cc0000;
  color: white;
  border: none;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    background-color: #990000;
  }
`;

const LaptopEntry = () => {
  const [values, setValues] = useState({
    price: '',
    model_name: '',
    serial_number: ''
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState('');
  const [catalog, setCatalog] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalSerialNumber, setOriginalSerialNumber] = useState('');


  const fetchCatalog = async () => {
    try {
      const response = await fetch('https://librarydbbackend.onrender.com/_laptopCatalog');
      const data = await response.json();
      setCatalog(data);
    } catch (error) {
      console.error('Error fetching catalog:', error);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const validateForm = (formValues) => {
    let errors = {};
    if (!formValues.price.trim()) {
      errors.price = "Price is required";
    }
    if (!formValues.model_name.trim()) {
      errors.model_name = "Model name is required";
    }
    if (!formValues.serial_number.trim()) {
      errors.serial_number = "Serial number is required";
    }
    return errors;
  };

  const resetForm = () => {
    setIsEditMode(false);
    setValues({
      model_name: '',
      serial_number: '',
      price: ''
    });
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitStatus('');
    const validationErrors = validateForm(values);
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      try {
        setSubmitStatus('submitting');
  
        // If a laptop is being edited, make a PUT request to update it
        const method = isEditMode ? 'PUT' : 'POST';
        const url = isEditMode ? 'https://librarydbbackend.onrender.com/_editLaptop' : 'https://librarydbbackend.onrender.com/_laptopEntry';
  
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...values,                  // model_name, price, serial_number
            original_serial_number: originalSerialNumber // send original serial number
          }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setSubmitStatus('success');
          alert(data.message);
         resetForm();
          fetchCatalog(); // Refresh catalog after adding or editing laptop
        } else {
          setSubmitStatus('error');
          alert(`Failed to add or update laptop: ${data.message}`);
        }
      } catch (error) {
        console.error('Error:', error);
        setSubmitStatus('error');
        alert('Failed to connect to server. Please try again.');
      }
    }
  };

  const handleFlagLaptop = async (serial_number) => {
    try {
      const response = await fetch('https://librarydbbackend.onrender.com/_flagLaptop', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ serial_number })
      });

      const data = await response.json();
      alert(data.message);
      fetchCatalog(); // Refresh catalog after flagging
    } catch (error) {
      console.error('Error flagging laptop:', error);
      alert('Failed to flag laptop');
    }
  };

  const handleEditLaptop = (laptop) => {
    setIsEditMode(true);
    setValues({
      model_name: laptop.model_name,
      serial_number: laptop.serial_number,
      price: laptop.price
    });

     // Save original serial number to track during update
  setOriginalSerialNumber(laptop.serial_number);  // Store original serial number
  };

  return (
    <AppContainer>
      <MainContent>
        <FormTitle>Laptop Entry</FormTitle>
        <Form onSubmit={handleSubmit}>
          {['price', 'model_name', 'serial_number'].map((field) => (
            <FormGroup key={field}>
              <Label htmlFor={field}>{field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</Label>
              <Input
                type={field === 'price' ? 'number' : 'text'}
                placeholder={`Enter ${field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`}
                name={field}
                value={values[field]}
                onChange={handleInput}
              />
              {errors[field] && <ErrorMessage>{errors[field]}</ErrorMessage>}
            </FormGroup>
          ))}
          <SubmitButton type='submit'>{isEditMode ? 'Update Laptop' : 'Add Laptop'}</SubmitButton>
          <Link to="/_laptopSearch" style={{ textDecoration: 'none' }}>
            <SubmitButton type='button' style={{ backgroundColor: '#f0f0f0', color: '#333' }}>Search Laptop</SubmitButton>
          </Link>
        </Form>
  
        {/* Catalog Display */}
        <CatalogContainer>
          <h2>Laptop Catalog</h2>
          {catalog.length === 0 ? (
            <p>No laptops available.</p>
          ) : (
            catalog.filter(laptop => laptop.is_deleted !== 1).map((laptop, index) => (
              <CatalogItem key={index}>
                <span><strong>Model:</strong> {laptop.model_name}</span>
                <span><strong>Serial Number:</strong> {laptop.serial_number}</span>
                <span><strong>Price:</strong> ${laptop.price}</span>
                <ActionButton onClick={() => handleFlagLaptop(laptop.serial_number)}>
                  Delete
                </ActionButton>
                <ActionButton onClick={() => handleEditLaptop(laptop)}>
                  Edit
                </ActionButton>
              </CatalogItem>
            ))
          )}
        </CatalogContainer>
      </MainContent>
    </AppContainer>
  );
};

export default LaptopEntry;
