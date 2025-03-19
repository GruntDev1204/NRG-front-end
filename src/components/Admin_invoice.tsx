import { useState } from 'react';


export default function AdminInvoices() {
  // State để lưu danh sách hóa đơn
  const [invoices, setInvoices] = useState([
    { id: 1, customer: 'Nguyễn Văn A', amount: '500,000 VND', status: 'Chưa thanh toán' },
    { id: 2, customer: 'Trần Thị B', amount: '300,000 VND', status: 'Đã thanh toán' },
    { id: 3, customer: 'Lê Quang C', amount: '700,000 VND', status: 'Chưa thanh toán' },
  ]);

  // Cập nhật trạng thái hóa đơn
  const updateStatus = (id: number) => {
    setInvoices(invoices.map(invoice =>
      invoice.id === id ? { ...invoice, status: 'Đã thanh toán' } : invoice
    ));
  };

  // Xoá hóa đơn
  const deleteInvoice = (id: number) => {
    setInvoices(invoices.filter(invoice => invoice.id !== id));
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Quản lý Hóa đơn</h1>
      </div>
      <div className="invoiceList">
        <h3>Danh sách Hóa đơn</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Số tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id}>
                <td>{invoice.customer}</td>
                <td>{invoice.amount}</td>
                <td>{invoice.status}</td>
                <td>
                  <div className="nav-btn">
                    {invoice.status === 'Chưa thanh toán' && (
                      <button
                        onClick={() => updateStatus(invoice.id)}
                        className="updateButton" >Cập nhật
                      </button>
                    )}
                    <button
                      onClick={() => deleteInvoice(invoice.id)}
                      className="deleteButton" >Xoá
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}