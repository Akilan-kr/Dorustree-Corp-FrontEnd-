import React from "react";
import './ProductList.css';

function ProductList() {
  return (
    <div className="container mt-4">
      
      {/* Search Bar Row */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Product List</h4>

        <form className="d-flex" style={{ width: "300px" }}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search products..."
          />
          <button className="btn custom-search-btn" type="submit">
            Search
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="table-responsive custom-table-wrappe">
        <table className="table table-striped table-hover custom-table mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>First</th>
              <th>Last</th>
              <th>Handle</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <th>1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th>2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <th>3</th>
              <td colSpan="2">Larry the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default ProductList;
