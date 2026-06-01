export default function ErrorBox({ message }: { message: string }) {
  return (
    <div
      className="m-4 p-4 rounded-2xl text-sm text-red-500
        border border-red-200 dark:border-red-900
        bg-red-50 dark:bg-red-950"
    >
      {message}
    </div>
  );
}
