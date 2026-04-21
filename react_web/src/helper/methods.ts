import { apiHandler } from "@/utils/apiHandler/service";
import { GET_CLOUDINARY_SIGNATURE, UPLOAD_CLOUDINARY } from "./endpoints";

export const getDate = (data: Date) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const _ = new Date(data);
  const date = _.getDate();
  const month = _.getMonth();
  const year = _.getFullYear();
  return `${months[month]} ${date},${year}`;
};

export const getRandomColor = () => {
  return (
    "hsl(" +
    360 * Math.random() +
    "," +
    (25 + 70 * Math.random()) +
    "%," +
    (65 + 10 * Math.random()) +
    "%)"
  );
};

export const getBlogId = (path: string) => {
  return path.split('/')[2]
}

// UPLOAD IMAGE TO CLOUDINARY
export const uploadToCloudinary = async (file: File | Blob) => {
  try {
    const res: any = await apiHandler.get(GET_CLOUDINARY_SIGNATURE);
    const { folder, signature, timestamp } = res.data;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);
    formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
    const uploadRes = await fetch(
      UPLOAD_CLOUDINARY,
      {
        method: "POST",
        body: formData
      }
    );
    const ress = await uploadRes.json()
    return ress.url

  } catch (error) {
    console.error('uploadToCloudinary::', error)
  }
}

export const throttling = (fn:(...args:any[])=>Promise<void>, delay:number) => {
  let flag = true
  return async (...args:any[]) => {
    if (flag) {
      flag = false
      try {
        await fn(...args)
      } finally {
        setTimeout(() => (flag = true), delay)
      }
    }
  }
}