import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import { getProductById, updateProduct } from "../../Services/ProductService";
import Dashboard from "../../Pages/Dashboard/Dashboard";
import DashboardSidebar from "../DashboardSidebar/DashboardSidebar";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(StoreContext);

  const [product, setProduct] = useState({
    productName: "",
    productCategory: "",
    productPrice: "",
    productQuantity: "",
    productStatus: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔹 Fetch existing product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id, user.token);
        console.log("in edit: ",data.data)
        setProduct(data.data); // adjust if wrapped
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchProduct();
    }
  }, [id, user?.token]);

  // 🔹 Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 🔹 Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProduct(id, product, user.token);
      alert("Product updated successfully");
      navigate("/mydashboard");
    } catch (err) {
      console.error("Error updating product:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '220px', flexShrink: 0 }}>
        <DashboardSidebar />
      </div>
    <div className="container mt-4">
      <h4>Edit Product</h4>

      <form onSubmit={handleSubmit} className="mt-3">

        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            name="productName"
            value={product.productName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            className="form-control"
            name="productCategory"
            value={product.productCategory}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            name="productPrice"
            value={product.productPrice}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            name="productQuantity"
            value={product.productQuantity}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-control"
            name="productStatus"
            value={product.productStatus}
            onChange={handleChange}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-success"
          disabled={saving}
        >
          {saving ? "Updating..." : "Update Product"}
        </button>

      </form>
    </div>
    </div>
  );
};

export default EditProduct;
