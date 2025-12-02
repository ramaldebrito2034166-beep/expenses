import type { VercelRequest, VercelResponse } from '@vercel/node';

type Expense = {
  id: number;
  amount: number;
  description: string;
  category: string;
  date: string; // ISO string
};

// In-memory store (reset whenever the function is cold-started/redeployed)
const expenses: Expense[] = [];
let nextId = 1;

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    // Return all expenses
    return res.status(200).json({
      success: true,
      data: expenses,
    });
  }

  if (req.method === 'POST') {
    const { amount, description, category, date } = req.body || {};

    // Basic validation for required fields
    const missingFields: string[] = [];
    if (amount === undefined || amount === null) missingFields.push('amount');
    if (!description) missingFields.push('description');
    if (!category) missingFields.push('category');
    if (!date) missingFields.push('date');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        missingFields,
      });
    }

    // Optional extra validation
    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount)) {
      return res.status(400).json({
        success: false,
        error: 'Field "amount" must be a valid number',
      });
    }

    const parsedDat
