export default function ErrorBox({ message }: { message: string }) {
  return (
    <div
      className="m-4 p-4 rounded-2xl text-sm text-red-500
        shadow-[inset_4px_4px_10px_#c9c7c8,inset_-4px_-4px_10px_#ffffff]
        dark:shadow-[inset_4px_4px_10px_#1a1a1a,inset_-4px_-4px_10px_#3d3d3d]"
    >
      {message}
    </div>
  );
}
