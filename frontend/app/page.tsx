"use client";

import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
interface LineItem {
  name: string;
  amount: number;
}

interface ReceiptData {
  merchant: string | null;
  date: string | null;
  lineItems: LineItem[];
  total: number;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [savedReceipts, setSavedReceipts] =
    useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [receiptData, setReceiptData] =
    useState<ReceiptData | null>(null);


  const fetchReceipts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/receipts"
      );
      setSavedReceipts(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(()=>{
    fetchReceipts();
  }, [])

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("receipt", file);

      const response = await axios.post(
        "http://localhost:5000/api/receipts/upload",
        formData
      );

      setReceiptData(response.data.data);

    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const updateLineItem = (
    index: number,
    field: keyof LineItem,
    value: string
  ) => {
    if (!receiptData) return;

    const updatedItems = [...receiptData.lineItems];

    updatedItems[index] = {
      ...updatedItems[index],
      [field]:
        field === "amount"
          ? Number(value)
          : value,
    };

    setReceiptData({
      ...receiptData,
      lineItems: updatedItems,
    });
  };


  const handleSave = async () => {

    if (!receiptData) return;

    try {

      await axios.post(
        "http://localhost:5000/api/receipts/save",
        receiptData
      );

      alert("Receipt saved successfully");
      fetchReceipts();

    } catch (error) {

      console.error(error);

      alert("Failed to save receipt");
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-8 min-h-screen bg-gray-50">

      <h1 className="text-3xl font-bold mb-6">
        Receipt Parser AI
      </h1>

      <div className="mt-10 space-y-6 bg-white p-6 rounded-xl shadow">

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFile(e.target.files?.[0] || null)
          }
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "AI is extracting..." : "Upload Receipt"}
        </button>

      </div>
      <p className="text-sm text-gray-500 mt-2">
        AI extraction may contain mistakes.
        Please review and correct fields before saving.
      </p>

      {receiptData && (

        <div className="mt-10 space-y-6">

          <div>
            <label className="font-semibold">
              Merchant
            </label>

            <input
              type="text"
              value={receiptData.merchant || ""}
              onChange={(e) =>
                setReceiptData({
                  ...receiptData,
                  merchant: e.target.value,
                })
              }
              className="border rounded-lg p-3 w-full mt-1"
            />
          </div>

          <div>
            <label className="font-semibold">
              Date
            </label>

            <input
              type="text"
              value={receiptData.date || ""}
              onChange={(e) =>
                setReceiptData({
                  ...receiptData,
                  date: e.target.value,
                })
              }
              className="border rounded-lg p-3 w-full mt-1"
            />
          </div>

          <div>

            <h2 className="font-bold text-xl mb-3">
              Line Items
            </h2>

            <div className="space-y-3">

              {receiptData.lineItems.map(
                (item, index) => (

                  <div
                    key={index}
                    className="grid grid-cols-2 gap-4"
                  >

                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        updateLineItem(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      className="border rounded-lg p-3 w-full"
                    />

                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) =>
                        updateLineItem(
                          index,
                          "amount",
                          e.target.value
                        )
                      }
                      className="border rounded-lg p-3 w-full"
                    />

                  </div>
                )
              )}

            </div>

          </div>

          <div>
            <label className="font-semibold">
              Total
            </label>

            <input
              type="number"
              value={receiptData.total}
              onChange={(e) =>
                setReceiptData({
                  ...receiptData,
                  total: Number(e.target.value),
                })
              }
              className="border rounded-lg p-3 w-full mt-1"
            />
          </div>

          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Receipt
          </button>

          <div className="mt-12">

            <h2 className="text-2xl font-bold mb-4">
              Saved Receipts
            </h2>

            <div className="space-y-4">    

            </div>

          </div>

        </div>
      )}

      {savedReceipts.map((receipt) => (

                <div
                  key={receipt.id}
                  className="bg-white shadow rounded-xl p-4"
                >

                  <div className="flex justify-between">
                    <h3 className="font-bold">
                      {receipt.merchant || "Unknown"}
                    </h3>

                    <p>₹ {receipt.total}</p>
                  </div>

                  <p className="text-sm text-gray-500">
                    {receipt.date}
                  </p>

                </div>

              ))}

    </main>
  );
}