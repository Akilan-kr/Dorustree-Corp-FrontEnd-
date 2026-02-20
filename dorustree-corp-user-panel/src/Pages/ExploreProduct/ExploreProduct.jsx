import React, { useState, useMemo, useContext } from "react";
import "./ExploreProduct.css";
import { StoreContext } from "../../Context/StoreContext";

function ExploreProduct() {


    const {user, setUser, quantities, increaseQuantity, productList, decreaseQuantity} = useContext(StoreContext);

  // Dummy Data (Replace with API data)
  const data = productList;

  const pageSize = 10;

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 🔍 Filtered Data
  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.productCategory.toLowerCase().includes(search.toLowerCase()) ||
      item.productPrice.toString().includes(search)
    );
  }, [search, data]);


  // 📄 Pagination Logic
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="container mt-4">

      {/* Search */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Product List</h4>

        <input
          type="text"
          className="form-control"
          style={{ width: "250px" }}
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table */}
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
  {paginatedData.map((item, index) => {
    const id = item.productId;
    // console.log("id:",id);
    const qty = quantities[id] || 0;

    return (
      <tr key={id}>
        <td>{(currentPage - 1) * pageSize + index + 1}</td>
        <td>{item.productName}</td>
        <td>{item.productCategory}</td>
        <td>₹ {item.productPrice}</td>
        <td>
          {qty > 0 ? (
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-danger btn-sm"
                onClick={() => decreaseQuantity(id)}
              >
                -
              </button>

              <span className="fw-bold">{qty}</span>

              <button
                className="btn btn-success btn-sm"
                onClick={() => increaseQuantity(id)}
              >
                +
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => increaseQuantity(id)}
            >
              Add
            </button>
          )}
        </td>
      </tr>
    );
  })}
</tbody>

        </table>
      </div>

      {/* Pagination */}
      <nav className="mt-3">
        <ul className="pagination justify-content-end">
          <li className={`page-item ${currentPage === 1 && "disabled"}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
          </li>

          {[...Array(totalPages)].map((_, i) => (
            <li
              key={i}
              className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))}

          <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage + 1)}
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
