import OrderModel from "./order.schema.js";

export const createNewOrderRepo = async (data) => {
  try {
    const newOrder = new OrderModel({
      shippingInfo: data.shippingInfo,
      orderedItems: data.orderedItems,
      user: data.user,
      paymentInfo: data.paymentInfo,
      paidAt: data.paidAt,
      itemsPrice: data.itemsPrice,
      taxPrice: data.taxPrice,
      shippingPrice: data.shippingPrice,
      totalPrice: data.totalPrice,
      orderStatus: data.orderStatus,
      deliveredAt: data.deliveredAt,
      createdAt: data.createdAt,
    });

    // Save the new order to the database
    const savedOrder = await newOrder.save();

    return savedOrder;
  } catch (error) {
    throw error; // You can handle the error as per your application's requirements
  }
};
