export function Flag({ src, alt }: { src: string; alt: string }) {
   return (
      <div className="h-6 w-6 overflow-hidden rounded-full border border-border">
         <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
         />
      </div>
   );
}