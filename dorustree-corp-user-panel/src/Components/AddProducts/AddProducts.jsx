import React, { useContext, useState } from 'react';
import { addProduct } from '../../Services/ProductService';
import { StoreContext } from '../../Context/StoreContext';

function AddProduct() {
  const [product, setProduct] = useState({
    productName: '',
    productCategory: '',
    productPrice: '',
    productQuantity: '',
    productStatus: 'ACTIVE'
  });

  const {user} = useContext(StoreContext);

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log('Submitting product:', product);
    setMessage('Product added successfully!');
    const response = await addProduct(product, user.token);
    if(response.status === 201){
        console.log("added");
    }
    // Here you can call your API service to save product
    // Example: productService.addProduct(product)
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <h3>Add Product</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Product Name</label>
          <input
            type="text"
            name="productName"
            value={product.productName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Product Category</label>
          <input
            type="text"
            name="productCategory"
            value={product.productCategory}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Product Price</label>
          <input
            type="number"
            name="productPrice"
            value={product.productPrice}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Product Quantity</label>
          <input
            type="number"
            name="productQuantity"
            value={product.productQuantity}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Product Status</label>
          <select
            name="productStatus"
            value={product.productStatus}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Add Product
        </button>
      </form>

      {message && <p style={{ marginTop: '15px', color: 'green' }}>{message}</p>}
    </div>
  );
}

export default AddProduct;
