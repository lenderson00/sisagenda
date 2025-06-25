"use client";

import { UploadCloud } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

export type FileMetadata = {
  url: string;
  name: string;
  type: string;
  size: number;
};

type FileUploaderProps = {
  onUploadComplete: (metadata: FileMetadata) => void;
};

export function FileUploader({ onUploadComplete }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true);
      const file = acceptedFiles[0];

      if (!file) {
        setIsUploading(false);
        return;
      }

      // Client-side validation
      if (file.size > 5 * 1024 * 1024) {
        toast.error("O arquivo não pode ser maior que 5MB.");
        setIsUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/bunny", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Falha no upload do arquivo.");
        }

        const result = await response.json();

        const metadata: FileMetadata = {
          url: result.url,
          name: file.name,
          type: file.type,
          size: file.size,
        };

        onUploadComplete(metadata);
        toast.success("Upload do arquivo concluído com sucesso!");
      } catch (error) {
        console.error(error);
        toast.error("Ocorreu um erro durante o upload do arquivo.");
      } finally {
        setIsUploading(false);
      }
    },
    [onUploadComplete],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".jpeg", ".jpg", ".png"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
      ${
        isDragActive
          ? "border-primary bg-primary-foreground"
          : "border-gray-300 hover:border-primary"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2 text-gray-500">
        <UploadCloud className="w-12 h-12" />
        {isUploading ? (
          <p>Enviando...</p>
        ) : isDragActive ? (
          <p>Solte o arquivo aqui...</p>
        ) : (
          <>
            <p className="font-semibold">
              Clique para fazer upload ou arraste e solte
            </p>
            <p className="text-sm">PDF ou Imagem (max. 5MB)</p>
          </>
        )}
      </div>
    </div>
  );
}
