interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const SectionHeading = ({ title, subtitle, className = "" }: SectionHeadingProps) => {
  return (
    <div className={`mb-10 ${className}`}>
      <h2 className="font-heading text-3xl tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeading;
