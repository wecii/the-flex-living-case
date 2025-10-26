import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [filters, setFilters] = useState({ status: '', property_name: '', source: '', ratingMin: '', ratingMax: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchReviews = async (newPage = page, newPageSize = pageSize) => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    params.append('page', newPage);
    params.append('pageSize', newPageSize);
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews?${params.toString()}`);
    const data = await res.json();
    setReviews(data.items || []);
    setTotal(data.total || 0);
    setPage(data.page || newPage);
    setPageSize(data.pageSize || newPageSize);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, []);

  const handleApprove = async (id) => {
    await fetch(`/api/reviews/${id}/approve`, { method: 'POST' });
    fetchReviews();
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchReviews(1, pageSize); // filtre değişince ilk sayfaya dön
  };

  const handlePageChange = (newPage) => {
    fetchReviews(newPage, pageSize);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="review-list-page">
      <h2>Review List & Approve</h2>
      <form onSubmit={handleFilterSubmit} style={{ marginBottom: 16 }}>
        <input name="property_name" placeholder="Property Name" value={filters.property_name} onChange={handleFilterChange} />
        <input name="status" placeholder="Status" value={filters.status} onChange={handleFilterChange} />
        <button type="submit">Filter</button>
      </form>
      {loading ? <div>Loading...</div> : (
        <>
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Guest</th>
                <th>Rating</th>
                <th>Cleanliness</th>
                <th>Communication</th>
                <th>Respect House Rules</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r.id} className="review-row" onClick={() => navigate(`/review/${r.id}`)} style={{ cursor: 'pointer' }}>
                  <td>{r.property_name}</td>
                  <td>{r.guest_name}</td>
                  <td>{r.rating}</td>
                  <td>{r.cleanliness}</td>
                  <td>{r.communication}</td>
                  <td>{r.respect_house_rules}</td>
                  <td>{r.review_status}</td>
                  <td onClick={e => e.stopPropagation()}>
                    {r.review_status === 'pending' ? (
                      <button onClick={() => handleApprove(r.id)}>Approve</button>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination" style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>Previous</button>
              <span>Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => handlePageChange(Number(Number(page) + 1))}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ReviewList;
