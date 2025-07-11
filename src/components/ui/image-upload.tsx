"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeftIcon,
  CircleUserRoundIcon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon,
  Loader2Icon,
} from "lucide-react";

import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import {
  Cropper,
  CropperCropArea,
  CropperDescription,
  CropperImage,
} from "@/components/ui/cropper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

// Define type for pixel crop area
type Area = { x: number; y: number; width: number; height: number };

// Helper function to create a cropped image blob
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  outputWidth: number = pixelCrop.width,
  outputHeight: number = pixelCrop.height,
): Promise<Blob | null> {
  try {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      outputWidth,
      outputHeight,
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  } catch (error) {
    console.error("Error in getCroppedImg:", error);
    return null;
  }
}

// Helper function to upload cropped image to Bunny CDN
async function uploadCroppedImageToBunny(
  blob: Blob,
  originalFileName: string,
): Promise<string> {
  const formData = new FormData();

  // Create a file from the blob with a unique name
  const timestamp = Date.now();
  const fileExtension = originalFileName.split(".").pop() || "jpg";
  const fileName = `cropped_${timestamp}.${fileExtension}`;
  const file = new File([blob], fileName, { type: blob.type });

  formData.append("file", file);

  const response = await fetch("/api/bunny", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Upload failed");
  }

  const result = await response.json();
  return result.url;
}

interface ImageUploadProps {
  value?: string;
  onChange?: (value: string | null) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  onUploadStart?: () => void;
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: string) => void;
}

export function ImageUpload({
  value,
  onChange,
  size = "md",
  className = "",
  disabled = false,
  onUploadStart,
  onUploadComplete,
  onUploadError,
}: ImageUploadProps) {
  const [
    { files, isDragging, isUploading },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: "image/*",
  });

  const previewUrl = files[0]?.preview || null;
  const fileId = files[0]?.id;

  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(
    value || null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploadingCropped, setIsUploadingCropped] = useState(false);

  // Ref to track the previous file ID to detect new uploads
  const previousFileIdRef = useRef<string | undefined | null>(null);

  // State to store the desired crop area in pixels
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // State for zoom level
  const [zoom, setZoom] = useState(1);

  // Size classes
  const sizeClasses = {
    sm: "size-12",
    md: "size-16",
    lg: "size-20",
  };

  // Callback for Cropper to provide crop data
  const handleCropChange = useCallback((pixels: Area | null) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleApply = async () => {
    if (!previewUrl || !fileId || !croppedAreaPixels) {
      if (fileId) {
        removeFile(fileId);
        setCroppedAreaPixels(null);
      }
      return;
    }

    try {
      setIsUploadingCropped(true);
      onUploadStart?.();

      const croppedBlob = await getCroppedImg(previewUrl, croppedAreaPixels);

      if (!croppedBlob) {
        throw new Error("Failed to generate cropped image blob.");
      }

      // Get the original file name for the upload
      const originalFile = files[0]?.file;
      const originalFileName =
        originalFile instanceof File ? originalFile?.name : "image.jpg";

      // Upload the cropped image to Bunny CDN
      const uploadedUrl = await uploadCroppedImageToBunny(
        croppedBlob,
        originalFileName,
      );

      // Clean up the old blob URL if it exists
      if (finalImageUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(finalImageUrl);
      }

      setFinalImageUrl(uploadedUrl);
      onChange?.(uploadedUrl);
      onUploadComplete?.(uploadedUrl);
      setIsDialogOpen(false);

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error during apply:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      onUploadError?.(errorMessage);
      toast.error(`Upload failed: ${errorMessage}`);
      setIsDialogOpen(false);
    } finally {
      setIsUploadingCropped(false);
    }
  };

  const handleRemoveFinalImage = () => {
    if (finalImageUrl) {
      // Only revoke if it's a blob URL
      if (finalImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(finalImageUrl);
      }
    }
    setFinalImageUrl(null);
    onChange?.(null);
  };

  // Cleanup effect
  useEffect(() => {
    const currentFinalUrl = finalImageUrl;
    return () => {
      if (currentFinalUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(currentFinalUrl);
      }
    };
  }, [finalImageUrl]);

  // Effect to open dialog when a new file is ready
  useEffect(() => {
    if (fileId && fileId !== previousFileIdRef.current) {
      setIsDialogOpen(true);
      setCroppedAreaPixels(null);
      setZoom(1);
    }
    previousFileIdRef.current = fileId;
  }, [fileId]);

  // Update final image URL when value prop changes
  useEffect(() => {
    if (value !== finalImageUrl) {
      setFinalImageUrl(value || null);
    }
  }, [value, finalImageUrl]);

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative inline-flex">
        <button
          type="button"
          className={`border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex items-center justify-center overflow-hidden rounded-full border border-dashed transition-colors outline-none focus-visible:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none ${sizeClasses[size]}`}
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          aria-label={finalImageUrl ? "Change image" : "Upload image"}
          disabled={disabled || isUploading || isUploadingCropped}
        >
          {finalImageUrl ? (
            <img
              className="size-full object-cover"
              src={finalImageUrl}
              alt="User avatar preview"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon
                className={`${size === "sm" ? "size-3" : size === "md" ? "size-4" : "size-5"} opacity-60`}
              />
            </div>
          )}

          {/* Loading overlay */}
          {(isUploading || isUploadingCropped) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
              <Loader2Icon className="size-4 animate-spin text-white" />
            </div>
          )}
        </button>

        {finalImageUrl && (
          <Button
            type="button"
            onClick={handleRemoveFinalImage}
            size="icon"
            className="border-background focus-visible:border-background absolute -top-1 -right-1 size-6 rounded-full border-2 shadow-none"
            aria-label="Remove image"
            disabled={disabled || isUploading || isUploadingCropped}
          >
            <XIcon className="size-3.5" />
          </Button>
        )}

        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
          tabIndex={-1}
          disabled={disabled || isUploading || isUploadingCropped}
        />
      </div>

      {/* Cropper Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="gap-0 p-0 sm:max-w-140 *:[button]:hidden">
          <DialogDescription className="sr-only">
            Recortar imagem
          </DialogDescription>
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="flex items-center justify-between border-b p-4 text-base">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="-my-1 opacity-60"
                  onClick={() => setIsDialogOpen(false)}
                  aria-label="Cancel"
                  disabled={isUploadingCropped}
                >
                  <ArrowLeftIcon aria-hidden="true" />
                </Button>
                <span>Recortar imagem</span>
              </div>
              <Button
                type="button"
                className="-my-1"
                onClick={handleApply}
                disabled={!previewUrl || isUploadingCropped}
                autoFocus
              >
                {isUploadingCropped ? (
                  <>
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Aplicar"
                )}
              </Button>
            </DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <Cropper
              className="h-96 sm:h-120"
              image={previewUrl}
              zoom={zoom}
              onCropChange={handleCropChange}
              onZoomChange={setZoom}
            >
              <CropperDescription />
              <CropperImage />
              <CropperCropArea />
            </Cropper>
          )}
          <DialogFooter className="border-t px-4 py-6">
            <div className="mx-auto flex w-full max-w-80 items-center gap-4">
              <ZoomOutIcon
                className="shrink-0 opacity-60"
                size={16}
                aria-hidden="true"
              />
              <Slider
                defaultValue={[1]}
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={(value) => setZoom(value[0])}
                aria-label="Zoom slider"
                disabled={isUploadingCropped}
              />
              <ZoomInIcon
                className="shrink-0 opacity-60"
                size={16}
                aria-hidden="true"
              />
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
