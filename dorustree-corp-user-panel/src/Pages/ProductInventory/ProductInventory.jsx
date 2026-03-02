import React, { useContext, useEffect, useState } from "react";
import { deleteProduct, getVendorProducts, toggleProductStatus } from "../../Services/ProductService";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import DashboardSidebar from "../../Components/DashboardSidebar/DashboardSidebar";

const ProductInventory = () => {
  const [productInventory, setProductInventory] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useContext(StoreContext);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getVendorProducts(currentPage, 10, user.token);
      setProductInventory(data.data.content || data.data);
      setHasNextPage(data.data.hasNext || false);
    } catch (err) {
      console.error("Error fetching vendor products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const handleToggleStatus = async (productId) => {
    await toggleProductStatus(productId, user.token);
    fetchProducts();
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Delete this product?")) {
      await deleteProduct(productId, user.token);
      fetchProducts();
    }
  };

  const totalProducts = productInventory.length;
  const activeProducts = productInventory.filter(p => p.productStatus === "ACTIVE").length;
  const inactiveProducts = totalProducts - activeProducts;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f9" }}>
      <DashboardSidebar />

      <div style={{ flex: 1, padding: "40px" }}>
        {/* Header */}
        <div style={{ marginBottom: "25px" }}>
          <h2 style={{ marginBottom: "5px" }}>Product Inventory</h2>
          <p style={{ color: "#666" }}>
            Manage, edit and monitor your listed products.
          </p>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
          {summaryCard("Total Products", totalProducts, "#2c3e50")}
          {summaryCard("Active", activeProducts, "#27ae60")}
          {summaryCard("Inactive", inactiveProducts, "#e74c3c")}
        </div>

        {/* Table Card */}
        <div style={tableCard}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "30px" }}>
              Loading...
            </div>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price (₹)</th>
                  <th>Qty</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {productInventory.map((product, idx) => (
                  <tr key={product.productId} style={{padding: "5px"}}>
                    <td>{currentPage * 10 + idx + 1}</td>
                    <td>{product.productName}</td>
                    <td>{product.productCategory}</td>
                    <td>{product.productPrice}</td>
                    <td>{product.productQuantity}</td>

                    <td>
                      <span
                        onClick={() => handleToggleStatus(product.productId)}
                        style={{
                          padding: "5px 12px",
                          borderRadius: "20px",
                          cursor: "pointer",
                          fontSize: "13px",
                          background:
                            product.productStatus === "ACTIVE"
                              ? "#d4edda"
                              : "#f8d7da",
                          color:
                            product.productStatus === "ACTIVE"
                              ? "#155724"
                              : "#721c24"
                        }}
                      >
                        {product.productStatus}
                      </span>
                    </td>

                    <td style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() =>
                          navigate(`/mydashboard/editproduct/${product.productId}`)
                        }
                        style={editBtn}
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => handleDelete(product.productId)}
                        style={deleteBtn}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}

                {productInventory.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(prev => prev - 1)}
            style={pageBtn}
          >
            Previous
          </button>

          <button
            disabled={!hasNextPage}
            onClick={() => setCurrentPage(prev => prev + 1)}
            style={pageBtn}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Styles ---------- */

const summaryCard = (title, value, color) => (
  <div
    style={{
      flex: 1,
      background: "#fff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 6px 18px rgba(0,0,0,0.05)"
    }}
  >
    <h4 style={{ margin: 0, color }}>{value}</h4>
    <p style={{ margin: 0, color: "#666" }}>{title}</p>
  </div>
);

const tableCard = {
  background: "#fff",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.05)"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse"
};

const editBtn = {
  background: "#3498db",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  color: "#fff",
  cursor: "pointer"
};

const deleteBtn = {
  background: "#e74c3c",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  color: "#fff",
  cursor: "pointer"
};

const pageBtn = {
  padding: "8px 15px",
  borderRadius: "6px",
  border: "none",
  background: "#2c3e50",
  color: "#fff",
  cursor: "pointer"
};

export default ProductInventory;
