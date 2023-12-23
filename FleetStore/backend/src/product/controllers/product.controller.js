// Please don't change the pre-written code
// Import the necessary modules here

import { ErrorHandler } from "../../../utils/errorHandler.js";
import {
  addNewProductRepo,
  deleProductRepo,
  findProductRepo,
  getAllProductsRepo,
  getProductDetailsRepo,
  getTotalCountsOfProduct,
  updateProductRepo,
} from "../model/product.repository.js";
import ProductModel from "../model/product.schema.js";

export const addNewProduct = async (req, res, next) => {
  try {
    const product = await addNewProductRepo({
      ...req.body,
      createdBy: req.user._id,
    });
    if (product) {
      res.status(201).json({ success: true, product });
    } else {
      return next(new ErrorHandler(400, "some error occured!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    // Extracting query parameters from the request
    const { search, category, sortBy, sortOrder, page, limit } = req.query;

    // Building the query object
    let query = {};

    // Searching
    if (search) {
      // Example: Searching by product name
      query = { ...query, name: { $regex: new RegExp(search), $options: "i" } };
    }

    // Filtering by category
    if (category) {
      query = { ...query, category };
    }

    // Sorting
    let sortOption = {};
    if (sortBy) {
      sortOption[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    // Pagination
    const pageOptions = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    };
    const skip = (pageOptions.page - 1) * pageOptions.limit;

    // Fetching products based on the query and pagination options
    const products = await getAllProductsRepo(query, sortOption, skip, pageOptions.limit);

    // Fetching total count of products for pagination
    const totalCount = await getTotalCountsOfProduct(query);

    // Sending the response
    res.status(200).json({
      success: true,
      products,
      totalCount,
      currentPage: pageOptions.page,
      totalPages: Math.ceil(totalCount / pageOptions.limit),
    });
  } catch (error) {
    // Handling errors
    return next(new ErrorHandler(500, "Error fetching products"));
  }
};


export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await updateProductRepo(req.params.id, req.body);
    if (updatedProduct) {
      res.status(200).json({ success: true, updatedProduct });
    } else {
      return next(new ErrorHandler(400, "Product not found!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await deleProductRepo(req.params.id);
    if (deletedProduct) {
      res.status(200).json({ success: true, deletedProduct });
    } else {
      return next(new ErrorHandler(400, "Product not found!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const getProductDetails = async (req, res, next) => {
  try {
    const productDetails = await getProductDetailsRepo(req.params.id);
    if (productDetails) {
      res.status(200).json({ success: true, productDetails });
    } else {
      return next(new ErrorHandler(400, "Product not found!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const rateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { rating, comment } = req.body;
    const user = req.user._id;
    const name = req.user.name;

    if (!rating) {
      return next(new ErrorHandler(400, "Rating can't be empty"));
    }

    const product = await findProductRepo(productId);
    if (!product) {
      return next(new ErrorHandler(400, "Product not found!"));
    }

    const findReviewIndex = product.reviews.findIndex((rev) => rev.user.toString() === user.toString());

    if (findReviewIndex >= 0) {
      product.reviews[findReviewIndex] = { user, name, rating: Number(rating), comment };
    } else {
      product.reviews.push({ user, name, rating: Number(rating), comment });
    }

    // Calculating average rating
    const avgRating = product.reviews.reduce((sum, rev) => sum + rev.rating, 0) / product.reviews.length;
    product.rating = avgRating;

    await product.save({ validateBeforeSave: false });

    res.status(201).json({ success: true, msg: "Thanks for rating the product", product });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};


export const getAllReviewsOfAProduct = async (req, res, next) => {
  try {
    const product = await findProductRepo(req.params.id);
    if (!product) {
      return next(new ErrorHandler(400, "Product not found!"));
    }
    res.status(200).json({ success: true, reviews: product.reviews });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { productId, reviewId } = req.query;

    if (!productId || !reviewId) {
      return next(new ErrorHandler(400, "Please provide productId and reviewId as query params"));
    }

    const product = await findProductRepo(productId);
    if (!product) {
      return next(new ErrorHandler(400, "Product not found!"));
    }

    const reviewIndex = product.reviews.findIndex((rev) => rev._id.toString() === reviewId.toString());

    if (reviewIndex < 0) {
      return next(new ErrorHandler(400, "Review doesn't exist"));
    }

    const deletedReview = product.reviews[reviewIndex];
    product.reviews.splice(reviewIndex, 1);

    // Recalculate average rating if needed

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      msg: "Review deleted successfully",
      deletedReview,
      product,
    });
  } catch (error) {
    return next(new ErrorHandler(500, error));
  }
};
