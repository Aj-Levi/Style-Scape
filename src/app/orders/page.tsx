import React from "react";

const mockUserData = {
  firstname: "John",
  lastname: "Doe",
  email: "john.doe@example.com",
  image: "https://i.pravatar.cc/300",
  orders: [
    { id: "ORD-12345", date: "2023-04-15", total: 129.99, status: "Delivered" },
    { id: "ORD-54321", date: "2023-03-22", total: 79.5, status: "Processing" },
  ],
  wishlist: 5,
  joined: "January 2023",
};

const Orders = () => {
  return (
    <div className="col-span-1 md:col-span-3">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Order History</h2>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockUserData.orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.date}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      <div
                        className={`badge ${
                          order.status === "Delivered"
                            ? "badge-success"
                            : "badge-warning"
                        }`}
                      >
                        {order.status}
                      </div>
                    </td>
                    <td>
                      <button className="btn btn-secondary btn-xs">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
