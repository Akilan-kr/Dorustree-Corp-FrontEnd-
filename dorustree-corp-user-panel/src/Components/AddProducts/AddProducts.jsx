import React, { useContext, useState } from 'react';
import { addProduct, addProductsFromExcel } from '../../Services/ProductService';
import { StoreContext } from '../../Context/StoreContext';
import DashboardSidebar from '../DashboardSidebar/DashboardSidebar';

function AddProduct() {
  const [product, setProduct] = useState({
    productName: '',
    productCategory: '',
    productPrice: '',
    productQuantity: '',
    productStatus: 'ACTIVE'
  });
  const [message, setMessage] = useState('');
  const [excelFile, setExcelFile] = useState(null);
  const { user } = useContext(StoreContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addProduct(product, user.token);
      if (response.status === 201) {
        setMessage('Product added successfully!');
        setProduct({
          productName: '',
          productCategory: '',
          productPrice: '',
          productQuantity: '',
          productStatus: 'ACTIVE'
        });
      }
    } catch (error) {
      setMessage(error.response?.data || 'Error adding product');
    }
  };

  const handleExcelUpload = async (e) => {
    e.preventDefault();
    if (!excelFile) {
      setMessage('Please select an Excel file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', excelFile);

    try {
      const response = await addProductsFromExcel(formData, user.token);
      if (response.status === 201) {
        setMessage('Products added from Excel successfully!');
        setExcelFile(null);
      }
    } catch (error) {
      setMessage(error.response?.data || 'Error uploading Excel file');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '220px', flexShrink: 0 }}>
        <DashboardSidebar />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '30px', backgroundColor: '#ecf0f1', overflowY: 'auto' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <h3>Add Product</h3>

          {/* Single Product Form */}
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

            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <button type="submit" style={{ padding: '10px 30px', cursor: 'pointer' }}>
                Add Product
              </button>
            </div>
          </form>

          <hr style={{ margin: '30px 0' }} />

          {/* Excel Upload Form */}
          <form onSubmit={handleExcelUpload}>
            <div style={{ marginBottom: '15px' }}>
              <label>Upload Products via Excel</label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setExcelFile(e.target.files[0])}
                style={{ display: 'block', marginTop: '5px' }}
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <button type="submit" style={{ padding: '10px 30px', cursor: 'pointer' }}>
                Upload Excel
              </button>
            </div>
          </form>

          {message && <p style={{ marginTop: '15px', color: 'green', textAlign: 'center' }}>{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
