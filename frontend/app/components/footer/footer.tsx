interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer className={`w-full bg-gray-800 text-white py-4 ${className}`}>
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} StarLab. All rights reserved.</p>
      </div>
    </footer>
  );
}
