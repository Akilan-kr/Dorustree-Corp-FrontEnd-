import React, { useEffect, useContext, useState } from "react";
import "./ExploreProduct.css";
import { StoreContext } from "../../Context/StoreContext";

function ExploreProduct() {
  const {
    productList,
    fetchProducts,
    currentPage,
    setCurrentPage,
    hasNextPage,
    loading,
    search,
    setSearch,
    quantities,
    increaseQuantity,
    decreaseQuantity
  } = useContext(StoreContext);

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Fetch products when page or search changes
  useEffect(() => {
    fetchProducts(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(0); // reset to first page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Handle search input
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="container mt-4">

      {/* Search */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Product List</h4>
        <input
          type="text"
          className="form-control"
          style={{ width: "250px" }}
          placeholder="Search by name or category..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center my-3">
          <div className="spinner-border text-primary"></div>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="table-responsive custom-table-wrapper">
          <table className="table table-striped table-hover custom-table mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>Product Category</th>
                <th>Product Price</th>
                <th>Product Count</th>
              </tr>
            </thead>

            <tbody>
              {productList.map((item, index) => {
                const id = item.productId;
                const qty = quantities[id] || 0;

                return (
                  <tr key={id}>
                    <td>{currentPage * 10 + index + 1}</td>
                    <td>{item.productName}</td>
                    <td>{item.productCategory}</td>
                    <td>₹ {item.productPrice}</td>
                    <td>
                      {qty > 0 ? (
                        <div className="d-flex align-items-center gap-2">
                          <button className="btn btn-danger btn-sm" onClick={() => decreaseQuantity(id)}>-</button>
                          <span className="fw-bold">{qty}</span>
                          <button className="btn btn-success btn-sm" onClick={() => increaseQuantity(id)}>+</button>
                        </div>
                      ) : (
                        <button className="btn btn-primary btn-sm" onClick={() => increaseQuantity(id)}>Add</button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {productList.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-3">No Products Found</td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      )}

      {/* Pagination */}
      <nav className="mt-3">
        <ul className="pagination justify-content-end">

          {/* Previous */}
          <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage === 0}
            >
              Previous
            </button>
          </li>

          {/* Next */}
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
  );
}

export default ExploreProduct;
