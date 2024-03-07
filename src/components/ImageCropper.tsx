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

export default function ImageCropper({
  cropMinimumWidth,
  cropAspectRatio,
  fileName,
  inputName,
  setIsCropperOpen,
  updateImage,
  exteriorInputRef,
  circularCrop,
}: {
  cropMinimumWidth: number;
  cropAspectRatio: number;
  fileName: string;
  inputName: string;
  setIsCropperOpen: Dispatch<SetStateAction<boolean>>;
  updateImage: Dispatch<SetStateAction<string>>;
  exteriorInputRef: MutableRefObject<HTMLInputElement | null>;
  circularCrop: boolean;
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

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    if (e.target.files) {
      setCrop(undefined);
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
            //utilizing cache busting to update the image in real time from the storage bucket
            //by inserting a random query string
            const randNum = Math.random() * 10000;
            const file = new File(
              [blob],
              `${fileName}.${fileExtension}?rand=${randNum}`,
              {
                type: blob.type,
              }
            );
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
              updateImage(canvasRef.current!.toDataURL());
            } else {
              throw new Error("Filelist does not exist for input");
            }
          }
        },
        "image/*",
        1.0
      );
    } else {
      console.error("fail");
      throw new Error("Error while cropping");
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        name={inputName}
        id={inputName}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
      />
      {error && <p className="text-red-500">{error}</p>}
      {imageSource && (
        <>
          <ReactCrop
            crop={crop}
            circularCrop={circularCrop}
            onChange={(pc) => setCrop(pc)}
            keepSelection
            aspect={cropAspectRatio}
            minWidth={cropMinimumWidth}
            onComplete={(c) => {
              console.log("on complete");
              setCompletedCrop(c);
            }}
          >
            <img
              ref={imgRef}
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
          >
            crop image
          </button>
          {userHasCropped && (
            <button type="button" onClick={() => setIsCropperOpen(false)}>
              accept
            </button>
          )}
          <canvas
            className={`w-64 h-auto border ${
              circularCrop ? "rounded-full" : ""
            } ${userHasCropped ? "block" : "hidden"}`}
            ref={canvasRef}
          />
        </>
      )}
    </>
  );
}
