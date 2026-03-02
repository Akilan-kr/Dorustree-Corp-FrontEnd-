import React, { useContext, useState } from 'react';
import { addProduct, addProductsFromExcel } from '../../Services/ProductService';
import { StoreContext } from '../../Context/StoreContext';
import DashboardSidebar from '../../Components/DashboardSidebar/DashboardSidebar';

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
        setMessage('✅ Product added successfully!');
        setProduct({
          productName: '',
          productCategory: '',
          productPrice: '',
          productQuantity: '',
          productStatus: 'ACTIVE'
        });
      }
    } catch (error) {
      setMessage(error.response?.data || '❌ Error adding product');
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
        setMessage('✅ Products uploaded successfully!');
        setExcelFile(null);
      }
    } catch (error) {
      setMessage(error.response?.data || '❌ Error uploading Excel');
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "220px", flexShrink: 0, background: "#2c3e50" }}>
        <DashboardSidebar />
      </div>

      <div style={{ flex: 1, padding: "40px" }}>
        <h2 style={{ marginBottom: "10px" }}>Add Products</h2>
        <p style={{ color: "#555", marginBottom: "30px" }}>
          Add a single product manually or upload multiple products using Excel.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px"
        }}>
          
          {/* Single Product Card */}
          <div style={cardStyle}>
            <h3 style={cardTitle}>Add Single Product</h3>

            <form onSubmit={handleSubmit}>
              {inputField("Product Name", "productName", product.productName, handleChange)}
              {inputField("Product Category", "productCategory", product.productCategory, handleChange)}
              {inputField("Product Price", "productPrice", product.productPrice, handleChange, "number")}
              {inputField("Product Quantity", "productQuantity", product.productQuantity, handleChange, "number")}

              <div style={{ marginBottom: "15px" }}>
                <label>Status</label>
                <select
                  name="productStatus"
                  value={product.productStatus}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <button type="submit" style={primaryButton}>
                Add Product
              </button>
            </form>
          </div>

          {/* Excel Upload Card */}
          <div style={cardStyle}>
            <h3 style={cardTitle}>Bulk Upload (Excel)</h3>

            <form onSubmit={handleExcelUpload}>
              <div style={{ marginBottom: "20px" }}>
                <label>Select Excel File</label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setExcelFile(e.target.files[0])}
                  style={{ marginTop: "8px" }}
                />
              </div>

              <button type="submit" style={secondaryButton}>
                Upload File
              </button>
            </form>

            <div style={{
              marginTop: "20px",
              padding: "10px",
              background: "#f8f9fa",
              borderRadius: "6px",
              fontSize: "13px",
              color: "#555"
            }}>
              📌 Excel should contain:<br />
              • productName<br />
              • productCategory<br />
              • productPrice<br />
              • productQuantity<br />
              • productStatus
            </div>
          </div>
        </div>

        {message && (
          <div style={{
            marginTop: "30px",
            padding: "12px",
            background: "#fff",
            borderRadius: "6px",
            boxShadow: "0 3px 8px rgba(0,0,0,0.05)"
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.06)"
};

const cardTitle = {
  marginBottom: "20px"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "6px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "1px solid #ddd"
};

const primaryButton = {
  width: "100%",
  padding: "12px",
  background: "#2c3e50",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600"
};

const secondaryButton = {
  width: "100%",
  padding: "12px",
  background: "#27ae60",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600"
};

const inputField = (label, name, value, onChange, type = "text") => (
  <div style={{ marginBottom: "15px" }}>
    <label>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      style={inputStyle}
    />
  </div>
);

export default AddProduct;
