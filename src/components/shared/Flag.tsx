export function Flag({ src, alt }: { src: string; alt: string; }) {
   return (
      <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-border bg-card">
         <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover object-center"
         />
      </div>
   );
}