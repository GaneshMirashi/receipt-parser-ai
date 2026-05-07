import { Request, Response } from "express";
import { extractReceiptData } from "../services/geminiService";
import db from "../db/database";

export const uploadReceipt = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
      return;
    }

    const imagePath = req.file.path;

    const extractedData =
      await extractReceiptData(imagePath);

    res.status(200).json({
      success: true,
      data: extractedData,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to process receipt",
    });
  }
};



export const saveReceipt = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {

    const {
      merchant,
      date,
      lineItems,
      total,
    } = req.body;

    db.run(
      `
      INSERT INTO receipts
      (merchant, date, lineItems, total)
      VALUES (?, ?, ?, ?)
      `,
      [
        merchant,
        date,
        JSON.stringify(lineItems),
        total,
      ],
      function (err) {

        if (err) {
          res.status(500).json({
            success: false,
            message: err.message,
          });
          return;
        }

        res.status(201).json({
          success: true,
          message: "Receipt saved",
          receiptId: this.lastID,
        });

      }
    );

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to save receipt",
    });

  }
};



export const getReceipts = async (
  req: Request,
  res: Response
): Promise<void> => {

  db.all(
    `SELECT * FROM receipts ORDER BY id DESC`,
    [],
    (err, rows) => {

      if (err) {
        res.status(500).json({
          success: false,
        });
        return;
      }

      const formatted = rows.map((receipt: any) => ({
        ...receipt,
        lineItems: JSON.parse(receipt.lineItems),
      }));

      res.status(200).json({
        success: true,
        data: formatted,
      });

    }
  );
};