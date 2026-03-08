import { motion } from "framer-motion";
import heroDefault from "@/assets/hero-photo.jpg";

interface HeroPhotoProps {
  src?: string;
  alt?: string;
}

const HeroPhoto = ({ src, alt = "Product Manager" }: HeroPhotoProps) => {
  const photoSrc = src || heroDefault;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
    >
      <img
        src={photoSrc}
        alt={alt}
        className="pointer-events-none select-none h-[300px] w-full rounded-2xl object-cover shadow-[0_12px_40px_rgba(0,0,0,0.1)] md:h-[450px] md:w-[380px]"
        loading="eager"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />
    </motion.div>
  );
};

export default HeroPhoto;
