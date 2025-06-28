import React from "react";

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div
      className={`rounded-lg border border-gray-200 dark:border-gray-300 p-4 shadow  ${className}`}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  className,
  children,
}) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  className,
  children,
}) => {
  return <h2 className={`text-lg font-bold ${className}`}>{children}</h2>;
};

interface CardDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({
  className,
  children,
}) => {
  return <p className={`text-sm text-gray-600 ${className}`}>{children}</p>;
};

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({
  className,
  children,
}) => {
  return <div className={`text-base ${className}`}>{children}</div>;
};
