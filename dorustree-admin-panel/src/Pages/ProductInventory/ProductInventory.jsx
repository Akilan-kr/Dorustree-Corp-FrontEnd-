import React, { useContext, useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import { Spinner } from "react-bootstrap";
import { getAllUsers } from "../../Service/AdminService"; // fetch vendors
import { getProductsByVendor } from "../../Service/AdminProductService";
import { deleteProduct, toggleProductStatus } from "../../Service/ProductService";

const ProductInventory = () => {
  const [productInventory, setProductInventory] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(StoreContext);
  const navigate = useNavigate();

  // Fetch vendors
  const fetchVendors = async () => {
    try {
      const response = await getAllUsers(user.token);
       console.log(response)

      const vendorList = response.data.data.filter(v => v.userRoles === "VENDOR");
      setVendors(vendorList);
      if (vendorList.length > 0) setSelectedVendor(vendorList[0].id);
    } catch (err) {
      console.error("Error fetching vendors:", err);
    }
  };

  // Fetch products for selected vendor
  const fetchProducts = async () => {
    if (!selectedVendor) return;
    setLoading(true);
    try {
      const response = await getProductsByVendor(selectedVendor, currentPage, 10, user.token);
      console.log(response)
      setProductInventory(response.data.content || response.data);
      setHasNextPage(response.data.hasNext || false);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

    // Fetch vendors only once when component loads
    useEffect(() => {
      if (user?.token) {
        fetchVendors();
      }
    }, [user]);

    // Fetch products when vendor or page changes
    useEffect(() => {
      if (selectedVendor && user?.token) {
        fetchProducts();
      }
    }, [selectedVendor, currentPage, user]);


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
      <div style={{ flex: 1, padding: "40px" }}>
        {/* Header */}
        <div style={{ marginBottom: "25px" }}>
          <h2 style={{ marginBottom: "5px" }}>Product Inventory</h2>
          <p style={{ color: "#666" }}>Select a vendor to view their products, edit or delete.</p>
        </div>

        {/* Vendor Dropdown */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ marginRight: "10px", fontWeight: "bold" }}>Select Vendor:</label>
          <select
            value={selectedVendor}
            onChange={e => setSelectedVendor(e.target.value)}
            style={{ padding: "6px 12px", borderRadius: "6px" }}
          >
            {vendors.map(v => (
              <option key={v.id} value={v.id}>
                {v.userName} ({v.userEmail})
              </option>
            ))}
          </select>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
          {summaryCard("Total Products", totalProducts, "#2c3e50")}
          {summaryCard("Active", activeProducts, "#27ae60")}
          {summaryCard("Inactive", inactiveProducts, "#e74c3c")}
        </div>

        {/* Product Table */}
        <div style={tableCard}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "30px" }}>
              <Spinner animation="border" variant="primary" />
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
                {productInventory.length > 0 ? (
                  productInventory.map((product, idx) => (
                    <tr key={product.productId}>
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
                            background: product.productStatus === "ACTIVE" ? "#d4edda" : "#f8d7da",
                            color: product.productStatus === "ACTIVE" ? "#155724" : "#721c24"
                          }}
                        >
                          {product.productStatus}
                        </span>
                      </td>
                      <td style={{ display: "flex", gap: "10px" }}>
                        <button
                          onClick={() => navigate(`/mydashboard/editproduct/${product.productId}`)}
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
                  ))
                ) : (
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
          <button disabled={currentPage === 0} onClick={() => setCurrentPage(prev => prev - 1)} style={pageBtn}>
            Previous
          </button>
          <button disabled={!hasNextPage} onClick={() => setCurrentPage(prev => prev + 1)} style={pageBtn}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Styles ---------- */
const summaryCard = (title, value, color) => (
  <div style={{ flex: 1, background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 6px 18px rgba(0,0,0,0.05)" }}>
    <h4 style={{ margin: 0, color }}>{value}</h4>
    <p style={{ margin: 0, color: "#666" }}>{title}</p>
  </div>
);

const tableCard = { background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 6px 18px rgba(0,0,0,0.05)" };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const editBtn = { background: "#3498db", border: "none", padding: "6px 10px", borderRadius: "6px", color: "#fff", cursor: "pointer" };
const deleteBtn = { background: "#e74c3c", border: "none", padding: "6px 10px", borderRadius: "6px", color: "#fff", cursor: "pointer" };
const pageBtn = { padding: "8px 15px", borderRadius: "6px", border: "none", background: "#2c3e50", color: "#fff", cursor: "pointer" };

export default ProductInventory;
