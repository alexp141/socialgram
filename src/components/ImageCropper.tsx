"use client";

import "react-image-crop/dist/ReactCrop.css";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  SyntheticEvent,
  useRef,
  useState,
} from "react";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import setCanvasPreview from "@/lib/setCanvasPreview";
import Image from "next/image";
import { toast } from "react-toastify";

export default function ImageCropper({
  cropMinimumWidth,
  cropAspectRatio = 1,
  fileName,
  inputName,
  setIsCropperOpen,
  updateImage,
  exteriorInputRef,
  circularCrop,
  isPostImage = false,
}: {
  cropMinimumWidth: number;
  cropAspectRatio?: number;
  fileName: string;
  inputName: string;
  setIsCropperOpen: Dispatch<SetStateAction<boolean>>;
  updateImage: Dispatch<SetStateAction<string>>;
  exteriorInputRef: MutableRefObject<HTMLInputElement | null>;
  circularCrop: boolean;
  isPostImage?: boolean;
}) {
  const [imageSource, setImageSource] = useState<string>("");
  const [fileExtension, setFileExtension] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [userHasCropped, setUserHasCropped] = useState(false);
  const [error, setError] = useState("");

  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const ACCEPTED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    if (e.target.files) {
      setCrop(undefined);

      //validating the mime type
      if (!ACCEPTED_IMAGE_MIME_TYPES.includes(e.target.files[0].type)) {
        toast.error("only jpg, png and webp images are allowed");
        setError("only jpg, png and webp images are allowed");
        setImageSource("");
        return;
      }
      const fr = new FileReader();
      fr.addEventListener("load", () => {
        setImageSource(fr.result?.toString() || "");
      });
      fr.readAsDataURL(e.target.files[0]);
      setFileExtension(e.target.files[0].name.split(".")[1]);
    }
  }

  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth < cropMinimumWidth || naturalHeight < cropMinimumWidth) {
      setError(
        `The image must be at least ${cropMinimumWidth} x ${cropMinimumWidth} pixels`
      );
      setImageSource("");
      return;
    }
    const crop = makeAspectCrop(
      {
        unit: "px",
        width: cropMinimumWidth,
      },
      cropAspectRatio,
      width,
      height
    );

    setCrop(centerCrop(crop, width, height));
  }

  function cropImage() {
    console.log("in crop image()");
    if (imgRef.current && canvasRef.current && completedCrop) {
      //create the canvas
      setCanvasPreview(imgRef.current, canvasRef.current, completedCrop);

      //convert the canvas to a blob
      canvasRef.current.toBlob(
        (blob) => {
          if (blob) {
            let completeFilename;
            if (isPostImage) {
              //no cache busting necessary if the file is an image post
              completeFilename = `${fileName}.${fileExtension}`;
            } else {
              //utilizing cache busting to update the image in real time from the storage bucket
              //by inserting a random query string
              completeFilename = `${fileName}.${fileExtension}?rand=${
                Math.random() * 10000
              }`;
            }

            const file = new File([blob], completeFilename, {
              type: blob.type,
            });
            if (
              inputRef.current &&
              inputRef.current.files &&
              exteriorInputRef.current
            ) {
              // creating new file list and replacing the old one
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(file);

              exteriorInputRef.current.files = dataTransfer.files;

              console.log("input value", inputRef.current);
            } else {
              toast.error(
                "An error occured, please make sure you only use jpg, jpeg, png, avif, svg, or webp images"
              );
              throw new Error("Filelist does not exist for input");
            }
          }
        },
        "image/*",
        0.7
      );
    } else {
      console.error("fail");
      throw new Error("Error while cropping");
    }
  }

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      {!error && (
        <p className="text-emerald-500 my-2">
          Only jpg, png and webp images are allowed
        </p>
      )}
      {imageSource && (
        <div className="flex gap-8 flex-col md:flex-row">
          <div className="flex flex-col items-center gap-4">
            <ReactCrop
              crop={crop}
              circularCrop={circularCrop}
              onChange={(pc) => setCrop(pc)}
              keepSelection
              aspect={!isPostImage ? cropAspectRatio : undefined}
              minWidth={cropMinimumWidth}
              onComplete={(c) => {
                console.log("on complete");
                setCompletedCrop(c);
              }}
            >
              <Image
                ref={imgRef}
                width="0"
                height="0"
                className="w-64 h-auto"
                src={imageSource}
                alt="image that will be cropped"
                onLoad={onImageLoad}
              />
            </ReactCrop>
            <button
              type="button"
              onClick={() => {
                cropImage();
                setUserHasCropped(true);
              }}
              className="border-2 border-sky-100 rounded-full bg-sky-500 px-4 py-2 text-sky-50"
            >
              Crop
            </button>
          </div>
          <div className="flex flex-col items-center gap-4 ">
            <canvas
              className={`max-w-48 md:max-w-64 h-auto border ${
                circularCrop ? "rounded-full" : ""
              } ${userHasCropped ? "block" : "hidden"}`}
              ref={canvasRef}
            />

            {userHasCropped && (
              <button
                type="button"
                onClick={() => {
                  //update preview image to the cropped version
                  updateImage(canvasRef.current!.toDataURL());
                  setIsCropperOpen(false);
                }}
                className="border-2 border-sky-100 rounded-full bg-emerald-500 px-4 py-2 text-sky-50"
              >
                Accept
              </button>
            )}
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        name={inputName}
        id={inputName}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
      />
    </div>
  );
}
