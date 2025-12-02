// api/expenses.js

// In-memory store (resets when the serverless function is cold-started)
let expenses = [];

/**
 * Serverless function handler compatible with Vercel
 * Endpoint: /api/expenses
 */
export default function handler(req, res) {
  // Allow only GET and POST
  const { method } = req;

  if (method === "GET") {
    // Return all expenses
    return res.status(200).json({
      success: true,
      data: expenses,
    });
  }

  if (method === "POST") {
    // Expect JSON body with: amount, description, category, date
    let body = req.body;

    // In some setups, body might be a JSON string
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (err) {
        return res.status(400).json({
          success: false,
          error: "Invalid JSON body.",
        });
      }
    }

    const { amount, description, category, date } = body || {};

    // Validate required fields
    const missingFields = [];
    if (amount === undefined || amount === null) missingFields.push("amount");
    if (!description) missingFields.push("description");
    if (!category) missingFields.push("category");
    if (!date) missingFields.push("date");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields.",
        missingFields,
      });
    }

    // Extra simple type/format checks
    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount)) {
      return res.status(400).json({
        success: false,
        error: "Field 'amount' must be a number.",
      });
    }

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Field 'date' must be a valid date string.",
      });
    }

    const newExpense = {
      id: expenses.length + 1,
      amount: numericAmount,
      description,
      category,
      date: parsedDate.toISOString(), // store normalized ISO string
    };

    expenses.push(newExpense);

    return res.status(201).json({
      success: true,
      data: newExpense,
    });
  }

  // Method not allowed
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({
    success: false,
    error: `Method ${method} Not Allowed`,
  });
}
