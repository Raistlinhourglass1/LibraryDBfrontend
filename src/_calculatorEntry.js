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

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Option = styled.option`
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

const CalculatorEntry = () => {
  const [values, setValues] = useState({
    calculator_model: '',     // Corrected field name
    calculator_type: '',      // Corrected field name
    calc_serial_num: '',      // Corrected field name
    price: ''                 // No change needed for price
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState('');
  const [catalog, setCatalog] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalSerialNumber, setOriginalSerialNumber] = useState('');

  const fetchCatalog = async () => {
    try {
      const response = await fetch('https://librarydbbackend.onrender.com/_calculatorCatalog');
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
    if (!formValues.calculator_model.trim()) { // Corrected field name
      errors.calculator_model = "Model name is required";
    }
    if (!formValues.calc_serial_num.trim()) { // Corrected field name
      errors.calc_serial_num = "Serial number is required";
    }
    if (!formValues.calculator_type.trim()) { // Corrected field name
      errors.calculator_type = "Type is required";
    }
    return errors;
  };

  const resetForm = () => {
    setIsEditMode(false);
    setValues({
      calculator_model: '',
      calc_serial_num: '',
      price: '',
      calculator_type: ''
    });
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitStatus('');
    const validationErrors = validateForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setSubmitStatus('submitting');

        const method = isEditMode ? 'PUT' : 'POST';
        const url = isEditMode ? 'https://librarydbbackend.onrender.com/_editCalculator' : 'https://librarydbbackend.onrender.com/_calculatorEntry';

        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...values,
            original_serial_number: originalSerialNumber
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setSubmitStatus('success');
          alert(data.message);
          resetForm();
          fetchCatalog();
        } else {
          setSubmitStatus('error');
          alert(`Failed to add or update calculator: ${data.message}`);
        }
      } catch (error) {
        console.error('Error:', error);
        setSubmitStatus('error');
        alert('Failed to connect to server. Please try again.');
      }
    }
  };

  const handleEditCalculator = (calculator) => {
    setIsEditMode(true);
    setValues({
      calculator_model: calculator.calculator_model,
      calc_serial_num: calculator.calc_serial_num,
      price: calculator.price,
      calculator_type: calculator.calculator_type
    });

    setOriginalSerialNumber(calculator.calc_serial_num);
  };

  const handleFlagCalculator = async (serial_number) => {
    try {
      const response = await fetch('https://librarydbbackend.onrender.com/_flagCalculator', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ serial_number })
      });

      const data = await response.json();
      alert(data.message);
      fetchCatalog();
    } catch (error) {
      console.error('Error flagging calculator:', error);
      alert('Failed to flag calculator');
    }
  };

  return (
    <AppContainer>
      <MainContent>
        <FormTitle>Calculator Entry</FormTitle>
        <Form onSubmit={handleSubmit}>
          {['price', 'calculator_model', 'calc_serial_num', 'calculator_type'].map((field) => (
            <FormGroup key={field}>
              <Label htmlFor={field}>
                {field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Label>
              {field === 'calculator_type' ? (
                <Select name={field} value={values[field]} onChange={handleInput}>
                  <Option value="">Select Type</Option>
                  <Option value="Graphing">Graphing</Option>
                  <Option value="Scientific">Scientific</Option>
                </Select>
              ) : (
                <Input
                  type={field === 'price' ? 'number' : 'text'}
                  placeholder={`Enter ${field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`}
                  name={field}
                  value={values[field]}
                  onChange={handleInput}
                />
              )}
              {errors[field] && <ErrorMessage>{errors[field]}</ErrorMessage>}
            </FormGroup>
          ))}
          <SubmitButton type="submit">{isEditMode ? 'Update Calculator' : 'Add Calculator'}</SubmitButton>
          <Link to="/_calculatorSearch" style={{ textDecoration: 'none' }}>
            <SubmitButton type='button' style={{ backgroundColor: '#f0f0f0', color: '#333' }}>Search Calculator</SubmitButton>
          </Link>
        </Form>

       {/* Catalog Display */}
<CatalogContainer>
  <h2>Calculator Catalog</h2>
  {catalog.length === 0 ? (
    <p>No calculators available.</p>
  ) : (
    catalog.filter(calculator => calculator.is_deleted !== 1).map((calculator, index) => (
      <CatalogItem key={index}>
        <span><strong>Model:</strong> {calculator.calculator_model}</span>
        <span><strong>Serial Number:</strong> {calculator.calc_serial_num}</span>
        <span><strong>Price:</strong> ${calculator.price}</span>
        <span><strong>Type:</strong> {calculator.calculator_type}</span> {/* Add this line */}
        <ActionButton onClick={() => handleEditCalculator(calculator)}>Edit</ActionButton>
        <ActionButton onClick={() => handleFlagCalculator(calculator.calc_serial_num)}>Flag</ActionButton>
      </CatalogItem>
    ))
  )}
</CatalogContainer>

      </MainContent>
    </AppContainer>
  );
};

export default CalculatorEntry;
