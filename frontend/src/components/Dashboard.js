import React, { useState, useEffect } from "react";

// Customer Component
function CustomerComponent({ customers, setCustomers }) {
  const [customer_name, setCustomerName] = useState("");
  const [customer_email, setCustomerEmail] = useState("");

  async function createNewCustomer(e) {
    e.preventDefault();

    const response = await fetch("http://localhost/api/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_name,
        customer_email,
      }),
    });

    const data = await response.json();

    if (data.customer_id) {
      setCustomers([...customers, data]);
    }

    setCustomerName("");
    setCustomerEmail("");
  }

  async function doDelete(customer_id) {
    await fetch(`http://localhost/api/customers/${customer_id}`, {
      method: "DELETE",
    });

    setCustomers(customers.filter((customer) => customer.customer_id !== customer_id));
  }

  function toggleExpanded(index) {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer, i) => ({
        ...customer,
        expanded: i === index ? !customer.expanded : customer.expanded,
      }))
    );
  }

  return (
    <div className="customer-component">
      <form onSubmit={createNewCustomer}>
        <input
          type="text"
          placeholder="Customer Name"
          value={customer_name}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Customer Email Address"
          value={customer_email}
          onChange={(e) => setCustomerEmail(e.target.value)}
        />
        <button type="submit">Create New Customer</button>
      </form>
      <div className="customer-list">
        <h2>Customers</h2>
        {customers.map((item, index) => (
          <div key={item.customer_id} onClick={() => toggleExpanded(index)}>
            <div>
              <strong>Customer Name:</strong> {item.customer_name}
              <strong>Email:</strong> {item.customer_email}
            </div>
            {item.expanded && (
              <div>
                <button onClick={() => doDelete(item.customer_id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Item Component
function ItemComponent({ items, setItems }) {
  const [item_name, setItemName] = useState("");
  const [item_price, setItemPrice] = useState("");

  async function createItem(e) {
    e.preventDefault();

    const response = await fetch("http://localhost/api/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        item_name,
        item_price: parseInt(item_price),
      }),
    });

    const data = await response.json();

    if (data.item_id) {
      setItems([...items, data]);
    }

    setItemName("");
    setItemPrice("");
  }

  async function doDelete(item_id) {
    await fetch(`http://localhost/api/items/${item_id}`, { method: "DELETE" });
    setItems(items.filter((item) => item.item_id !== item_id));
  }

  function toggleExpanded(index) {
    setItems((prevItems) =>
      prevItems.map((item, i) => ({
        ...item,
        expanded: i === index ? !item.expanded : item.expanded,
      }))
    );
  }

  return (
    <div className="item-component">
      <form onSubmit={createItem}>
        <input
          type="text"
          placeholder="Item Name"
          value={item_name}
          onChange={(e) => setItemName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Item Price"
          value={item_price}
          onChange={(e) => setItemPrice(e.target.value)}
        />
        <button type="submit">Create New Item</button>
      </form>
      <div className="item-list">
        <h2>Items</h2>
        {items.map((item, index) => (
          <div key={item.item_id} onClick={() => toggleExpanded(index)}>
            <div>
              <strong>Item Name:</strong> {item.item_name}
              <strong>Price:</strong> {item.item_price}
            </div>
            {item.expanded && (
              <div>
                <button onClick={() => doDelete(item.item_id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Order Component
function OrderComponent({ orders, setOrders, items, customers }) {
  const [orderDate, setOrderDate] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [itemId, setItemId] = useState("");

  async function createOrder(e) {
    e.preventDefault();

    const response = await fetch("http://localhost/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_date: orderDate,
        customer_id: customerId,
        item_id: itemId,
      }),
    });

    const newOrder = await response.json();
    if (newOrder.order_id) {
      setOrders([...orders, newOrder]);
    }

    setOrderDate("");
    setCustomerId("");
    setItemId("");
  }

  async function deleteOrder(orderId) {
    await fetch(`http://localhost/api/orders/${orderId}`, { method: "DELETE" });
    setOrders(orders.filter((order) => order.order_id !== orderId));
  }

  return (
    <div className="order-component">
      <h2>Orders</h2>
      <form onSubmit={createOrder}>
        <input
          type="date"
          value={orderDate}
          onChange={(e) => setOrderDate(e.target.value)}
        />
        <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option key={customer.customer_id} value={customer.customer_id}>
              {customer.customer_name}
            </option>
          ))}
        </select>
        <select value={itemId} onChange={(e) => setItemId(e.target.value)}>
          <option value="">Select Item</option>
          {items.map((item) => (
            <option key={item.item_id} value={item.item_id}>
              {item.item_name}
            </option>
          ))}
        </select>
        <button type="submit">Create Order</button>
      </form>
      <div className="order-list">
        {orders.map((order) => (
          <div key={order.order_id}>
            <div>
              <strong>Order ID:</strong> {order.order_id}
              <strong>Date:</strong> {new Date(order.order_date).toLocaleDateString()}
              <strong>Customer:</strong> {order.customer_name}
              <strong>Item:</strong> {order.item_name}
            </div>
            <button onClick={() => deleteOrder(order.order_id)}>Delete Order</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Component
export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const [customersRes, itemsRes, ordersRes] = await Promise.all([
        fetch("http://localhost/api/customers"),
        fetch("http://localhost/api/items"),
        fetch("http://localhost/api/orders"),
      ]);

      setCustomers(await customersRes.json());
      setItems(await itemsRes.json());
      setOrders(await ordersRes.json());
    }

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <CustomerComponent customers={customers} setCustomers={setCustomers} />
      <ItemComponent items={items} setItems={setItems} />
      <OrderComponent orders={orders} setOrders={setOrders} items={items} customers={customers} />
    </div>
  );
}
