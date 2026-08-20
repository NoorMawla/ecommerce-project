"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { uploadProductImage } from "@/app/(admin)/admin/products/upload-action";

export default function ImageDropzone({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const [imageUrl, setImageUrl] = useState(defaultValue || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const url = await uploadProductImage(formData);
      setImageUrl(url);
    } catch (err) {
      setError("Upload failed. Try a different image.");
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Product Image</label>

      <input type="hidden" name={name} value={imageUrl} />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded p-6 text-center cursor-pointer min-h-[160px] flex flex-col items-center justify-center gap-2 ${
          dragActive ? "border-black bg-gray-50" : "border-gray-300"
        }`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Product preview"
            width={120}
            height={120}
            className="rounded object-cover"
          />
        ) : uploading ? (
          <p className="text-gray-500">Uploading…</p>
        ) : (
          <p className="text-gray-500">
            Drag and drop an image here, or click to browse
          </p>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}