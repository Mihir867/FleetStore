// Please don't change the pre-written code
// Import the necessary modules here

import { createNewOrderRepo } from "../model/order.repository.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";

export const createNewOrder = async (req, res, next) => {
  try {
    // Assuming that the required order data is present in req.body
    const orderData = req.body;

    // Call the repository function to create a new order
    const newOrder = await createNewOrderRepo(orderData);

    // Send a success response with the new order details
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    // Handle any errors that occur during the order creation process
    return next(new ErrorHandler(500, "Error placing a new order"));
  }
};
