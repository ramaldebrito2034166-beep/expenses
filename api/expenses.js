// api/expenses.js

// NOTE: This array persists only as long as the serverless container is "warm".
// In a real application, you must replace this with a database connection.
const expenses = [];

export default function handler(req, res) {
  const { method } = req;

  // 1. Handle GET Request
  if (method === 'GET') {
    return res.status(200).json({
      success: true,
      data: expenses,
    });
  }

  // 2. Handle POST Request
  if (method === 'POST') {
    const { amount, description, category, date } = req.body;

    // Validation: Check for missing fields
    if (!amount || !description || !category || !date) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Please provide amount, description, category, and date.',
      });
    }

    // Create the new expense object
    const newExpense = {
      id: Date.now().toString(), // Simple ID generation
      amount: parseFloat(amount),
      description,
      category,
      date,
      createdAt: new Date().toISOString(),
    };

    // Add to memory array
    expenses.push(newExpense);

    return res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: newExpense,
    });
  }

  // 3. Handle Unsupported Methods
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({
    success: false,
    error: `Method ${method} Not Allowed`,
  });
}
