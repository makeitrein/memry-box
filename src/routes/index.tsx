import 'aframe';
import 'mind-ar/dist/mindar-image-aframe.prod.js';
import { Compiler } from 'mind-ar/dist/mindar-image.prod.js';
import { Webcam, getScreenshot } from "solid-webcam";
// import { save } from "@tauri-apps/plugin-dialog";

// const saveImage = async (dataUrl) => {
//   const suggestedFilename = "image.png";

//   // Save into the default downloads directory, like in the browser
//   const filePath = await save({
//     defaultPath: (await downloadsDir()) + "/" + suggestedFilename,
//   });

//   // Now we can write the file to the disk
//   await writeBinaryFile(file, await fetch(dataUrl).then((res) => res.blob()));
// };

// // then something like


const videoConstraints = {
  minScreenshotWidth: 400,
  minScreenshotHeight: 400,
  facingMode: "user",
};

const compiler = new Compiler();

const loadImage = async (base64String: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = base64String;
  });
};

export default function WebcamWrapper() {
  let webcamRef!: HTMLVideoElement;

  console.log("compiler", compiler)

  const capture = async () => {
    const imageSrc = getScreenshot(webcamRef, videoConstraints);
    if (!imageSrc) {
      console.error("No image source");
      return;
    }
    const images= [await loadImage(imageSrc)]
    await compiler.compileImageTargets(images, (progress: number) => {
      console.log('progress: ' + progress.toFixed(2) + "%");
    });
    const exportedBuffer = await compiler.exportData();
    console.log("exportedBuffer", exportedBuffer)
  };

  return (
    <>
      <Webcam audio={false} width={400} height={400} ref={webcamRef} />
      <button onClick={capture}>Capture photo</button>
    </>
  );
};