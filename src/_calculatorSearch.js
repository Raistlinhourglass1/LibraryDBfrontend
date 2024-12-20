import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';


const MainContent = styled.div`
  max-width-xl p-6 mx-auto bg-white rounded-lg shadow-md
`;

const SearchForm = styled.form`
  space-y-4
`;

const FormGroup = styled.div`
  flex flex-col space-y-2
`;

const Label = styled.label`
  text-sm font-medium text-gray-700
`;

const Input = styled.input`
  w-full p-2 border rounded-md
`;

const Button = styled.button`
  w-full bg-red-600 text-white p-2 rounded-md hover:bg-red-700 disabled:bg-red-300
`;

const ResultItem = styled.div`
  p-4 border rounded-md bg-gray-50 mb-4
`;

const ErrorText = styled.span`
  text-sm text-red-600
`;

const CalculatorSearch = () => {
  const [searchParams, setSearchParams] = useState({
    price: '',
    price_comparison: '',  // Add this line for comparison operator
    model_name: '',
    serial_number: '',
    type: ''
  });
  
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateSearchParams = () => {
    const errors = {};
    
    if (searchParams.price && isNaN(parseFloat(searchParams.price))) {
      errors.price = "Please enter a valid price";
    }
    
    if (searchParams.serial_number && !/^[A-Za-z0-9]*$/.test(searchParams.serial_number)) {
      errors.serial_number = "Serial number must be alphanumeric";
    }

    return errors;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    
    const validationErrors = validateSearchParams();
    if (Object.keys(validationErrors).length > 0) {
      setError('Please correct the form errors');
      return;
    }

    setIsLoading(true);

    try {
      // Build query string only from non-empty parameters
      const queryParams = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`https://librarydbbackend.onrender.com/_calculatorSearch?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (err) {
      setError('Failed to search calculators. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchParams({
      price: '',
      price_comparison: '', // Clear comparison operator
      model_name: '',
      serial_number: '',
      type: ''
    });
    setSearchResults([]);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <MainContent>
        <h2 className="text-2xl font-bold mb-6">Calculator Search</h2>
        <p className="mb-4 text-gray-600">Search by any combination of criteria below:</p>
        
        <SearchForm onSubmit={handleSearch}>
          <FormGroup>
            <Label>Price</Label>
            <Input
              type="number"
              name="price"
              value={searchParams.price}
              onChange={handleInputChange}
              placeholder="Enter price"
              step="0.01"
            />
          </FormGroup>

          <FormGroup>
            <Label>Price Comparison</Label>
            <select
              name="price_comparison"
              value={searchParams.price_comparison || ''}
              onChange={handleInputChange}
            >
              <option value="">Select comparison</option>
              <option value="lessThanEqual">Less than or equal to</option>
              <option value="greaterThanEqual">Greater than or equal to</option>
              <option value="equal">Equal to</option>
            </select>
          </FormGroup>

          <FormGroup>
            <Label>Model Name</Label>
            <Input
              type="text"
              name="model_name"
              value={searchParams.model_name}
              onChange={handleInputChange}
              placeholder="Enter model name"
            />
          </FormGroup>

          <FormGroup>
            <Label>Serial Number</Label>
            <Input
              type="text"
              name="serial_number"
              value={searchParams.serial_number}
              onChange={handleInputChange}
              placeholder="Enter serial number"
            />
          </FormGroup>

          <FormGroup>
            <Label>Calculator Type</Label>
            <Input
              type="text"
              name="type"
              value={searchParams.type}
              onChange={handleInputChange}
              placeholder="Enter calculator type"
            />
          </FormGroup>

          {error && <ErrorText>{error}</ErrorText>}

          <div className="flex gap-4 mt-6">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
            <Button
              type="button"
              onClick={clearSearch}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Clear
            </Button>
          </div>
        </SearchForm>

        <div className="mt-8">
          {searchResults.length > 0 ? (
            <div>
              <h3 className="text-xl font-semibold mb-4">Search Results ({searchResults.length})</h3>
              {searchResults.map((calculator, index) => (
                <ResultItem key={index}>
                  <p><strong>Model:</strong> {calculator.calculator_model}</p>
                  <p><strong>Type:</strong> {calculator.calculator_type}</p>
                  <p><strong>Serial Number:</strong> {calculator.calc_serial_num}</p>
                  <p><strong>Price:</strong> ${calculator.price}</p>
                </ResultItem>
              ))}
            </div>
          ) : !isLoading && (
            <p className="text-gray-600">No calculators found matching your criteria.</p>
          )}
        </div>
      </MainContent>
    </div>
  );
};

export default CalculatorSearch;
