import { useState } from 'react';

export default function AdminOrders() {
  // State để lưu danh sách đơn hàng
  const [orders, setOrders] = useState([
    { id: 1, customer: 'Nguyễn Văn A', items: 'Sữa Rửa Mặt, Kem Dưỡng', total: '800,000 VND', status: 'Đang xử lý' },
    { id: 2, customer: 'Trần Thị B', items: 'Son Môi, Dầu Dưỡng Tóc', total: '650,000 VND', status: 'Đã giao hàng' },
    { id: 3, customer: 'Lê Quang C', items: 'Serum, Kem Dưỡng', total: '1,200,000 VND', status: 'Đang xử lý' },
  ]);

  // Cập nhật trạng thái đơn hàng
  const updateStatus = (id, newStatus) => {
    setOrders(orders.map(order =>
      order.id === id ? { ...order, status: newStatus } : order
    ));
  };

  // Xoá đơn hàng
  const deleteOrder = (id) => {
    setOrders(orders.filter(order => order.id !== id));
  };
  return (
    <div className="container">
      <div className="orderList">
        <h3>Danh sách Đơn hàng</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Sản phẩm</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.customer}</td>
                <td>{order.items}</td>
                <td>{order.total}</td>
                <td>{order.status}</td>
                <td>
                  {order.status !== 'Đã giao hàng' && (
                    <button
                      onClick={() => updateStatus(order.id, 'Đã giao hàng')}
                      className="updateButton"
                    >
                      Update
                    </button>
                  )}
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="deleteButton"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
