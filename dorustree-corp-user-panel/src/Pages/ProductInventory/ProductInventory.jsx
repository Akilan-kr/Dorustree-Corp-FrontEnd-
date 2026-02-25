import React, { useContext, useEffect, useState } from "react";
import { deleteProduct, getVendorProducts, toggleProductStatus } from "../../Services/ProductService";
import { FaTrash } from "react-icons/fa";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import DashboardSidebar from "../../Components/DashboardSidebar/DashboardSidebar";

const ProductInventory = () => {
  const [productInventory, setProductInventory] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const {user} = useContext(StoreContext);

  // Fetch products on page load and whenever currentPage changes
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getVendorProducts(currentPage,10, user.token);
      console.log(data.data)
      setProductInventory(data.data); // adjust if your API wraps data
      setHasNextPage(data.data.hasNext || false); // if API returns pagination info
    } catch (err) {
      console.error("Error fetching vendor products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  // Toggle product status
  const handleToggleStatus = async (productId) => {
    try {
      await toggleProductStatus(productId, user.token);
      fetchProducts(); // refresh after status change
    } catch (err) {
      console.error(err);
    }
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId, user.token);
        fetchProducts(); // refresh after delete
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (<div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '220px', flexShrink: 0 }}>
        <DashboardSidebar />
      </div>
    <div className="container mt-4">
      <h4>Product Inventory</h4>

      {loading && (
        <div className="text-center my-3">
          <div className="spinner-border text-primary"></div>
        </div>
      )}

      {!loading && (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price (₹)</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {productInventory.map((product, idx) => (
                <tr key={product.productId}>
                  <td>{currentPage * 10 + idx + 1}</td>
                  <td>{product.productName}</td>
                  <td>{product.productCategory}</td>
                  <td>{product.productPrice}</td>
                  <td>{product.productQuantity}</td>
                  <td>
                    <Button
                      size="sm"
                      variant={product.productStatus === "ACTIVE" ? "success" : "secondary"}
                      onClick={() => handleToggleStatus(product.productId)}
                    >
                      {product.productStatus}
                    </Button>
                  </td>
                  <td className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => navigate(`/mydashboard/editproduct/${product.productId}`)}
//<Route path='/mydashboard/editproduct' element={<EditProduct/>}/>
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(product.productId)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}

              {productInventory.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-3">No Products Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <nav className="mt-3">
        <ul className="pagination justify-content-end">
          <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage === 0}
            >
              Previous
            </button>
          </li>

          <li className={`page-item ${!hasNextPage ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!hasNextPage}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
    </div>
  );
};

export default ProductInventory;
