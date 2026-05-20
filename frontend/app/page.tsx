"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import {
  UploadCloud,
  Receipt,
  Save,
  Loader2,
  Sparkles,
} from "lucide-react";

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

  const [savedReceipts, setSavedReceipts] = useState<any[]>([]);

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

  useEffect(() => {
    fetchReceipts();
  }, []);

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
    <main className="min-h-screen bg-black text-white">

      {/* Background Glow */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/20 blur-[120px]" />

        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/20 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* HERO */}
        <div className="text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-blue-400" />
            AI Powered Receipt Extraction
          </div>

          <h1 className="mt-6 text-5xl font-bold tracking-tight">
            Receipt Parser AI
          </h1>

          <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
            Upload receipts, extract structured data using AI,
            review fields, and securely store verified receipts.
          </p>
        </div>

        {/* Upload Card */}
        <div className="mt-14 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl">

          <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center hover:border-blue-500/40 transition">

            <UploadCloud className="mx-auto h-14 w-14 text-blue-400" />

            <h2 className="mt-4 text-2xl font-semibold">
              Upload Receipt
            </h2>

            <p className="mt-2 text-gray-400">
              JPG, PNG or receipt image supported
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFile(e.target.files?.[0] || null)
              }
              className="mt-6 block w-full text-sm text-gray-400
              file:mr-4 file:rounded-xl file:border-0
              file:bg-white file:px-4 file:py-2
              file:text-black hover:file:bg-gray-200"
            />

            <button
              onClick={handleUpload}
              disabled={loading}
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-medium text-black transition hover:scale-105 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  AI Processing...
                </>
              ) : (
                <>
                  <UploadCloud className="h-4 w-4" />
                  Upload Receipt
                </>
              )}
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            AI extraction may contain mistakes.
            Review all fields before saving.
          </p>
        </div>

        {/* Receipt Preview */}
        {receiptData && (
          <div className="mt-14 grid lg:grid-cols-3 gap-8">

            {/* Left */}
            <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl">

              <div className="flex items-center gap-3 mb-8">
                <Receipt className="text-blue-400" />
                <h2 className="text-2xl font-bold">
                  Extracted Receipt
                </h2>
              </div>

              <div className="space-y-6">

                <div>
                  <label className="text-sm text-gray-400">
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
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 p-4 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400">
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
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 p-4 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Line Items
                  </h3>

                  <div className="space-y-4">

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
                            className="rounded-xl border border-white/10 bg-black/40 p-4 outline-none focus:border-blue-500"
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
                            className="rounded-xl border border-white/10 bg-black/40 p-4 outline-none focus:border-blue-500"
                          />
                        </div>
                      )
                    )}

                  </div>
                </div>
              </div>
            </div>

            {/* Right Summary */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl h-fit">

              <h2 className="text-2xl font-bold">
                Summary
              </h2>

              <div className="mt-8 space-y-5">

                <div className="flex justify-between">
                  <span className="text-gray-400">
                    Merchant
                  </span>

                  <span>
                    {receiptData.merchant}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">
                    Items
                  </span>

                  <span>
                    {receiptData.lineItems.length}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-green-400">
                    ₹ {receiptData.total}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSave}
                className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 px-6 py-4 font-medium text-black transition hover:scale-[1.02]"
              >
                <Save className="h-4 w-4" />
                Save Receipt
              </button>
            </div>
          </div>
        )}

        {/* Saved Receipts */}
        <div className="mt-20">

          <h2 className="text-3xl font-bold">
            Saved Receipts
          </h2>

          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {savedReceipts.map((receipt) => (

              <div
                key={receipt.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl transition hover:-translate-y-1 hover:border-white/20"
              >

                <div className="flex items-center justify-between">

                  <h3 className="font-semibold text-lg">
                    {receipt.merchant || "Unknown"}
                  </h3>

                  <span className="text-green-400 font-bold">
                    ₹ {receipt.total}
                  </span>
                </div>

                <p className="mt-2 text-sm text-gray-400">
                  {receipt.date}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm text-blue-400">
                  <Receipt className="h-4 w-4" />
                  AI Parsed Receipt
                </div>
              </div>

            ))}

          </div>
        </div>
      </div>
    </main>
  );
}